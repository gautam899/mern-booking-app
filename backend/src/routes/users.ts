import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
const router = express.Router();
import { check, validationResult } from "express-validator";
// This is the handler for /api/users/register
router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 character").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    // Get any errors that express validators has got.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      // Now the first thing that we are going to do is we are going to the
      //user model in the database and we are going to check if the email already exist if it does then we are ogig ot return the
      //status 400 i.e a bad request.
      let user = await User.findOne({
        email: req.body.email,
      });
      if (user) {
        return res.status(400).json({ message: "User already exist" });
      }

      // If the user does not exist then we are going to create a new user and we will pass the req.body that will contain the email, name etc.
      user = new User(req.body);
      await user.save();

      //Lets create a jwt token.
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      // In the response we will be sending a cookie which will containing the token and we will only send the cookie when we are in the production phase
      // and if
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      return res.status(200).send({message: "User registered OK"});
    } catch (error) {
      // Now if something goes wrong then we will display a generic message that something went wrong. The reson why we do not want to display a specific message is because the
      //error could be from the bd and it could contain any confidential info.
      console.log(error); //For us
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);
export default router;
