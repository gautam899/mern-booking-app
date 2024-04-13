import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelType} from "../../backend/src/shared/types";
// The reason why we have added the pipe and the empty quotes at the end is because the api base url is need when
//the frontend and the backend are on the seperate server. But whenever we have our backend  and frontend bundled for production when we have the frontend and the backend on same server then we
//do not need to api-base url.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// In this file we are going to keep all our fetch request to keep our code cleaner.
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include", //Step 5. We want to include any http cookie with this object that we are passing when defining the end points. But here we are not dealing with actual cookies in this code.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // The await in the above piece of code makes a fetech request and the server sends back a response that gets stored in the response const and
  //now we need to see the body of the response so that we can display messages
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.messages);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include", //Step 5. We want to include any http cookie with this object that we are passing when defining the end points. But here we are not dealing with actual cookies in this code.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.messages);
  }
  return body;
};
export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  // We will tell the server in the fetch request that send if there is any fetch request.
  if (!response.ok) {
    throw new Error("Token Invalid");
  }
  return response.json();
};

// Now we need to create a fetch request for the logout endpoint.
export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};
// We will call the above fetch request from the button in the header in the frontend

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]>=> {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
    credentials:"include"
  });
  
  // If the response in not okay then we are going to throw a generic error.
  if(!response.ok){
    throw new Error("Error fetching hotels");
  }

  //If everything went well then we are going to get an array hotels back in the body of res
  return response.json();
};
