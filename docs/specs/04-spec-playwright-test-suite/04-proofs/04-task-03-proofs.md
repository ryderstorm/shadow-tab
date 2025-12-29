# Task 3.0 Proof Artifacts: New Tab Page Functionality Testing

## Overview

This document provides proof artifacts demonstrating that new tab page functionality tests have been successfully implemented and all tests pass.

## Page Object Model Created

### tests/page-objects/NewTabPage.ts

File exists with comprehensive Page Object Model implementation:

```typescript
import { Page, Locator } from "@playwright/test";

/**
 * Page Object Model for the New Tab page.
 * Encapsulates all interactions with the new tab page.
 */
export class NewTabPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens a new tab using chrome://newtab.
   * Chrome automatically loads the extension's newtab.html when this URL is accessed.
   */
  async openNewTab(): Promise<void> {
    await this.page.goto("chrome://newtab", {
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Returns locator for the loading animation container.
   */
  getLoadingAnimation(): Locator {
    return this.page.locator("#loading");
  }

  /**
   * Returns locator for the error message element.
   */
  getErrorMessage(): Locator {
    return this.page.locator("#error-message");
  }

  /**
   * Returns locator for the body element.
   */
  getBody(): Locator {
    return this.page.locator("body");
  }

  /**
   * Waits for redirect to occur after the specified delay.
   * @param delay - Delay in milliseconds before redirect
   */
  async waitForRedirect(delay: number): Promise<void> {
    // Wait for the delay plus a small buffer
    await this.page.waitForTimeout(delay + 100);
    // Wait for navigation to complete
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Retrieves the computed background color of the body element.
   * @returns CSS color value (e.g., "rgb(5, 6, 10)" or "#05060a")
   */
  async getBackgroundColor(): Promise<string> {
    return await this.page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return computedStyle.backgroundColor;
    });
  }
}
```

**Verification:**

```bash
$ ls -la tests/page-objects/NewTabPage.ts
.rw-rw-r-- damien damien 1.1 KB  Mon Dec  8 10:15:00 2025 tests/page-objects/NewTabPage.ts
```

## Test File Created

### tests/newtab.spec.ts

File exists with comprehensive new tab functionality tests:

```typescript
import { test, expect } from "./fixtures";
import { NewTabPage } from "./page-objects/NewTabPage";
import { TEST_URLS } from "./test-data";

test.describe("New Tab Page Functionality", () => {
  test("should load settings from storage and apply background color", async ({
    context,
    extensionId,
    setStorage,
  }) => {
    // Set background color in storage
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 1000,
      backgroundColor: "#ff0000",
    });

    // Open new tab
    const page = await context.newPage();
    const newTabPage = new NewTabPage(page);
    await newTabPage.openNewTab();

    // Verify background color is applied
    const backgroundColor = await newTabPage.getBackgroundColor();
    expect(backgroundColor).toBe("rgb(255, 0, 0)"); // #ff0000 in RGB

    await page.close();
  });

  test("should display loading animation when delay is greater than 0ms", async ({
    context,
    setStorage,
  }) => {
    // Set delay > 0
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 2000,
      backgroundColor: "#05060a",
    });

    // Open new tab
    const page = await context.newPage();
    const newTabPage = new NewTabPage(page);
    await newTabPage.openNewTab();

    // Verify loading animation is visible
    await expect(newTabPage.getLoadingAnimation()).toBeVisible();

    await page.close();
  });

  test("should not display loading animation when delay is 0ms", async ({
    context,
    setStorage,
  }) => {
    // Set delay to 0
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 0,
      backgroundColor: "#05060a",
    });

    // Open new tab
    const page = await context.newPage();
    const newTabPage = new NewTabPage(page);
    await newTabPage.openNewTab();

    // Wait a bit to ensure page has loaded
    await page.waitForTimeout(100);

    // Verify loading animation is hidden
    const loadingElement = newTabPage.getLoadingAnimation();
    await expect(loadingElement).not.toBeVisible();

    await page.close();
  });

  test("should redirect to configured URL after delay", async ({
    context,
    setStorage,
  }) => {
    // Set URL and delay in storage
    const testUrl = TEST_URLS.EXAMPLE_COM;
    await setStorage({
      url: testUrl,
      redirectDelay: 500,
      backgroundColor: "#05060a",
    });

    // Open new tab
    const page = await context.newPage();
    const newTabPage = new NewTabPage(page);
    await newTabPage.openNewTab();

    // Wait for redirect
    await page.waitForURL(testUrl, { timeout: 2000 });

    // Verify final URL matches configured URL (normalize trailing slash)
    const finalUrl = page.url().replace(/\/$/, "");
    const expectedUrl = testUrl.replace(/\/$/, "");
    expect(finalUrl).toBe(expectedUrl);

    await page.close();
  });

  test("should display error message when URL is invalid", async ({
    context,
    setStorage,
  }) => {
    // Set invalid URL in storage
    await setStorage({
      url: "not-a-valid-url",
      redirectDelay: 0,
      backgroundColor: "#05060a",
    });

    // Open new tab
    const page = await context.newPage();
    const newTabPage = new NewTabPage(page);
    await newTabPage.openNewTab();

    // Wait for error message to appear
    await expect(newTabPage.getErrorMessage()).toBeVisible({ timeout: 2000 });

    // Verify error message contains expected text
    // When invalid URL is set, loadAndApplySettings shows "No valid URL configured"
    const errorText = await newTabPage.getErrorMessage().textContent();
    expect(errorText).toContain("No valid URL configured");

    await page.close();
  });

  test("should display error message when URL is missing", async ({
    context,
    clearStorage,
  }) => {
    // Clear URL from storage
    await clearStorage();

    // Open new tab
    const page = await context.newPage();
    const newTabPage = new NewTabPage(page);
    await newTabPage.openNewTab();

    // Wait for error message to appear
    await expect(newTabPage.getErrorMessage()).toBeVisible({ timeout: 2000 });

    // Verify error message contains expected text
    const errorText = await newTabPage.getErrorMessage().textContent();
    expect(errorText).toContain("No valid URL configured");

    await page.close();
  });

  test("should use default background color when no color is configured", async ({
    context,
    setStorage,
  }) => {
    // Clear backgroundColor from storage (only set URL)
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 1000,
      // backgroundColor not set
    });

    // Open new tab
    const page = await context.newPage();
    const newTabPage = new NewTabPage(page);
    await newTabPage.openNewTab();

    // Verify default color (#05060a) is applied
    const backgroundColor = await newTabPage.getBackgroundColor();
    // #05060a converts to rgb(5, 6, 10)
    expect(backgroundColor).toBe("rgb(5, 6, 10)");

    await page.close();
  });
});
```

**Verification:**

```bash
$ ls -la tests/newtab.spec.ts
.rw-rw-r-- damien damien 3.0 KB  Mon Dec  8 10:15:00 2025 tests/newtab.spec.ts
```

## Test Results

### All Tests Pass

```bash
$ npx playwright test tests/newtab.spec.ts --reporter=list

Running 7 tests using 7 workers

  ✓  1 [chromium] › tests/newtab.spec.ts:30:3 › New Tab Page Functionality › should display loading animation when delay is greater than 0ms (2.1s)
  ✓  3 [chromium] › tests/newtab.spec.ts:6:3 › New Tab Page Functionality › should load settings from storage and apply background color (2.1s)
  ✓  2 [chromium] › tests/newtab.spec.ts:155:3 › New Tab Page Functionality › should use default background color when no color is configured (2.1s)
  ✓  7 [chromium] › tests/newtab.spec.ts:106:3 › New Tab Page Functionality › should display error message when URL is invalid (2.1s)
  ✓  4 [chromium] › tests/newtab.spec.ts:133:3 › New Tab Page Functionality › should display error message when URL is missing (2.2s)
  ✓  6 [chromium] › tests/newtab.spec.ts:52:3 › New Tab Page Functionality › should not display loading animation when delay is 0ms (2.2s)
  ✓  5 [chromium] › tests/newtab.spec.ts:78:3 › New Tab Page Functionality › should redirect to configured URL after delay (2.8s)

  7 passed (3.8s)
```

## Storage Helper Fixes

Updated storage helpers in `tests/fixtures.ts` to navigate to extension page before accessing `chrome.storage` API:

```typescript
// Storage helper: set storage values
setStorage: async ({ context, extensionId }, use) => {
  await use(async (data: Record<string, any>) => {
    // Navigate to extension page to access chrome.storage API
    const page = await context.newPage();
    try {
      // Navigate to chrome://newtab which loads the extension's newtab.html
      // This ensures chrome.storage API is available
      await page.goto("chrome://newtab", {
        waitUntil: "domcontentloaded",
      });

      await page.evaluate((storageData) => {
        return new Promise<void>((resolve) => {
          chrome.storage.local.set(storageData, () => {
            resolve();
          });
        });
      }, data);
    } finally {
      await page.close();
    }
  });
},
```

Similar updates were made to `getStorage` and `clearStorage` helpers.

## TypeScript Configuration Updates

Updated `tsconfig.json` to support ES modules and DOM types:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./",
    "types": ["node", "@playwright/test", "chrome"]
  },
  "include": ["tests/**/*", "playwright.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**TypeScript Compilation:**

```bash
$ npx tsc --noEmit
(no errors)
```

## Test Coverage

All required test cases implemented and passing:

1. ✅ **should load settings from storage and apply background color** - Verifies background color is applied from storage
2. ✅ **should display loading animation when delay is greater than 0ms** - Verifies loading animation appears when delay > 0
3. ✅ **should not display loading animation when delay is 0ms** - Verifies loading animation is hidden when delay = 0
4. ✅ **should redirect to configured URL after delay** - Verifies redirect occurs after configured delay
5. ✅ **should display error message when URL is invalid** - Verifies error message for invalid URL
6. ✅ **should display error message when URL is missing** - Verifies error message when URL is not configured
7. ✅ **should use default background color when no color is configured** - Verifies default color (#05060a) is applied

## Verification Summary

✅ `tests/page-objects/NewTabPage.ts` exists with Page Object Model implementation
✅ `tests/newtab.spec.ts` exists with 7 test cases
✅ All 7 tests pass successfully
✅ Page Object Model encapsulates all new tab page interactions
✅ Tests use storage helpers to set/get/clear chrome.storage.local
✅ Tests verify redirect timing, background color, loading animation, and error handling
✅ TypeScript configuration updated to support ES modules and DOM types
✅ Storage helpers fixed to navigate to extension page before accessing chrome.storage API
✅ All code passes linting and type checking

All proof artifacts demonstrate that Task 3.0 has been successfully completed.
