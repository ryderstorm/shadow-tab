import { test, expect } from "./fixtures";
import { TEST_URLS } from "./test-data";

test.describe("Options Page Functionality", () => {
  test("should load and display current settings from storage", async ({
    setStorage,
    optionsPage,
    extensionId,
  }) => {
    // Set chrome.storage.local using storage helper
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 2000,
      backgroundColor: "#ff0000",
    });

    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Verify form fields are populated
    await expect(optionsPage.getUrlInput()).toHaveValue(TEST_URLS.EXAMPLE_COM);
    await expect(optionsPage.getRedirectDelayInput()).toHaveValue("2000");
    await expect(optionsPage.getBackgroundColorInput()).toHaveValue("#ff0000");
  });

  test("should validate URL format in real-time", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Type invalid URL
    await optionsPage.fillUrl("not-a-valid-url");

    // Wait for validation to trigger (debounced)
    await optionsPage.page.waitForTimeout(1500);

    // Verify error message appears
    await expect(optionsPage.getUrlError()).toBeVisible();
    const errorText = await optionsPage.getUrlError().textContent();
    expect(errorText).toContain("valid URL");
  });

  test("should validate redirect delay range", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Test negative value
    await optionsPage.fillRedirectDelay(-100);
    await expect(optionsPage.getRedirectDelayError()).toBeVisible();
    let errorText = await optionsPage.getRedirectDelayError().textContent();
    expect(errorText).toContain("valid delay");

    // Clear error
    await optionsPage.getRedirectDelayInput().clear();

    // Test value above maximum (60000ms)
    await optionsPage.fillRedirectDelay(70000);
    await expect(optionsPage.getRedirectDelayError()).toBeVisible();
    errorText = await optionsPage.getRedirectDelayError().textContent();
    expect(errorText).toContain("valid delay");

    // Clear error
    await optionsPage.getRedirectDelayInput().clear();

    // Test valid value (should not show error)
    await optionsPage.fillRedirectDelay(5000);
    await expect(optionsPage.getRedirectDelayError()).toBeHidden();
  });

  test("should validate background color format", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Test invalid color value
    await optionsPage.fillBackgroundColor("not-a-color");
    await expect(optionsPage.getBackgroundColorError()).toBeVisible();
    const errorText = await optionsPage.getBackgroundColorError().textContent();
    expect(errorText).toContain("valid CSS color");

    // Clear error
    await optionsPage.getBackgroundColorInput().clear();

    // Test valid hex color (should not show error)
    await optionsPage.fillBackgroundColor("#05060a");
    await expect(optionsPage.getBackgroundColorError()).toBeHidden();
  });

  test("should save settings to storage when Save button is clicked", async ({
    optionsPage,
    extensionId,
    getStorage,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Fill form
    await optionsPage.fillUrl(TEST_URLS.EXAMPLE_COM);
    await optionsPage.fillRedirectDelay(3000);
    await optionsPage.fillBackgroundColor("#00ff00");

    // Click save
    await optionsPage.clickSave();

    // Wait for save to complete
    await optionsPage.page.waitForTimeout(500);

    // Use storage helper to read chrome.storage.local
    const storedSettings = await getStorage([
      "url",
      "redirectDelay",
      "backgroundColor",
    ]);

    // Verify settings are saved correctly
    expect(storedSettings.url).toBe(TEST_URLS.EXAMPLE_COM);
    expect(storedSettings.redirectDelay).toBe(3000);
    expect(storedSettings.backgroundColor).toBe("#00ff00");
  });

  test("should display success message after successful save", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Fill form with valid values
    await optionsPage.fillUrl(TEST_URLS.EXAMPLE_COM);
    await optionsPage.fillRedirectDelay(1000);
    await optionsPage.fillBackgroundColor("#05060a");

    // Click save
    await optionsPage.clickSave();

    // Verify success message appears
    await expect(optionsPage.getSuccessMessage()).toBeVisible({
      timeout: 2000,
    });
    const successText = await optionsPage.getSuccessMessage().textContent();
    expect(successText).toContain("saved successfully");
  });

  test("should update page background color when color picker changes", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Get initial background color
    const initialColor = await optionsPage.getBackgroundColor();

    // Change color picker to a different color
    await optionsPage.getColorPicker().fill("#ff0000");

    // Wait for color to apply
    await optionsPage.page.waitForTimeout(200);

    // Verify color picker value is set
    const colorPickerValue = await optionsPage.getColorPicker().inputValue();
    expect(colorPickerValue.toLowerCase()).toBe("#ff0000");

    // Verify body background color updates (should be red-ish, not the initial color)
    const backgroundColor = await optionsPage.getBackgroundColor();
    expect(backgroundColor).not.toBe(initialColor);
    // Verify it's a red color (R component should be high)
    const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    expect(rgbMatch).not.toBeNull();
    expect(rgbMatch).toHaveLength(4); // Full match + 3 groups
    const r = parseInt(rgbMatch![1]);
    const g = parseInt(rgbMatch![2]);
    const b = parseInt(rgbMatch![3]);
    // Red should be high, green and blue should be low
    expect(r).toBeGreaterThan(200);
    expect(g).toBeLessThan(50);
    expect(b).toBeLessThan(50);
  });

  test("should update page background color when preset color button is clicked", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Get initial background color
    const initialColor = await optionsPage.getBackgroundColor();

    // Click preset color button (Midnight Blue: #191970)
    await optionsPage.getPresetColorButton("#191970").click();

    // Wait for color to apply
    await optionsPage.page.waitForTimeout(200);

    // Verify color inputs are updated
    const backgroundColorInput = await optionsPage
      .getBackgroundColorInput()
      .inputValue();
    expect(backgroundColorInput.toLowerCase()).toBe("#191970");
    const colorPickerValue = await optionsPage.getColorPicker().inputValue();
    expect(colorPickerValue.toLowerCase()).toBe("#191970");

    // Verify body background color updates (should be different from initial)
    const backgroundColor = await optionsPage.getBackgroundColor();
    expect(backgroundColor).not.toBe(initialColor);
    // Verify it's a blue-ish color (B component should be higher than R and G)
    const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    expect(rgbMatch).not.toBeNull();
    expect(rgbMatch).toHaveLength(4); // Full match + 3 groups
    const r = parseInt(rgbMatch![1]);
    const g = parseInt(rgbMatch![2]);
    const b = parseInt(rgbMatch![3]);
    // Blue should be highest component (Midnight Blue is dark blue)
    expect(b).toBeGreaterThan(r);
    expect(b).toBeGreaterThan(g);
    // Values should be in the range for #191970 (rgb(25, 25, 112))
    expect(b).toBeGreaterThan(100);
    expect(r).toBeLessThan(50);
    expect(g).toBeLessThan(50);
  });

  test("should display version information in footer", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Verify version footer contains version text
    await expect(optionsPage.getVersionFooter()).toBeVisible();
    const versionText = await optionsPage.getVersionFooter().textContent();
    expect(versionText).toContain("Version:");
    expect(versionText).toMatch(/Version:\s*\d+\.\d+\.\d+/);
  });

  test("should handle URL validation with real URLs", async ({
    optionsPage,
    extensionId,
  }) => {
    // Navigate to options page
    await optionsPage.goto(extensionId);

    // Test valid URL format
    await optionsPage.fillUrl(TEST_URLS.EXAMPLE_COM);
    await optionsPage.page.waitForTimeout(1500); // Wait for debounced validation
    await expect(optionsPage.getUrlError()).toBeHidden();

    // Test invalid URL format
    await optionsPage.fillUrl("invalid-url");
    await optionsPage.page.waitForTimeout(1500);
    await expect(optionsPage.getUrlError()).toBeVisible();
    const errorText = await optionsPage.getUrlError().textContent();
    expect(errorText).toContain("valid URL");

    // Test valid URL format again
    await optionsPage.fillUrl(TEST_URLS.HTTPBIN_ORG);
    await optionsPage.page.waitForTimeout(1500);
    // URL validation may show "validating url..." message
    // Format error should be hidden for valid URL format
    const urlErrorAfterValid = optionsPage.getUrlError();
    const errorTextAfterValid = await urlErrorAfterValid.textContent();
    // Error text may be empty (no error) or contain reachability message, but not format error
    expect(errorTextAfterValid).not.toContain("Invalid URL format");
    expect(errorTextAfterValid).not.toContain("Please enter a valid URL");
  });
});
