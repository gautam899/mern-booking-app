// There we will be having our rest api servers

import express from "express"; //To create API
import cors from "cors"; //For securing the cross origin resource sharing
import "dotenv/config";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING as string);
const app = express(); //Create a express app.
// Now we just need to tell our app to use the cokkie parser
app.use(cookieParser());
app.use(express.json()); //Convert the body into json so that we do not have to convert the body into json at each of our endpoints.
app.use(express.urlencoded({ extended: true })); //Helps to parse the urls.

// Step:5
// What the below code means is the our server is going to only accept the request coming from the below url and it must contain the credentials(cookies).
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// go to the dist folder in the frontend which contains the frontend static assests and serve it on the route of the url that the backend run on.
app.use(express.static(path.join(__dirname,"../../frontend/dist")));

app.use("/api/auth", authRoutes);
// Any request that comes to the api which is prefixed with /api/users pass them to the user routes and inside the users.ts we have the handles for that request.
app.use("/api/users", userRoutes);

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
