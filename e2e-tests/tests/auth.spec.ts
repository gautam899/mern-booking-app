import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test("should allow the user to sign in", async ({ page }) => {
  // Go to the page url
  await page.goto(UI_URL);

  // Get the signin button. Wait for the signin button to appear and wait for the click to happen.
  await page.getByRole("link", { name: "Sign In" }).click();
  // Now we need to assert that we have arrived on the signin page.
  //We can do this using the expect
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("2@2.com");
  await page.locator("[name=password]").fill("123456");

  // Now we need to test the login button by clicking the login button.
  await page.getByRole("button", { name: "Login" }).click();

  // NOw to check if the user has logged in we need to assert on few thing like the links on the side of the logout link and the signin successfull
  //toast
  await expect(page.getByText("Sign in Successfull")).toBeVisible();
  // Check the links
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

// The login functionality is robust and checks the login functionality and since it is created with seperate testing database
//the above functionality will always work as the user in the testing database will always existing.

test("should allow user to register", async ({ page }) => {
  //One thing that we will face here is that if we run this test again we will face a error that the user already exist. To overcome that error what we will do is 
  //we will create a random email every time we run the registration test.
  const testEmail = `test_register_${Math.floor(Math.random()*9000)+10000}@test.com`;
  await page.goto(UI_URL);
  // This time we want to click the link on the signin page which says that create an account here.

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();

  // We want the create account to be visible
  await expect(
    page.getByRole("heading", { name: "Create an account" })
  ).toBeVisible();
  // Fill in the fields
  await page.locator("[name=firstName]").fill("text_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("Registration Success")).toBeVisible();
  // Check the links
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
