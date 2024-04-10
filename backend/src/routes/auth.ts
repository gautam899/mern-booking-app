import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
const router = express.Router();

// Define a endpoint and do some validation checks for the email and the password.
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password should be a min of 6 char").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    // Do a error check in the input of the user if any return a error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    // destructure the email and the password feild from the req body
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      // If the user is not registered then we return 400 i.e bad request.
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      //But if we do have a user then we actually check if the password matches the password in the database.
      const isMatch = await bcrypt.compare(password, user.password);
      // If the password does not match with hashed password then we do not display the message password invalid but instead simply dispaly
      //a generic meessage that invalid credentails because it is much more safer.
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // create a access token.
      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      //   In response we will send the user id from the mongodb db.
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error); //Only for the devlopers.
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// What the below get is request is doing is whenever the frontend is making a request on the endpoint
//it run a middle ware which runs some checks and return if the token is valid or not.
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// 7. Lets create the log out functionality here.
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  // Make sure we send back a response using res.send otherwise the resonse will keep on hanging in middle.
  res.send();
});
export default router;
