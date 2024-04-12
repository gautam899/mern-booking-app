import { test, expect } from "@playwright/test";
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

test("Should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("This is the test description for the test hotel.");
  await page.locator('[name="pricePerNight"]').fill("10000");

  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "pic1.jpeg"),
    path.join(__dirname, "files", "pic2.jpeg"),
    path.join(__dirname, "files", "pic3.jpeg"),
    path.join(__dirname, "files", "pic4.jpeg"),
  ]);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});
