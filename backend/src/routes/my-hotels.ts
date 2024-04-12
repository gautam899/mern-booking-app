// Lets the user create and update hotels
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotels";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
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
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('City is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Hotel type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('Price per Night is required and must be number'),
    body("facility").notEmpty().isArray().withMessage('Facilities are required'),

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
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        // Now attach the type image whether jpeg or png to the base64 string to tell cloudinary about the type of the strings.
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });
      //   Step 2:
      // We will wait till all the images are uploaded before we get string array getting assigned to the imageurl variable.
      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; //Get the userId from the auth token

      //   Save the new hotel to our database; Create a documnet object out of this.
      const hotel = new Hotel(newHotel);
      await hotel.save();
      //Step 4:
      res.status(201).send(hotel);
    } catch (e) {
      console.log("Error creating hotel: ", e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;