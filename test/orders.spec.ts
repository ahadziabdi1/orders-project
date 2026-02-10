import { test, expect } from "@playwright/test";

test.describe("Order Management Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByLabel(/Email Address/i).fill("zanaAdmin@infostudio.com");
    await page.getByLabel(/Password/i).fill("zanaA");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByText("Orders Management")).toBeVisible();
  });

  test("successfully adding a new order", async ({ page }) => {
    await page.getByRole("button", { name: "Add New Order" }).click();

    await page.getByPlaceholder("Search customers...").click();
    await page.getByRole("option").first().click();

    await page.getByPlaceholder("Search products...").click();
    await page.getByRole("option").first().click();

    await page.locator('input[name="quantity"]').fill("3");
    await page
      .getByPlaceholder(/Enter delivery address/)
      .fill("Testna adresa 123");

    await page.getByRole("button", { name: "Create Order" }).click();

    await expect(page.getByText(/Order successfully created/i)).toBeVisible();
  });

  test("validation: show error when product is not selected", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add New Order" }).click();

    await page.getByPlaceholder("Search customers...").click();
    await page.getByRole("option").first().click();

    await page
      .getByPlaceholder(/Enter delivery address/)
      .fill("Testna adresa 123");

    await page.getByRole("button", { name: "Create Order" }).click();

    await expect(
      page.getByText(/Selecting a product is required/i)
    ).toBeVisible();
  });

  test("successfully filtering orders within the DataGrid", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by customer name/i);

    await searchInput.fill("John Doe");

    const results = page.getByRole("gridcell", { name: "John Doe" });

    await expect(results.first()).toBeVisible();

    const count = await results.count();
    expect(count).toBeGreaterThan(0);

    await expect(
      page.getByRole("gridcell", { name: "Aidahadziabdic8" })
    ).not.toBeVisible();
  });
});
