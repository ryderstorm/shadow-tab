# Playwright Test Suite

## Overview

This directory contains the end-to-end test suite for the Dark New Tab Homepage Chrome extension. The tests use Playwright with TypeScript to verify extension functionality, including installation, new tab page behavior, options page configuration, and complete user workflows.

The test suite follows the Page Object Model (POM) pattern to improve maintainability and reusability. Tests use Playwright's locator API with role-based and text-based selectors (ARIA labels, text content) rather than CSS classes or IDs.

## Setup

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Installation

1. Install project dependencies:

```bash
npm install
```

1. Install Playwright browsers and system dependencies:

```bash
npx playwright install --with-deps
```

This command installs Chromium and all required system dependencies for running Playwright tests.

## Running Tests

### Run All Tests

Run the complete test suite:

```bash
npx playwright test
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

## Test Structure

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

## Writing Tests

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

test("example test", async ({ newTabPage, optionsPage }) => {
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

### Extension ID Not Retrieved

**Problem**: Tests fail with "Could not extract extension ID" error.

**Solution**: Ensure the extension loads correctly. Check that `manifest.json` is valid and all required files are present.

### Storage API Not Available

**Problem**: Storage helper methods fail with "chrome.storage is not defined" error.

**Solution**: Ensure you navigate to an extension page (e.g., `chrome://newtab` or `chrome-extension://${extensionId}/options.html`) before accessing `chrome.storage` API.

### Tests Timeout

**Problem**: Tests timeout waiting for redirects or page loads.

**Solution**: Increase timeout in test or check that the configured URL is accessible. Use `test.setTimeout()` to increase timeout for specific tests.

### Playwright Browsers Not Installed

**Problem**: Tests fail with "Executable doesn't exist" error.

**Solution**: Run `npx playwright install --with-deps` to install Playwright browsers and system dependencies.
