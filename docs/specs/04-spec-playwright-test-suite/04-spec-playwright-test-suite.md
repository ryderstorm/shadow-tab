# 04-spec-playwright-test-suite.md

## Introduction/Overview

This specification defines the implementation of a comprehensive Playwright automated test suite for the Dark New Tab Homepage Chrome extension. The test suite will ensure the extension's functionality, installation, and prevent regressions as the application evolves. The implementation follows a progressive coverage approach, starting with critical paths and expanding incrementally, using modern Playwright best practices and the Page Object Model pattern for maintainability.

## Goals

- Establish automated testing infrastructure using Playwright for Chrome extension testing
- Provide comprehensive test coverage for critical user flows (installation, redirect functionality, settings management)
- Integrate tests into CI/CD pipeline to run in parallel with existing validation steps
- Create maintainable test code using Page Object Model pattern
- Enable regression testing to prevent breaking changes
- Document test suite structure and patterns for future contributors

## User Stories

**As a developer**, I want automated tests for the Chrome extension so that I can verify functionality works correctly without manual testing.

**As a developer**, I want tests to run automatically in CI/CD so that regressions are caught before merging code.

**As a developer**, I want tests organized using Page Object Model so that test code is maintainable and reusable.

**As a contributor**, I want clear documentation on how to add new tests so that I can contribute test coverage effectively.

**As a user**, I want the extension to work reliably so that my new tab redirects function correctly every time.

## Demoable Units of Work

### [Unit 1]: Extension Installation and Setup Testing

**Purpose:** Verify that the Chrome extension can be loaded correctly in Playwright, that all required files are present, and that the extension ID can be retrieved for testing extension pages.

**Functional Requirements:**

- The test suite shall load the Chrome extension using Playwright's persistent context with proper Chrome arguments
- The test suite shall verify the extension ID is retrievable from the service worker (Manifest V3)
- The test suite shall verify the service worker initializes correctly
- The test suite shall verify all required extension files (manifest.json, newtab.html, options.html, etc.) are present and loadable
- The test suite shall provide reusable fixtures for extension context and extension ID across all tests

**Proof Artifacts:**

- Test: `tests/installation.spec.ts` passes demonstrates extension loads correctly
- Test: Extension ID fixture retrieves valid ID demonstrates service worker initialization
- CI: Tests run successfully in GitHub Actions demonstrates CI integration works
- Screenshot: Extension loaded in Playwright browser demonstrates visual confirmation

### [Unit 2]: New Tab Page Functionality Testing

**Purpose:** Verify that the new tab page correctly loads settings, applies background color, displays loading animation, and redirects to the configured URL after the specified delay.

**Functional Requirements:**

- The system shall load settings from chrome.storage.local when new tab opens
- The system shall apply the configured background color to the new tab page
- The system shall display loading animation when redirect delay is greater than 0ms
- The system shall redirect to the configured URL after the specified delay (tested by opening new tab normally with `chrome://newtab`)
- The system shall handle immediate redirect (0ms delay) without showing loading animation
- The system shall display error message when URL is invalid or missing
- The system shall use default background color when no color is configured

**Proof Artifacts:**

- Test: `tests/newtab.spec.ts` passes demonstrates new tab functionality works correctly
- Test: Redirect occurs after configured delay demonstrates timing functionality
- Test: Background color applied correctly demonstrates visual customization
- Test: Error message displayed for invalid URL demonstrates error handling
- Page Object: `tests/page-objects/NewTabPage.ts` exists demonstrates POM pattern implementation

### [Unit 3]: Options Page Functionality Testing

**Purpose:** Verify that the options page correctly loads saved settings, validates user input, saves new settings, and provides real-time feedback for URL validation.

**Functional Requirements:**

- The system shall load and display current settings from chrome.storage.local when options page opens
- The system shall validate URL format in real-time as user types
- The system shall validate redirect delay is within acceptable range (0-60000ms)
- The system shall validate background color is a valid CSS color value
- The system shall save settings to chrome.storage.local when Save button is clicked
- The system shall display success message after successful save
- The system shall display error messages for invalid input fields
- The system shall update page background color in real-time when color picker or preset buttons are used
- The system shall display version information in footer

**Proof Artifacts:**

- Test: `tests/options.spec.ts` passes demonstrates options page functionality
- Test: Settings save and load correctly demonstrates persistence
- Test: URL validation works for various formats demonstrates validation logic
- Test: Color picker and presets update background demonstrates live preview
- Page Object: `tests/page-objects/OptionsPage.ts` exists demonstrates POM pattern implementation

### [Unit 4]: End-to-End User Flow Testing

**Purpose:** Verify complete user workflows from configuring settings to opening new tabs, ensuring settings persist and redirects work as expected.

**Functional Requirements:**

- The system shall allow user to configure URL, delay, and color in options page
- The system shall persist settings across new tab opens (within same browser session)
- The system shall apply saved settings when new tab is opened
- The system shall redirect to configured URL after specified delay
- The system shall handle edge cases (empty settings, invalid URLs, extreme delay values)

**Proof Artifacts:**

- Test: `tests/e2e.spec.ts` passes demonstrates complete user workflows
- Test: Settings persist across new tab opens demonstrates storage persistence
- Test: Multiple configuration changes work correctly demonstrates state management
- Test: Edge cases handled gracefully demonstrates robust error handling

## Non-Goals (Out of Scope)

1. **Visual Regression Testing**: Screenshot comparison and visual testing will be deferred to a later phase. This spec focuses on functional testing only.

2. **Performance Benchmarking**: While tests should run efficiently, detailed performance metrics and benchmarking are out of scope for this initial implementation.

3. **Cross-Browser Testing**: Tests will run only on Chromium (required for Chrome extension testing). Firefox and WebKit testing are not applicable for Chrome extensions.

4. **Accessibility Testing**: While the extension includes accessibility features, automated accessibility testing (WCAG compliance, screen reader testing) is out of scope for this phase.

5. **Chrome Web Store Integration Testing**: Testing the extension packaging and Chrome Web Store submission process is out of scope.

6. **Third-Party Service Integration**: Testing integration with external services beyond URL validation is out of scope.

## Design Considerations

No specific UI/UX design requirements for the test suite itself. The test suite will interact with existing extension UI elements (options page, new tab page) using Playwright's locator API. Tests will use role-based selectors and user-facing attributes (ARIA labels, text content) rather than implementation details (CSS classes, IDs) to ensure test stability.

## Repository Standards

The test suite implementation shall follow established repository patterns and conventions:

- **Conventional Commits**: All test-related commits must follow Conventional Commits format (e.g., `test: add new tab page tests`)
- **Pre-commit Hooks**: Test files must pass all pre-commit hooks (markdownlint for documentation, etc.)
- **Code Style**: Use modern JavaScript/TypeScript best practices and Playwright conventions. The test suite should follow industry-standard patterns (ES6+, async/await, proper TypeScript types if used) rather than mirroring the existing extension codebase patterns
- **File Organization**: Tests organized in `tests/` directory with subdirectories for page objects (`tests/page-objects/`)
- **Documentation**: All markdown documentation must pass markdownlint validation
- **CI Integration**: Tests integrated into existing `.github/workflows/ci.yml` workflow

## Technical Considerations

**Playwright Configuration:**

- Use Playwright's Chrome extension testing capabilities with `chromium.launchPersistentContext()`
- Resolve extension path using `path.join(__dirname, '..')` in fixtures (one level up from tests directory)
- Configure extension loading using `--load-extension` and `--disable-extensions-except` Chrome arguments
- Use `chromium` channel to enable headless mode for extensions
- Create reusable fixtures for extension context and extension ID retrieval
- Add storage helper methods to fixtures for accessing chrome.storage.local API

**Test Data Management:**

- Hardcode test URLs and settings directly in test files for simplicity
- Use guaranteed-available test URLs for testing (see Test URLs section below)
- Access `chrome.storage.local` API directly using `page.evaluate()` - no mocking required
- Test with real URLs and verify UI behavior - no network mocking required
- Create storage helper methods in fixtures for convenience (`setStorage()`, `getStorage()`, `clearStorage()`)

**Test URLs:**

Use the following reliable test URLs for consistent testing:

- `https://example.com` - IANA reserved domain, primary test URL
- `https://httpbin.org` - HTTP testing service for URL validation tests
- `https://www.google.com` - Real-world HTTPS URL for testing
- `https://httpstat.us` - HTTP status code testing service
- `chrome://version` - Chrome internal page for chrome:// scheme testing
- `https://jsonplaceholder.typicode.com` - JSON API for testing

**Page Object Model Implementation:**

- Create `NewTabPage` class for new tab page interactions
- Create `OptionsPage` class for options page interactions
- Encapsulate element locators and actions within page objects
- Use Playwright's locator API with role-based and text-based selectors

**Test Organization:**

- Group tests by feature area: `installation.spec.ts`, `newtab.spec.ts`, `options.spec.ts`, `e2e.spec.ts`
- Create shared fixtures in `tests/fixtures.ts` for extension context setup
- Use descriptive test names following pattern: `test('should [expected behavior] when [condition]')`

**CI/CD Integration:**

- Add Playwright test step to `.github/workflows/ci.yml`
- Run tests in parallel with existing validation steps
- Install Playwright browsers using `npx playwright install --with-deps`
- Run tests in headless mode for CI execution
- Configure Playwright to generate HTML report and test results JSON
- Upload HTML report as GitHub Actions artifact (always)
- Upload screenshots, videos, and traces on failure only (to save CI storage)
- Set retention: 30 days for reports, 7 days for failure artifacts

**Dependencies:**

- `@playwright/test`: Core Playwright testing framework
- `playwright`: Playwright browser automation (installed via `npx playwright install`)
- `typescript`: TypeScript compiler for type checking
- `@types/node`: TypeScript type definitions for Node.js

**File Structure:**

```text
tests/
├── fixtures.ts                 # Playwright fixtures for extension setup
├── test-data.ts                # Test URL constants and test data
├── page-objects/
│   ├── NewTabPage.ts           # Page object for new tab page
│   └── OptionsPage.ts          # Page object for options page
├── installation.spec.ts         # Extension installation tests
├── newtab.spec.ts              # New tab page functionality tests
├── options.spec.ts             # Options page functionality tests
├── e2e.spec.ts                 # End-to-end user flow tests
└── README.md                   # Test suite documentation
playwright.config.ts            # Playwright configuration (separate file)
tsconfig.json                   # TypeScript configuration
```

**Configuration Decisions:**

- **Playwright Config**: Separate `playwright.config.ts` file at project root
- **TypeScript Config**: `tsconfig.json` file at project root with Playwright-compatible settings
- **Test Reports**: HTML report always uploaded, failure artifacts (screenshots/videos) uploaded on failure only
- **Test Timeouts**: Use Playwright's recommended defaults (30 seconds per test) with ability to override for specific tests if needed
- **Test Data**: Hardcoded values in test files with constants file (`tests/test-data.ts`) for test URLs
- **Storage Access**: Use real chrome.storage.local API via `page.evaluate()` - no mocking required
- **Test Isolation**: Clear storage selectively - only for tests that need isolation, not for persistence tests
- **Redirect Testing**: Use `chrome://newtab` to simulate real user opening new tab (Chrome automatically loads extension's newtab.html)

## Success Metrics

1. **Test Coverage**: Initial test suite covers critical paths (installation, new tab redirect, options page save/load)
2. **CI Integration**: Tests run successfully in GitHub Actions CI workflow
3. **Test Execution Time**: Test suite completes in reasonable time (optimization deferred per requirements)
4. **Test Reliability**: Tests are stable and non-flaky, using Playwright's auto-waiting and retry mechanisms
5. **Documentation**: Complete test documentation (README, test structure guide, contributing guide) is available
6. **Maintainability**: Page Object Model pattern enables easy addition of new tests

## Open Questions

No open questions at this time. All configuration decisions have been made:

- Separate `playwright.config.ts` file
- Test reports published as GitHub Actions artifacts
- Use Playwright's recommended timeout defaults (30 seconds per test)
- Hardcoded test data values initially
