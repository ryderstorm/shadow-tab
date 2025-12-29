/**
 * Test URL constants for consistent testing across the test suite.
 * These URLs are guaranteed to be available and reliable for testing purposes.
 */

export const TEST_URLS = {
  /** IANA reserved domain - primary test URL */
  EXAMPLE_COM: "https://example.com",
  /** HTTP testing service for URL validation tests */
  HTTPBIN_ORG: "https://httpbin.org",
  /** Real-world HTTPS URL for testing */
  GOOGLE_COM: "https://www.google.com",
  /** HTTP status code testing service */
  HTTPSTAT_US: "https://httpstat.us",
  /** Chrome internal page for chrome:// scheme testing */
  CHROME_VERSION: "chrome://version",
  /** JSON API for testing */
  JSONPLACEHOLDER: "https://jsonplaceholder.typicode.com",
} as const;
