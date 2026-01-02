import { test, expect } from "./fixtures";

test.describe("Extension Installation and Setup", () => {
  test("should load extension successfully", async ({ context }) => {
    // Verify extension context is created
    expect(context).toBeDefined();
    expect(context.pages().length).toBeGreaterThanOrEqual(0);
  });

  test("should retrieve valid extension ID", async ({ extensionId }) => {
    // Verify extensionId fixture returns a non-empty string
    expect(extensionId).toBeDefined();
    expect(typeof extensionId).toBe("string");
    expect(extensionId.length).toBeGreaterThan(0);
    // Extension IDs are typically 32 characters (lowercase letters)
    expect(extensionId).toMatch(/^[a-z]{32}$/);
  });

  test("should initialize service worker", async ({ context, extensionId }) => {
    const serviceWorkers = context.serviceWorkers();
    expect(serviceWorkers.length).toBeGreaterThan(0);
    expect(serviceWorkers[0].url()).toContain(extensionId);

    // Verify extension is accessible by checking manifest
    const page = await context.newPage();
    const manifestUrl = `chrome-extension://${extensionId}/manifest.json`;
    const response = await page.goto(manifestUrl);
    expect(response?.status()).toBe(200);
    await page.close();
  });

  test("should have all required extension files accessible", async ({
    context,
    extensionId,
  }) => {
    // Navigate to manifest.json and verify it loads
    const page = await context.newPage();
    const manifestUrl = `chrome-extension://${extensionId}/manifest.json`;
    const response = await page.goto(manifestUrl);

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    // Verify manifest content is valid JSON
    const manifestContent = await page.textContent("body");
    expect(manifestContent).not.toBeNull();
    const manifest = JSON.parse(manifestContent!);
    expect(manifest).toHaveProperty("manifest_version");
    expect(manifest).toHaveProperty("name");
    expect(manifest).toHaveProperty("version");

    await page.close();
  });

  test("should load newtab.html", async ({ context, extensionId }) => {
    // Navigate to newtab.html and verify page loads
    const page = await context.newPage();
    const newtabUrl = `chrome-extension://${extensionId}/newtab.html`;
    const response = await page.goto(newtabUrl);

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    // Verify page title
    await expect(page).toHaveTitle(/Shadow Tab/i);

    // Verify key elements exist (loading might be hidden initially)
    await expect(page.locator("#loading")).toBeAttached();
    await expect(page.locator("#error-message")).toBeAttached();

    await page.close();
  });

  test("should load options.html", async ({ context, extensionId }) => {
    // Navigate to options.html and verify page loads
    const page = await context.newPage();
    const optionsUrl = `chrome-extension://${extensionId}/options.html`;
    const response = await page.goto(optionsUrl);

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    // Verify page title
    await expect(page).toHaveTitle(/Shadow Tab - Options/i);

    // Verify key form elements exist
    await expect(page.locator("#url-input")).toBeVisible();
    await expect(page.locator("#redirect-delay-input")).toBeVisible();
    await expect(page.locator("#background-color-input")).toBeVisible();
    await expect(page.locator("#color-picker")).toBeVisible();
    await expect(page.locator("#save-button")).toBeVisible();

    // Capture screenshot for visual confirmation
    await page.screenshot({
      path: "test-results/options-page-loaded.png",
      fullPage: true,
    });

    await page.close();
  });
});
