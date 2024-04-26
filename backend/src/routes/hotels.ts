import express, { Request, Response, query } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";

const router = express.Router();

// api/hotels/search
router.get("/search", async (req: Request, res: Response) => {
  // Get all the hotels and send them to the user. The reason why
  // we are doing this is intially the user might not know where does the user wants to go and
  //or he/she might need to see all the hotels at once
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};

    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 }; //this will sort all the hotels based on the start rating from high to low.
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 }; //Sort the query results from lowest price per night to heighest price per night.
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 }; //Sort the query results from lowest price per night to heighest price per night.
        break;
    }
    const pageSize = 5; //Default number of hotels which will appear on each page.
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    ); //The page number user has clicke in the pagination.

    //page 3
    const skip = (pageNumber - 1) * pageSize; //how many pages to skip
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize); //But if we are having 100 or may be 1000 hotels then we do not want to display all of them on each click so we will
    //add a pagination i.e page 1,2,...

    // Now in places where we have pagination it is a good idea to send the pagination data to the frontend so that it can decide what data to display and what to display.
    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Something Went wrong" });
  }
});
// /api/hotels/9876543210. This is for the View more page when we search for the hotels
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("hotel Id is Required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();  
    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: errors.array() }); 
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }
  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }
  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }
  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  // Handle the start rating
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);
    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
      // This will return all the hotels less than on equal to the maxPrice we received in the queryParams
    };
  }
  return constructedQuery;
};
export default router;
