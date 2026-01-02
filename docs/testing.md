# Testing Guide

This document provides comprehensive guidance on the test suite setup, patterns, and best practices for the Shadow Tab Chrome extension.

## Overview

The test suite uses [Playwright](https://playwright.dev/) for end-to-end testing of the Chrome extension. Tests are written in TypeScript and follow the Page Object Model (POM) pattern for maintainability and reusability. Tests use Playwright's locator API with role-based and text-based selectors (ARIA labels, text content) rather than CSS classes or IDs.

### Key Features

- **Playwright Fixtures**: Custom fixtures handle extension loading, page management, and storage operations
- **Page Object Model**: Encapsulates page interactions in reusable classes
- **Automatic Cleanup**: Fixtures handle page creation and cleanup automatically
- **Storage Helpers**: Convenient methods for setting/getting/clearing `chrome.storage.local`
- **Test Data Constants**: Centralized test URLs and data

## Setup

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Installation

1. Install project dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers and system dependencies:

   ```bash
   npx playwright install --with-deps
   ```

This command installs Chromium and all required system dependencies for running Playwright tests.

## Test Structure

```text
tests/
├── fixtures.ts              # Custom Playwright fixtures
├── test-data.ts            # Test constants (URLs, etc.)
├── installation.spec.ts    # Extension installation tests
├── newtab.spec.ts          # New tab page functionality tests
├── options.spec.ts         # Options page functionality tests
├── e2e.spec.ts             # End-to-end workflow tests
└── page-objects/
    ├── NewTabPage.ts       # Page Object for new tab page
    └── OptionsPage.ts      # Page Object for options page
```

### Test Organization

Tests are organized into the following files:

- `tests/installation.spec.ts` - Extension installation and setup verification
- `tests/newtab.spec.ts` - New tab page functionality (redirect, background color, loading animation)
- `tests/options.spec.ts` - Options page functionality (settings save/load, validation, color picker)
- `tests/e2e.spec.ts` - End-to-end user workflows

### Page Object Model Pattern

The test suite uses the Page Object Model pattern to encapsulate page interactions:

- `tests/page-objects/NewTabPage.ts` - New tab page interactions and locators
- `tests/page-objects/OptionsPage.ts` - Options page interactions and locators

Page objects provide:

- **Locators**: Encapsulate element selectors
- **Actions**: Methods for interacting with page elements
- **Assertions**: Helper methods for common verifications

### Fixtures

The `tests/fixtures.ts` file provides reusable Playwright fixtures:

- **`context`**: Browser context with Chrome extension loaded
- **`extensionId`**: Extension ID retrieved from service worker
- **`page`**: Page instance with automatic cleanup
- **`setStorage(data)`**: Helper to set `chrome.storage.local` values
- **`getStorage(keys)`**: Helper to get `chrome.storage.local` values
- **`clearStorage()`**: Helper to clear `chrome.storage.local` for test isolation
- **`newTabPage`**: NewTabPage page object instance
- **`optionsPage`**: OptionsPage page object instance

### Test Data

Test URL constants are defined in `tests/test-data.ts`:

- `TEST_URLS.EXAMPLE_COM` - IANA reserved domain (primary test URL)
- `TEST_URLS.HTTPBIN_ORG` - HTTP testing service for URL validation tests
- `TEST_URLS.GOOGLE_COM` - Real-world HTTPS URL for testing
- `TEST_URLS.HTTPSTAT_US` - HTTP status code testing service
- `TEST_URLS.CHROME_VERSION` - Chrome internal page for chrome:// scheme testing
- `TEST_URLS.JSONPLACEHOLDER` - JSON API for testing

## Playwright Fixtures

Custom fixtures are defined in `tests/fixtures.ts` and extend Playwright's base test with Chrome extension-specific functionality.

### Available Fixtures

#### `context`

Provides a `BrowserContext` with the Chrome extension loaded.

```typescript
test("example", async ({ context }) => {
  // Context is automatically created with extension loaded
  // Automatically closed after test
});
```

#### `extensionId`

Retrieves the extension ID from the loaded extension.

```typescript
test("example", async ({ extensionId }) => {
  console.log(extensionId); // e.g., "abcdefghijklmnopqrstuvwxyz123456"
});
```

#### `page`

Provides a Playwright `Page` instance with automatic cleanup.

```typescript
test("example", async ({ page }) => {
  // Page is automatically created and closed
  await page.goto("chrome://newtab");
});
```

#### `newTabPage`

Provides a `NewTabPage` Page Object instance. The page is not automatically opened - call `openNewTab()` after setting storage.

```typescript
test("example", async ({ newTabPage, setStorage }) => {
  await setStorage({ url: "https://example.com" });
  await newTabPage.openNewTab(); // Open after storage is set
  await expect(newTabPage.getLoadingAnimation()).toBeVisible();
});
```

### Storage Helpers

#### `setStorage(data)`

Sets values in `chrome.storage.local`. Must be called before opening pages that read from storage.

```typescript
test("example", async ({ setStorage }) => {
  await setStorage({
    url: "https://example.com",
    redirectDelay: 1000,
    backgroundColor: "#ff0000",
  });
});
```

#### `getStorage(keys?)`

Retrieves values from `chrome.storage.local`.

```typescript
test("example", async ({ getStorage }) => {
  const storage = await getStorage(["url", "redirectDelay"]);
  console.log(storage.url);
});
```

#### `clearStorage()`

Clears all values from `chrome.storage.local`.

```typescript
test("example", async ({ clearStorage }) => {
  await clearStorage();
  // Storage is now empty
});
```

## Page Object Model

Page Objects encapsulate page interactions and locators, making tests more maintainable and readable.

### Example: NewTabPage

```typescript
import { NewTabPage } from "./page-objects/NewTabPage";

test("example", async ({ newTabPage, setStorage }) => {
  await setStorage({ url: "https://example.com" });
  await newTabPage.openNewTab();

  // Use Page Object methods instead of direct locators
  await expect(newTabPage.getLoadingAnimation()).toBeVisible();
  const bgColor = await newTabPage.getBackgroundColor();
});
```

### Creating New Page Objects

1. Create a class in `tests/page-objects/`
2. Accept `Page` in constructor
3. Encapsulate locators and actions as methods
4. Return `Locator` instances for assertions

Example:

```typescript
import { Page, Locator } from "@playwright/test";

export class MyPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getMyElement(): Locator {
    return this.page.locator("#my-element");
  }

  async doSomething(): Promise<void> {
    await this.page.click("#button");
  }
}
```

Then add a fixture in `tests/fixtures.ts`:

```typescript
import { MyPage } from "./page-objects/MyPage";

// In ExtensionFixtures type:
myPage: MyPage;

// In test.extend:
myPage: async ({ page }, use) => {
  const myPage = new MyPage(page);
  await use(myPage);
},
```

## Test Data Constants

Use constants from `tests/test-data.ts` for consistent test URLs:

```typescript
import { TEST_URLS } from "./test-data";

test("example", async ({ setStorage }) => {
  await setStorage({
    url: TEST_URLS.EXAMPLE_COM, // Instead of hardcoding URLs
  });
});
```

Available constants:

- `TEST_URLS.EXAMPLE_COM` - IANA reserved domain (primary test URL)
- `TEST_URLS.HTTPBIN_ORG` - HTTP testing service
- `TEST_URLS.GOOGLE_COM` - Real-world HTTPS URL
- `TEST_URLS.HTTPSTAT_US` - HTTP status code testing service
- `TEST_URLS.CHROME_VERSION` - Chrome internal page
- `TEST_URLS.JSONPLACEHOLDER` - JSON API for testing

## Running Tests

### Run All Tests

Run the complete test suite:

```bash
npx playwright test
```

Or using npm script:

```bash
npm test
```

### Run Specific Test Files

Run tests from a specific file:

```bash
npx playwright test tests/installation.spec.ts
npx playwright test tests/newtab.spec.ts
npx playwright test tests/options.spec.ts
npx playwright test tests/e2e.spec.ts
```

### Run Tests in UI Mode

Open Playwright's interactive UI mode for debugging and test development:

```bash
npx playwright test --ui
```

Or using npm script:

```bash
npm run test:ui
```

### Run Tests in Headed Mode

Run tests with visible browser windows:

```bash
npx playwright test --headed
```

### Run Tests with Debug Mode

Run tests with Playwright Inspector for step-by-step debugging:

```bash
npx playwright test --debug
```

### List Available Tests

List all available tests without running them:

```bash
npx playwright test --list
```

Or using npm script:

```bash
npm run test:list
```

### Run Tests with Specific Reporter

```bash
npx playwright test --reporter=list
npx playwright test --reporter=html
```

## Writing New Tests

### Using Fixtures

Import `test` and `expect` from fixtures instead of `@playwright/test`:

```typescript
import { test, expect } from "../fixtures";
```

This provides access to all extension-specific fixtures.

### Using Page Objects

Use page objects for page interactions:

```typescript
import { NewTabPage } from "./page-objects/NewTabPage";
import { OptionsPage } from "./page-objects/OptionsPage";

test("example test", async ({ newTabPage, optionsPage, extensionId }) => {
  await newTabPage.openNewTab();
  await optionsPage.goto(extensionId);
});
```

### Storage Helpers

Use storage helpers to manipulate `chrome.storage.local`:

```typescript
test("example test", async ({ setStorage, getStorage, clearStorage }) => {
  // Set storage values
  await setStorage({
    url: "https://example.com",
    redirectDelay: 1000,
    backgroundColor: "#ff0000",
  });

  // Get storage values
  const storage = await getStorage(["url", "redirectDelay"]);

  // Clear storage for test isolation
  await clearStorage();
});
```

### Locator Patterns

Use role-based and text-based selectors:

```typescript
// Good: Role-based selector
const button = page.getByRole("button", { name: "Save" });

// Good: Text-based selector
const errorMessage = page.getByText("Invalid URL");

// Avoid: CSS class or ID selectors (unless necessary)
const element = page.locator("#some-id"); // Only if no better option
```

### New Tab Testing

Use `chrome://newtab` to simulate real user behavior:

```typescript
await page.goto("chrome://newtab");
```

Chrome automatically loads the extension's `newtab.html` when this URL is accessed.

### Extension ID Usage

Access extension pages using the `extensionId` fixture:

```typescript
test("example test", async ({ extensionId, page }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);
});
```

### Basic Test Structure

```typescript
import { test, expect } from "./fixtures";
import { TEST_URLS } from "./test-data";

test.describe("Feature Name", () => {
  test("should do something", async ({ setStorage, newTabPage }) => {
    // 1. Set up test data (storage, etc.)
    await setStorage({
      url: TEST_URLS.EXAMPLE_COM,
      redirectDelay: 1000,
    });

    // 2. Perform actions
    await newTabPage.openNewTab();

    // 3. Assert results
    await expect(newTabPage.getLoadingAnimation()).toBeVisible();
  });
});
```

### Test Flow Pattern

1. **Set Storage First**: Always set storage before opening pages that read from it
2. **Open Page**: Call `openNewTab()` or navigate to the page
3. **Wait for State**: Use Playwright's waiting mechanisms (`waitForURL`, `toBeVisible`, etc.)
4. **Assert**: Verify expected behavior

```typescript
test("example", async ({ setStorage, newTabPage, page }) => {
  // Step 1: Set storage
  await setStorage({
    url: TEST_URLS.EXAMPLE_COM,
    redirectDelay: 500,
  });

  // Step 2: Open page
  await newTabPage.openNewTab();

  // Step 3: Wait for redirect
  await page.waitForURL(TEST_URLS.EXAMPLE_COM, { timeout: 2000 });

  // Step 4: Assert
  expect(page.url()).toContain("example.com");
});
```

## Best Practices

### 1. Use Fixtures Instead of Manual Setup

✅ **Good**: Use fixtures for automatic cleanup

```typescript
test("example", async ({ newTabPage, setStorage }) => {
  await setStorage({ url: "https://example.com" });
  await newTabPage.openNewTab();
  // Page automatically cleaned up
});
```

❌ **Bad**: Manual page management

```typescript
test("example", async ({ context }) => {
  const page = await context.newPage();
  // ... test code ...
  await page.close(); // Easy to forget!
});
```

### 2. Set Storage Before Opening Pages

✅ **Good**: Set storage first

```typescript
test("example", async ({ setStorage, newTabPage }) => {
  await setStorage({ url: "https://example.com" });
  await newTabPage.openNewTab(); // Page reads from storage
});
```

❌ **Bad**: Open page before setting storage

```typescript
test("example", async ({ newTabPage, setStorage }) => {
  await newTabPage.openNewTab(); // Too early!
  await setStorage({ url: "https://example.com" });
});
```

### 3. Use Page Objects for Interactions

✅ **Good**: Use Page Object methods

```typescript
const bgColor = await newTabPage.getBackgroundColor();
await expect(newTabPage.getLoadingAnimation()).toBeVisible();
```

❌ **Bad**: Direct locator access

```typescript
const bgColor = await page.evaluate(() => {
  return window.getComputedStyle(document.body).backgroundColor;
});
await expect(page.locator("#loading")).toBeVisible();
```

### 4. Use Test Data Constants

✅ **Good**: Use constants

```typescript
await setStorage({ url: TEST_URLS.EXAMPLE_COM });
```

❌ **Bad**: Hardcoded URLs

```typescript
await setStorage({ url: "https://example.com" });
```

### 5. Use Descriptive Test Names

✅ **Good**: Clear, descriptive names

```typescript
test("should display error message when URL is invalid", async ({ ... }) => {
```

❌ **Bad**: Vague names

```typescript
test("test error", async ({ ... }) => {
```

### 6. Wait for Async Operations

✅ **Good**: Wait for state changes

```typescript
await page.waitForURL(testUrl, { timeout: 2000 });
await expect(newTabPage.getErrorMessage()).toBeVisible({ timeout: 2000 });
```

❌ **Bad**: Fixed timeouts (when possible)

```typescript
await page.waitForTimeout(2000); // Use only when necessary
```

## Common Patterns

### Testing Storage Persistence

```typescript
test("should persist settings", async ({ setStorage, getStorage }) => {
  await setStorage({ url: TEST_URLS.EXAMPLE_COM });
  const storage = await getStorage(["url"]);
  expect(storage.url).toBe(TEST_URLS.EXAMPLE_COM);
});
```

### Testing Error States

```typescript
test("should show error for invalid URL", async ({
  setStorage,
  newTabPage,
}) => {
  await setStorage({ url: "not-a-valid-url" });
  await newTabPage.openNewTab();
  await expect(newTabPage.getErrorMessage()).toBeVisible();
});
```

### Testing Default Values

```typescript
test("should use default color", async ({ setStorage, newTabPage }) => {
  await setStorage({
    url: TEST_URLS.EXAMPLE_COM,
    // backgroundColor not set - should use default
  });
  await newTabPage.openNewTab();
  const bgColor = await newTabPage.getBackgroundColor();
  expect(bgColor).toBe("rgb(5, 6, 10)"); // Default #05060a
});
```

## CI Integration

Tests run automatically in GitHub Actions on every push and pull request. The CI workflow:

1. Sets up Node.js 20
2. Checks out code
3. Installs Playwright browsers and dependencies
4. Runs Playwright tests in headless mode
5. Uploads test reports as artifacts (always, 30-day retention)
6. Uploads test artifacts (screenshots, videos, traces) on failure (7-day retention)

### Viewing CI Test Results

1. Navigate to the Actions tab in GitHub
2. Select the workflow run
3. Click on the "Run Playwright Tests" job
4. Download the `playwright-report` artifact to view HTML test reports
5. Download the `test-results` artifact (on failure) to view screenshots, videos, and traces

## Troubleshooting

### Tests Fail to Find Extension

**Problem**: Tests fail with "Extension manifest.json not found" error.

**Solution**: Ensure you're running tests from the project root directory. The fixtures resolve the extension path relative to the `tests/` directory.

### Extension Not Loading

If tests fail with "Extension not loaded" errors:

1. Verify `manifest.json` exists at project root
2. Check that extension path is resolved correctly in `fixtures.ts`
3. Ensure Chrome/Chromium is installed

### Extension ID Not Retrieved

**Problem**: Tests fail with "Could not extract extension ID" error.

**Solution**: Ensure the extension loads correctly. Check that `manifest.json` is valid and all required files are present.

### Storage API Not Available

**Problem**: Storage helper methods fail with "chrome.storage is not defined" error.

**Solution**: Ensure you navigate to an extension page (e.g., `chrome://newtab` or `chrome-extension://${extensionId}/options.html`) before accessing `chrome.storage` API.

### Storage Not Persisting

If storage operations fail:

1. Ensure `setStorage()` is called before opening pages
2. Storage helpers navigate to `chrome://newtab` to access `chrome.storage` API
3. Check that storage keys match what the extension expects

### Page Not Found Errors

If pages can't be found:

1. Verify extension ID is retrieved correctly
2. Check that extension files are accessible
3. Ensure `chrome://newtab` loads the extension's `newtab.html`

### Tests Timeout

**Problem**: Tests timeout waiting for redirects or page loads.

**Solution**: Increase timeout in test or check that the configured URL is accessible. Use `test.setTimeout()` to increase timeout for specific tests.

### Flaky Tests

If tests are flaky:

1. Increase timeouts for slow operations
2. Use Playwright's waiting mechanisms (`waitForURL`, `toBeVisible`, etc.)
3. Avoid fixed `waitForTimeout()` calls when possible
4. Check for race conditions in test setup

### Playwright Browsers Not Installed

**Problem**: Tests fail with "Executable doesn't exist" error.

**Solution**: Run `npx playwright install --with-deps` to install Playwright browsers and system dependencies.

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Chrome Extension Testing Guide](https://playwright.dev/docs/chrome-extensions)
