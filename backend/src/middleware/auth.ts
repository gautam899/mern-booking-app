import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express{
        interface Request{
            userId:string;
        }
    }
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // The first thing that we need to do is access the cokkie that we get with the object recieved in the request
  const token = req.cookies["auth_token"];
  // If we do not have token then we return a unquthorized message
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string);
    // What the above line of code does is it verifies if the token was actually created by us or not. This is done by checking if the token is creating using the secret key that we intialized in the env
    req.userId = (decoded as JwtPayload).userId;
    // The above line of code gives an error because we are adding somthing to the express request which it does not allow.
    // To take care of the error we need to extend the express request type.
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};
export default verifyToken;
