import { test, expect } from "./fixtures";
import { TEST_URLS } from "./test-data";

test.describe("New Tab Page Functionality", () => {
  test("should load settings from storage and apply background color", async ({
    setStorage,
    newTabPage,
  }) => {
    // Set background color in storage
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 1000,
      backgroundColor: "#ff0000",
    });

    // Open new tab (after storage is set)
    await newTabPage.openNewTab();

    // Verify background color is applied
    const backgroundColor = await newTabPage.getBackgroundColor();
    expect(backgroundColor).toBe("rgb(255, 0, 0)"); // #ff0000 in RGB
  });

  test("should display loading animation when delay is greater than 0ms", async ({
    setStorage,
    newTabPage,
  }) => {
    // Set delay > 0
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 2000,
      backgroundColor: "#05060a",
    });

    // Open new tab (after storage is set)
    await newTabPage.openNewTab();

    // Verify loading animation is visible
    await expect(newTabPage.getLoadingAnimation()).toBeVisible();
  });

  test("should not display loading animation when delay is 0ms", async ({
    setStorage,
    newTabPage,
    page,
  }) => {
    // Set delay to 0
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 0,
      backgroundColor: "#05060a",
    });

    // Open new tab (after storage is set)
    await newTabPage.openNewTab();

    // Wait a bit to ensure page has loaded
    await page.waitForTimeout(100);

    // Verify loading animation is hidden
    const loadingElement = newTabPage.getLoadingAnimation();
    await expect(loadingElement).toBeHidden();
  });

  test("should redirect to configured URL after delay", async ({
    setStorage,
    newTabPage,
    page,
  }) => {
    // Set URL and delay in storage
    const testUrl = TEST_URLS.EXAMPLE_COM;
    await setStorage({
      url: testUrl,
      redirectDelay: 500,
      backgroundColor: "#05060a",
    });

    // Open new tab (after storage is set)
    await newTabPage.openNewTab();

    // Wait for redirect
    await page.waitForURL(testUrl, { timeout: 2000 });

    // Verify final URL matches configured URL (normalize trailing slash)
    const finalUrl = page.url().replace(/\/$/, "");
    const expectedUrl = testUrl.replace(/\/$/, "");
    expect(finalUrl).toBe(expectedUrl);
  });

  test("should display error message when URL is invalid", async ({
    setStorage,
    newTabPage,
  }) => {
    // Set invalid URL in storage
    await setStorage({
      url: "not-a-valid-url",
      redirectDelay: 0,
      backgroundColor: "#05060a",
    });

    // Open new tab (after storage is set)
    await newTabPage.openNewTab();

    // Wait for error message to appear
    await expect(newTabPage.getErrorMessage()).toBeVisible({ timeout: 2000 });

    // Verify error message contains expected text
    // When invalid URL is set, loadAndApplySettings shows "No valid URL configured"
    const errorText = await newTabPage.getErrorMessage().textContent();
    expect(errorText).toContain("No valid URL configured");
  });

  test("should display error message when URL is missing", async ({
    clearStorage,
    newTabPage,
  }) => {
    // Clear URL from storage
    await clearStorage();

    // Open new tab (after storage is cleared)
    await newTabPage.openNewTab();

    // Wait for error message to appear
    await expect(newTabPage.getErrorMessage()).toBeVisible({ timeout: 2000 });

    // Verify error message contains expected text
    const errorText = await newTabPage.getErrorMessage().textContent();
    expect(errorText).toContain("No valid URL configured");
  });

  test("should use default background color when no color is configured", async ({
    setStorage,
    newTabPage,
  }) => {
    // Clear backgroundColor from storage (only set URL)
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 1000,
      // backgroundColor not set
    });

    // Open new tab (after storage is set)
    await newTabPage.openNewTab();

    // Verify default color (#05060a) is applied
    const backgroundColor = await newTabPage.getBackgroundColor();
    // #05060a converts to rgb(5, 6, 10)
    expect(backgroundColor).toBe("rgb(5, 6, 10)");
  });
});
