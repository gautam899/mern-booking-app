// Lets the user create and update hotels
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";
const router = express.Router();

const storage = multer.memoryStorage(); //Store any files that we get from push request in the memory.

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

// api/my-hotels
// This is the endo point to which the front end will make a request to whenever the user submits a add hotel form.
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per Night is required and must be number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // 1. Upload the image to cloudinary
      // 2. If the upload is successfull, add the url's to the new hotel
      // 3. Save the new Hotel in our database
      // 4. Return a 201 status.

      // Step 1: Iterate the image files and map through each image and convert it into base64 string.
      // convert the image into a string that describes the image and upload it to the cloudinary and if everything goes well then we return the url from the cloudinary.
      const imageUrls = await uploadImages(imageFiles); //Upload image function that takes our image files and return the image urls.
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; //Get the userId from the auth token

      //   Save the new hotel to our database; Create a documnet object out of this.
      const hotel = new Hotel(newHotel);
      await hotel.save();
      //Step 4:
      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Now lets create the api endpoint for the my hotels page.
// Also we need to verify token before proceeding with creating the myhotels page.
router.get("/", verifyToken, async (req: Request, res: Response) => {
  // Get the user id from the request body and find that user Id to return the myhotels

  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  //api/my-hotels/9876543210
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id, //hotel id
      userId: req.userId, //Logged in user id
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching hotels" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      // Now we need to make the changes in the backend when delete the pics in the edithotel page of our app. It will be kind of similar to a post request since
      //we are posting a change in the database
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const files = req.files as Express.Multer.File[];

      const updatedImageUrls = await uploadImages(files); //This will upload the new images to the cloudinary and it will give us back the new url's as

      //add this our new hotel object
      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ]; //... used for spreading.
      await hotel.save();

      res.status(201).json(hotel); //request completes as well and sends the hotel back as a json object.
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    // Now before uploading the image we first need to convert the image buffer to base64 string. This is
    //a common way to encode the binary data, like an image into a string format that can be easily transmitted.
    const b64 = Buffer.from(image.buffer).toString("base64");
    // Now attach the type image whether jpeg or png to the base64 string to tell cloudinary about the type of the strings.
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    // Now upload the image to the cloudinary using the method of cloudinary.v2.uploader object. This method returns a promise that resolve to the result of the upload operation.
    const res = await cloudinary.v2.uploader.upload(dataURI);
    // the result of the uploaded operation is an object is url, which is the url of the uploaded
    return res.url;
  });
  //   Step 2:
  // We will wait till all the images are uploaded before we get string array getting assigned to the imageurl variable.
  //Basically we are waiting for all the promises to get resolved.
  const imageUrls = await Promise.all(uploadPromises); //This return a array of urls of the uploaded images. and we finally return this array of urls.
  return imageUrls;
}

export default router;
