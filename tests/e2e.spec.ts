import { test, expect } from "./fixtures";
import { TEST_URLS } from "./test-data";

test.describe("End-to-End User Flow", () => {
  test("should complete workflow from options configuration to new tab redirect", async ({
    optionsPage,
    newTabPage,
    extensionId,
    page,
  }) => {
    // Configure settings in options page
    await optionsPage.goto(extensionId);
    await optionsPage.fillUrl(TEST_URLS.EXAMPLE_COM);
    await optionsPage.fillRedirectDelay(1000);
    await optionsPage.fillBackgroundColor("#ff0000");
    await optionsPage.clickSave();

    // Wait for save to complete
    await optionsPage.page.waitForTimeout(500);

    // Open new tab normally with chrome://newtab
    await newTabPage.openNewTab();

    // Wait for redirect using page.waitForURL()
    await page.waitForURL(TEST_URLS.EXAMPLE_COM, { timeout: 3000 });

    // Verify redirect occurs to configured URL (normalize trailing slash)
    const finalUrl = page.url().replace(/\/$/, "");
    const expectedUrl = TEST_URLS.EXAMPLE_COM.replace(/\/$/, "");
    expect(finalUrl).toBe(expectedUrl);
  });

  test("should persist settings across new tab opens", async ({
    setStorage,
    newTabPage,
    getStorage,
  }) => {
    // Save settings
    const testUrl = TEST_URLS.EXAMPLE_COM;
    const testDelay = 2000;
    const testColor = "#00ff00";

    await setStorage({
      url: testUrl,
      redirectDelay: testDelay,
      backgroundColor: testColor,
    });

    // Open first new tab
    await newTabPage.openNewTab();
    await newTabPage.page.waitForTimeout(100);

    // Verify settings persist by reading storage
    const storedSettings = await getStorage([
      "url",
      "redirectDelay",
      "backgroundColor",
    ]);
    expect(storedSettings.url).toBe(testUrl);
    expect(storedSettings.redirectDelay).toBe(testDelay);
    expect(storedSettings.backgroundColor).toBe(testColor);

    // Open second new tab
    const page2 = await newTabPage.page.context().newPage();
    const newTabPage2 = new (
      await import("./page-objects/NewTabPage")
    ).NewTabPage(page2);
    await newTabPage2.openNewTab();
    await page2.waitForTimeout(100);

    // Verify settings still persist
    const storedSettings2 = await getStorage([
      "url",
      "redirectDelay",
      "backgroundColor",
    ]);
    expect(storedSettings2.url).toBe(testUrl);
    expect(storedSettings2.redirectDelay).toBe(testDelay);
    expect(storedSettings2.backgroundColor).toBe(testColor);

    await page2.close();
  });

  test("should handle multiple configuration changes correctly", async ({
    optionsPage,
    extensionId,
    getStorage,
  }) => {
    // First configuration change
    await optionsPage.goto(extensionId);
    await optionsPage.fillUrl(TEST_URLS.EXAMPLE_COM);
    await optionsPage.fillRedirectDelay(1000);
    await optionsPage.fillBackgroundColor("#ff0000");
    await optionsPage.clickSave();
    await optionsPage.page.waitForTimeout(500);

    // Verify first change is saved
    let storedSettings = await getStorage([
      "url",
      "redirectDelay",
      "backgroundColor",
    ]);
    expect(storedSettings.url).toBe(TEST_URLS.EXAMPLE_COM);
    expect(storedSettings.redirectDelay).toBe(1000);
    expect(storedSettings.backgroundColor).toBe("#ff0000");

    // Second configuration change
    await optionsPage.goto(extensionId);
    await optionsPage.fillUrl(TEST_URLS.HTTPBIN_ORG);
    await optionsPage.fillRedirectDelay(2000);
    await optionsPage.fillBackgroundColor("#0000ff");
    await optionsPage.clickSave();
    await optionsPage.page.waitForTimeout(500);

    // Verify second change is saved
    storedSettings = await getStorage([
      "url",
      "redirectDelay",
      "backgroundColor",
    ]);
    expect(storedSettings.url).toBe(TEST_URLS.HTTPBIN_ORG);
    expect(storedSettings.redirectDelay).toBe(2000);
    expect(storedSettings.backgroundColor).toBe("#0000ff");

    // Third configuration change
    await optionsPage.goto(extensionId);
    await optionsPage.fillUrl(TEST_URLS.GOOGLE_COM);
    await optionsPage.fillRedirectDelay(500);
    await optionsPage.fillBackgroundColor("#00ff00");
    await optionsPage.clickSave();
    await optionsPage.page.waitForTimeout(500);

    // Verify third change is saved
    storedSettings = await getStorage([
      "url",
      "redirectDelay",
      "backgroundColor",
    ]);
    expect(storedSettings.url).toBe(TEST_URLS.GOOGLE_COM);
    expect(storedSettings.redirectDelay).toBe(500);
    expect(storedSettings.backgroundColor).toBe("#00ff00");
  });

  test("should handle empty settings gracefully", async ({
    clearStorage,
    newTabPage,
  }) => {
    // Clear all settings
    await clearStorage();

    // Open new tab
    await newTabPage.openNewTab();

    // Wait for error message to appear (default behavior for missing URL)
    await expect(newTabPage.getErrorMessage()).toBeVisible({ timeout: 2000 });

    // Verify error message contains expected text
    const errorText = await newTabPage.getErrorMessage().textContent();
    expect(errorText).toContain("No valid URL configured");
  });

  test("should handle invalid URLs gracefully", async ({
    setStorage,
    newTabPage,
  }) => {
    // Set invalid URL
    await setStorage({
      url: "not-a-valid-url",
      redirectDelay: 0,
      backgroundColor: "#05060a",
    });

    // Open new tab
    await newTabPage.openNewTab();

    // Wait for error message to appear
    await expect(newTabPage.getErrorMessage()).toBeVisible({ timeout: 2000 });

    // Verify error message contains expected text
    const errorText = await newTabPage.getErrorMessage().textContent();
    expect(errorText).toContain("No valid URL configured");
  });

  test("should handle extreme delay values", async ({
    setStorage,
    newTabPage,
    page,
  }) => {
    // Set test timeout to 10 seconds (5000ms delay + buffer)
    test.setTimeout(10000);

    // Set delay to a large but reasonable value (5000ms) to test delay handling
    // without slowing down tests excessively
    const testUrl = TEST_URLS.EXAMPLE_COM;
    await setStorage({
      url: testUrl,
      redirectDelay: 5000,
      backgroundColor: "#05060a",
    });

    // Open new tab
    await newTabPage.openNewTab();

    // Wait for redirect (with extra buffer for delay)
    await page.waitForURL(testUrl, { timeout: 8000 });

    // Verify redirect still occurs
    const finalUrl = page.url().replace(/\/$/, "");
    const expectedUrl = testUrl.replace(/\/$/, "");
    expect(finalUrl).toBe(expectedUrl);
  });

  test("should handle immediate redirect (0ms delay)", async ({
    setStorage,
    newTabPage,
    page,
  }) => {
    // Set delay to 0
    const testUrl = TEST_URLS.EXAMPLE_COM;
    await setStorage({
      url: testUrl,
      redirectDelay: 0,
      backgroundColor: "#05060a",
    });

    // Open new tab
    await newTabPage.openNewTab();

    // Wait a bit to ensure page has loaded
    await page.waitForTimeout(100);

    // Verify loading animation is hidden (no delay means no animation)
    const loadingElement = newTabPage.getLoadingAnimation();
    await expect(loadingElement).toBeHidden();

    // Wait for redirect (should be immediate)
    await page.waitForURL(testUrl, { timeout: 2000 });

    // Verify redirect occurs
    const finalUrl = page.url().replace(/\/$/, "");
    const expectedUrl = testUrl.replace(/\/$/, "");
    expect(finalUrl).toBe(expectedUrl);
  });

  test("should apply background color changes immediately", async ({
    optionsPage,
    newTabPage,
    extensionId,
  }) => {
    // Change color in options
    await optionsPage.goto(extensionId);
    await optionsPage.fillUrl(TEST_URLS.EXAMPLE_COM);
    await optionsPage.fillRedirectDelay(1000);
    await optionsPage.fillBackgroundColor("#ff0000");
    await optionsPage.clickSave();
    await optionsPage.page.waitForTimeout(500);

    // Open new tab
    await newTabPage.openNewTab();

    // Verify background color is applied
    const backgroundColor = await newTabPage.getBackgroundColor();
    expect(backgroundColor).toBe("rgb(255, 0, 0)"); // #ff0000 in RGB
  });
});
