# 04-tasks-playwright-test-suite.md

## Relevant Files

- `package.json` - Node.js package configuration file (new file, contains Playwright and TypeScript dependencies)
- `tsconfig.json` - TypeScript configuration file (new file, configures TypeScript compiler for Playwright tests)
- `playwright.config.ts` - Playwright test configuration file (new file, configures test execution, timeouts, and browser settings)
- `tests/fixtures.ts` - Playwright fixtures for Chrome extension setup (new file, provides reusable extension context, extension ID, and storage helper fixtures)
- `tests/test-data.ts` - Test data constants file (new file, contains test URL constants and test data)
- `tests/installation.spec.ts` - Extension installation and setup tests (new file, verifies extension loads correctly)
- `tests/page-objects/NewTabPage.ts` - Page Object Model class for new tab page interactions (new file, encapsulates new tab page locators and actions)
- `tests/newtab.spec.ts` - New tab page functionality tests (new file, tests redirect, background color, loading animation)
- `tests/page-objects/OptionsPage.ts` - Page Object Model class for options page interactions (new file, encapsulates options page locators and actions)
- `tests/options.spec.ts` - Options page functionality tests (new file, tests settings save/load, validation, color picker)
- `tests/e2e.spec.ts` - End-to-end user flow tests (new file, tests complete workflows from configuration to redirect)
- `tests/README.md` - Test suite documentation (new file, explains test structure, running tests, and contributing)
- `.github/workflows/ci.yml` - CI workflow configuration (modify existing file, add Playwright test step)
- `.gitignore` - Git ignore patterns (modify existing file, add test artifacts and Playwright output directories)

### Notes

- All test files use TypeScript with modern ES6+ syntax and async/await patterns
- Page Object Model pattern is used to encapsulate page interactions and improve maintainability
- Tests use Playwright's locator API with role-based and text-based selectors (ARIA labels, text content) rather than CSS classes or IDs
- Test URLs are defined in `tests/test-data.ts` constants file for consistency
- Access chrome.storage.local API directly using `page.evaluate()` - no mocking required
- Test with real URLs and verify UI behavior - no network mocking required
- Playwright fixtures provide reusable setup for extension context, extension ID, and storage helpers across all tests
- Extension path resolved using `path.join(__dirname, '..')` in fixtures
- Clear storage selectively - only for tests that need isolation, not for persistence tests
- New tab testing uses `chrome://newtab` to simulate real user behavior (Chrome automatically loads extension's newtab.html)
- All markdown documentation files must pass markdownlint validation
- Follow Conventional Commits format for all commits (e.g., `test: add new tab page tests`)

## Tasks

### [x] 1.0 Setup Playwright Infrastructure and Extension Fixtures

#### 1.0 Proof Artifact(s)

- File: `playwright.config.ts` exists at project root demonstrates Playwright configuration is set up
- File: `tests/fixtures.ts` exists demonstrates extension fixtures are created
- CLI: `npx playwright test --list` shows available tests demonstrates Playwright is properly configured
- Package: `package.json` includes `@playwright/test` dependency demonstrates dependencies are installed
- Test: Extension context fixture loads extension successfully demonstrates extension can be loaded in Playwright

#### 1.0 Tasks

- [x] 1.1 Create `package.json` file with Node.js project configuration (name, version, description)
- [x] 1.2 Install `@playwright/test`, `typescript`, and `@types/node` as dev dependencies using `npm install --save-dev @playwright/test typescript @types/node`
- [x] 1.3 Create `tsconfig.json` at project root with Playwright-compatible TypeScript configuration (ES2020 target, CommonJS modules, strict mode)
- [x] 1.4 Create `playwright.config.ts` at project root with basic configuration (test directory, timeout settings, headless mode, HTML reporter)
- [x] 1.5 Configure Playwright to use Chromium browser with extension loading support
- [x] 1.6 Create `tests/` directory structure
- [x] 1.7 Create `tests/fixtures.ts` with base test fixture that extends Playwright's test
- [x] 1.8 Implement `context` fixture in `tests/fixtures.ts` that resolves extension path using `path.join(__dirname, '..')` and loads Chrome extension using `chromium.launchPersistentContext()` with `--load-extension` and `--disable-extensions-except` arguments
- [x] 1.9 Implement `extensionId` fixture in `tests/fixtures.ts` that retrieves extension ID from service worker (Manifest V3) using `context.serviceWorkers()` and `waitForEvent('serviceworker')`
- [x] 1.10 Add storage helper methods to fixtures: `setStorage(data)` that uses `page.evaluate()` to call `chrome.storage.local.set()`, `getStorage(keys)` that uses `page.evaluate()` to call `chrome.storage.local.get()`, and `clearStorage()` that clears storage for test isolation
- [x] 1.11 Export extended test and expect from `tests/fixtures.ts` for use in test files
- [x] 1.12 Create `tests/test-data.ts` file with test URL constants (example.com, httpbin.org, google.com, httpstat.us, chrome://version, jsonplaceholder.typicode.com)
- [x] 1.13 Update `.gitignore` to exclude Playwright test artifacts (`test-results/`, `playwright-report/`, `playwright/.cache/`)
- [x] 1.14 Verify fixtures work by running `npx playwright test --list` (should show no tests yet, but no errors)

### [x] 2.0 Extension Installation and Setup Testing

#### 2.0 Proof Artifact(s)

- Test: `tests/installation.spec.ts` passes demonstrates extension loads correctly
- Test: Extension ID fixture retrieves valid ID demonstrates service worker initialization works
- Test: All required extension files are accessible demonstrates extension packaging is valid
- Screenshot: Extension loaded in Playwright browser demonstrates visual confirmation
- CI: Tests run successfully in GitHub Actions demonstrates CI integration works

#### 2.0 Tasks

- [x] 2.1 Create `tests/installation.spec.ts` test file
- [x] 2.2 Import test and expect from `tests/fixtures.ts` in installation test file
- [x] 2.3 Write test case "should load extension successfully" that verifies extension context is created
- [x] 2.4 Write test case "should retrieve valid extension ID" that verifies extensionId fixture returns a non-empty string
- [x] 2.5 Write test case "should initialize service worker" that verifies service worker is available in context
- [x] 2.6 Write test case "should have all required extension files accessible" that navigates to `chrome-extension://${extensionId}/manifest.json` and verifies it loads
- [x] 2.7 Write test case "should load newtab.html" that navigates to `chrome-extension://${extensionId}/newtab.html` and verifies page loads
- [x] 2.8 Write test case "should load options.html" that navigates to `chrome-extension://${extensionId}/options.html` and verifies page loads
- [x] 2.9 Add screenshot capture in at least one test to demonstrate visual confirmation
- [x] 2.10 Run `npx playwright test tests/installation.spec.ts` and verify all tests pass

### [x] 3.0 New Tab Page Functionality Testing

#### 3.0 Proof Artifact(s)

- File: `tests/page-objects/NewTabPage.ts` exists demonstrates Page Object Model pattern implementation
- Test: `tests/newtab.spec.ts` passes demonstrates new tab functionality works correctly
- Test: Redirect occurs after configured delay demonstrates timing functionality
- Test: Background color applied correctly demonstrates visual customization
- Test: Error message displayed for invalid URL demonstrates error handling
- Test: Loading animation displays when delay > 0ms demonstrates UI feedback

#### 3.0 Tasks

- [x] 3.1 Create `tests/page-objects/` directory
- [x] 3.2 Create `tests/page-objects/NewTabPage.ts` page object class
- [x] 3.3 Implement constructor in NewTabPage that accepts Playwright Page object
- [x] 3.4 Add method `openNewTab()` in NewTabPage that opens new tab normally using `chrome://newtab` (simulates user pressing Ctrl+T, Chrome automatically loads extension's newtab.html)
- [x] 3.5 Add method `getLoadingAnimation()` that returns locator for loading animation container (`#loading`)
- [x] 3.6 Add method `getErrorMessage()` that returns locator for error message (`#error-message`)
- [x] 3.7 Add method `getBody()` that returns locator for body element
- [x] 3.8 Add method `waitForRedirect(delay)` that waits for redirect to occur after specified delay
- [x] 3.9 Add method `getBackgroundColor()` that retrieves computed background color of body element
- [x] 3.10 Create `tests/newtab.spec.ts` test file
- [x] 3.11 Import test, expect from fixtures and NewTabPage from page objects
- [x] 3.12 Write test case "should load settings from storage and apply background color" that sets chrome.storage.local using storage helper, opens new tab with `chrome://newtab`, and verifies background color is applied
- [x] 3.13 Write test case "should display loading animation when delay is greater than 0ms" that sets delay > 0 and verifies loading animation is visible
- [x] 3.14 Write test case "should not display loading animation when delay is 0ms" that sets delay to 0 and verifies loading animation is hidden
- [x] 3.15 Write test case "should redirect to configured URL after delay" that sets URL and delay in storage using storage helper, opens new tab with `chrome://newtab`, waits for redirect using `page.waitForURL()`, and verifies final URL matches configured URL
- [x] 3.16 Write test case "should display error message when URL is invalid" that sets invalid URL in storage and verifies error message is displayed
- [x] 3.17 Write test case "should display error message when URL is missing" that clears URL from storage and verifies error message is displayed
- [x] 3.18 Write test case "should use default background color when no color is configured" that clears backgroundColor from storage and verifies default color (#05060a) is applied
- [x] 3.19 Run `npx playwright test tests/newtab.spec.ts` and verify all tests pass

### [x] 4.0 Options Page Functionality Testing

#### 4.0 Proof Artifact(s)

- File: `tests/page-objects/OptionsPage.ts` exists demonstrates Page Object Model pattern implementation
- Test: `tests/options.spec.ts` passes demonstrates options page functionality
- Test: Settings save and load correctly demonstrates persistence
- Test: URL validation works for various formats demonstrates validation logic
- Test: Color picker and presets update background demonstrates live preview
- Test: Success message displayed after save demonstrates user feedback
- Test: Error messages displayed for invalid inputs demonstrates validation

#### 4.0 Tasks

- [x] 4.1 Create `tests/page-objects/OptionsPage.ts` page object class
- [x] 4.2 Implement constructor in OptionsPage that accepts Playwright Page object
- [x] 4.3 Add method `goto()` that navigates to options page using extension ID
- [x] 4.4 Add method `getUrlInput()` that returns locator for URL input field (`#url-input`)
- [x] 4.5 Add method `getRedirectDelayInput()` that returns locator for redirect delay input (`#redirect-delay-input`)
- [x] 4.6 Add method `getBackgroundColorInput()` that returns locator for background color input (`#background-color-input`)
- [x] 4.7 Add method `getColorPicker()` that returns locator for color picker (`#color-picker`)
- [x] 4.8 Add method `getSaveButton()` that returns locator for save button (`#save-button`)
- [x] 4.9 Add method `getUrlError()` that returns locator for URL error message (`#url-error`)
- [x] 4.10 Add method `getRedirectDelayError()` that returns locator for redirect delay error (`#redirect-delay-error`)
- [x] 4.11 Add method `getBackgroundColorError()` that returns locator for background color error (`#background-color-error`)
- [x] 4.12 Add method `getSuccessMessage()` that returns locator for success message (`#save-success`)
- [x] 4.13 Add method `getUrlValidationMessage()` that returns locator for URL validation message (`#url-validation-message`)
- [x] 4.14 Add method `getPresetColorButton(color)` that returns locator for preset color button with specified data-color attribute
- [x] 4.15 Add method `getVersionFooter()` that returns locator for version footer (`#version-footer`)
- [x] 4.16 Add method `fillUrl(url)` that fills URL input field
- [x] 4.17 Add method `fillRedirectDelay(delay)` that fills redirect delay input
- [x] 4.18 Add method `fillBackgroundColor(color)` that fills background color input
- [x] 4.19 Add method `clickSave()` that clicks save button
- [x] 4.20 Add method `getBackgroundColor()` that retrieves computed background color of body element
- [x] 4.21 Create `tests/options.spec.ts` test file
- [x] 4.22 Import test, expect from fixtures and OptionsPage from page objects
- [x] 4.23 Write test case "should load and display current settings from storage" that sets chrome.storage.local using storage helper, navigates to options page, and verifies form fields are populated
- [x] 4.24 Write test case "should validate URL format in real-time" that types invalid URL and verifies error message appears
- [x] 4.25 Write test case "should validate redirect delay range" that tests values outside 0-60000ms range and verifies error messages
- [x] 4.26 Write test case "should validate background color format" that tests invalid color values and verifies error messages
- [x] 4.27 Write test case "should save settings to storage when Save button is clicked" that fills form, clicks save, uses storage helper to read chrome.storage.local, and verifies settings are saved correctly
- [x] 4.28 Write test case "should display success message after successful save" that saves settings and verifies success message appears
- [x] 4.29 Write test case "should update page background color when color picker changes" that changes color picker and verifies body background color updates
- [x] 4.30 Write test case "should update page background color when preset color button is clicked" that clicks preset button and verifies body background color updates
- [x] 4.31 Write test case "should display version information in footer" that verifies version footer contains version text
- [x] 4.32 Write test case "should handle URL validation with real URLs" that types various URL formats (valid and invalid) and verifies UI validation feedback appears correctly (no network mocking needed)
- [x] 4.33 Run `npx playwright test tests/options.spec.ts` and verify all tests pass

### [x] 5.0 End-to-End User Flow Testing

#### 5.0 Proof Artifact(s)

- Test: `tests/e2e.spec.ts` passes demonstrates complete user workflows
- Test: Settings persist across new tab opens demonstrates storage persistence
- Test: Multiple configuration changes work correctly demonstrates state management
- Test: Edge cases handled gracefully demonstrates robust error handling
- Test: Complete flow from options configuration to new tab redirect works demonstrates end-to-end functionality

#### 5.0 Tasks

- [x] 5.1 Create `tests/e2e.spec.ts` test file
- [x] 5.2 Import test, expect from fixtures, NewTabPage and OptionsPage from page objects
- [x] 5.3 Write test case "should complete workflow from options configuration to new tab redirect" that configures settings in options page, opens new tab normally with `chrome://newtab`, waits for redirect using `page.waitForURL()`, and verifies redirect occurs to configured URL
- [x] 5.4 Write test case "should persist settings across new tab opens" that saves settings, opens multiple new tabs, and verifies settings persist
- [x] 5.5 Write test case "should handle multiple configuration changes correctly" that changes settings multiple times and verifies each change is saved and applied
- [x] 5.6 Write test case "should handle empty settings gracefully" that clears all settings and verifies default behavior (error message for missing URL)
- [x] 5.7 Write test case "should handle invalid URLs gracefully" that sets invalid URL and verifies error handling in new tab page
- [x] 5.8 Write test case "should handle extreme delay values" that sets delay to maximum (60000ms) and verifies redirect still occurs
- [x] 5.9 Write test case "should handle immediate redirect (0ms delay)" that sets delay to 0 and verifies immediate redirect without loading animation
- [x] 5.10 Write test case "should apply background color changes immediately" that changes color in options and verifies it applies to new tab page
- [x] 5.11 Run `npx playwright test tests/e2e.spec.ts` and verify all tests pass

### [x] 6.0 CI/CD Integration and Documentation

#### 6.0 Proof Artifact(s)

- File: `.github/workflows/ci.yml` includes Playwright test step demonstrates CI integration
- CI: GitHub Actions workflow runs Playwright tests successfully demonstrates automated testing in CI
- Artifact: Test reports published as GitHub Actions artifacts demonstrates test reporting
- File: `tests/README.md` exists demonstrates test suite documentation
- File: Test structure and contributing guides exist demonstrates comprehensive documentation

#### 6.0 Tasks

- [x] 6.1 Read existing `.github/workflows/ci.yml` to understand current workflow structure
- [x] 6.2 Add new job `run-playwright-tests` to CI workflow (runs in parallel with existing jobs)
- [x] 6.3 Add step "Set up Node.js 20" to Playwright test job (use `actions/setup-node@v6.1.0`)
- [x] 6.4 Add step "Checkout code" to Playwright test job (use `actions/checkout@v6.0.1`)
- [x] 6.5 Add step "Install Playwright browsers" that runs `npx playwright install --with-deps`
- [x] 6.6 Add step "Install dependencies" that runs `npm install` (or `npm ci` for CI)
- [x] 6.7 Add step "Run Playwright tests" that runs `npx playwright test` in headless mode
- [x] 6.8 Configure Playwright config to generate HTML report and test results JSON for CI runs
- [x] 6.9 Add step "Upload test report" that uploads `playwright-report/` as GitHub Actions artifact (always, retention 30 days)
- [x] 6.10 Add step "Upload test artifacts on failure" that uploads `test-results/` (screenshots, videos, traces) as GitHub Actions artifact only on test failure (retention 7 days)
- [x] 6.11 Test CI workflow by pushing changes and verifying tests run in GitHub Actions
- [x] 6.12 Create `tests/README.md` documentation file
- [x] 6.13 Add "Overview" section to README explaining test suite purpose and structure
- [x] 6.14 Add "Setup" section to README with installation instructions (`npm install`, `npx playwright install --with-deps`)
- [x] 6.15 Add "Running Tests" section to README with commands for running all tests, specific test files, and in UI mode
- [x] 6.16 Add "Test Structure" section to README explaining Page Object Model pattern and test organization
- [x] 6.17 Add "Writing Tests" section to README with guidelines for adding new tests (using fixtures, page objects, locator patterns, storage helpers)
- [x] 6.18 Add "Test Data" section to README documenting test URL constants and their use cases
- [x] 6.19 Add "CI Integration" section to README explaining how tests run in GitHub Actions and artifact uploads
- [x] 6.20 Add "Troubleshooting" section to README with common issues and solutions
- [x] 6.21 Run `markdownlint --fix tests/README.md` to ensure documentation passes linting
- [x] 6.22 Verify all documentation follows markdownlint rules and is properly formatted
