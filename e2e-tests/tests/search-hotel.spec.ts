import {test,expect} from "@playwright/test";

const UI_URL = "http://localhost:5173/";
import path from "path";
// First thing that we need to do here is we need to setup a sigin
//test since we need that the user who is using the app must be signed in the app.
test.beforeEach(async ({ page }) => {
  // Go to the page url
  await page.goto(`${UI_URL}`);

  // Get the signin button. Wait for the signin button to appear and wait for the click to happen.
  await page.getByRole("link", { name: "Sign In" }).click();
  // Now we need to assert that we have arrived on the signin page.
  // We can do this using the expect
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("2@2.com");
  await page.locator("[name=password]").fill("123456");

  // Now we need to test the login button by clicking the login button.
  await page.getByRole("button", { name: "Login" }).click();

  // NOw to check if the user has logged in we need to assert on few thing like the links on the side of the logout link and the signin successfull
  //toast
  await expect(page.getByText("Sign in Successfull")).toBeVisible();
});
 
// Write a test 
test("Should Show hotel search result",async({page})=>{
  await page.goto(UI_URL);
 
  await page.getByPlaceholder("Where are you going?").fill("Test City");
  await page.getByRole("button",{name:"Search"}).click();
  await expect(page.getByText("Hotels found in Test City")).toBeVisible();
  await expect(page.getByText("Test Hotel").nth(0)).toBeVisible();
});

//Lets write a test for showing a hotel details
test("should show the hotel details",async({page})=>{
  await page.goto(UI_URL);
  await page.getByPlaceholder("Where are you going?").fill("Test City");
  await page.getByRole("button", { name: "Search" }).click();
  const elements = await page.$$('My Hotel');
  await elements[0].click();
  await page.getByText("Test Hotel").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button",{name:"Book Now"})).toBeVisible();
  

})