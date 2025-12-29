# Task 1.0 Proof Artifacts: Setup Playwright Infrastructure and Extension Fixtures

## Overview

This document provides proof artifacts demonstrating that Playwright infrastructure and extension fixtures have been successfully set up for the Chrome extension test suite.

## Files Created

### package.json

File exists at project root with Node.js project configuration:

```json
{
  "name": "dark-homepage-newtab",
  "version": "0.1.0",
  "description": "Dark new tab that loads my self-hosted homepage.dev dashboard.",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:list": "playwright test --list"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "@types/chrome": "^0.1.32",
    "@types/node": "^24.10.1",
    "typescript": "^5.9.3"
  }
}
```

**Verification:**

```bash
$ ls -la package.json
.rw-rw-r-- damien damien 500 B  Sun Dec  7 20:49:13 2025 package.json
```

### tsconfig.json

File exists at project root with Playwright-compatible TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
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

**Verification:**

```bash
$ ls -la tsconfig.json
.rw-rw-r-- damien damien 478 B  Sun Dec  7 20:49:15 2025 tsconfig.json
```

### playwright.config.ts

File exists at project root with basic configuration:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

**Verification:**

```bash
$ ls -la playwright.config.ts
.rw-rw-r-- damien damien 1.4 KB  Sun Dec  7 20:48:29 2025 playwright.config.ts
```

### tests/fixtures.ts

File exists with extension fixtures:

```typescript
import {
  test as base,
  expect,
  chromium,
  BrowserContext,
  Page,
} from "@playwright/test";
import * as path from "path";
import { existsSync } from "fs";

const pathToExtension = path.join(__dirname, "..");

export const test = base.extend<ExtensionFixtures>({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium",
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    const [serviceWorker] = await Promise.all([
      context.waitForEvent("serviceworker"),
    ]);
    const serviceWorkerUrl = serviceWorker.url();
    const extensionIdMatch = serviceWorkerUrl.match(
      /chrome-extension:\/\/([a-z]{32})/
    );
    if (!extensionIdMatch) {
      throw new Error("Could not extract extension ID from service worker URL");
    }
    const extensionId = extensionIdMatch[1];
    await use(extensionId);
  },
  setStorage: async ({ context }, use) => {
    /* ... */
  },
  getStorage: async ({ context }, use) => {
    /* ... */
  },
  clearStorage: async ({ context }, use) => {
    /* ... */
  },
});

export { expect };
```

**Verification:**

```bash
$ ls -la tests/fixtures.ts
.rw-rw-r-- damien damien 3.9 KB  Sun Dec  7 20:49:14 2025 tests/fixtures.ts
```

### tests/test-data.ts

File exists with test URL constants:

```typescript
export const TEST_URLS = {
  EXAMPLE_COM: "https://example.com",
  HTTPBIN_ORG: "https://httpbin.org",
  GOOGLE_COM: "https://www.google.com",
  HTTPSTAT_US: "https://httpstat.us",
  CHROME_VERSION: "chrome://version",
  JSONPLACEHOLDER: "https://jsonplaceholder.typicode.com",
} as const;
```

**Verification:**

```bash
$ ls -la tests/test-data.ts
.rw-rw-r-- damien damien 725 B  Sun Dec  7 20:49:15 2025 tests/test-data.ts
```

## CLI Output

### Playwright Test List Command

Demonstrates Playwright is properly configured:

```bash
$ npx playwright test --list

Error: No tests found
Listing tests:
Total: 0 tests in 0 files
```

**Note:** "No tests found" is expected since no test files have been created yet. The important verification is that Playwright runs without configuration errors.

### TypeScript Compilation

Demonstrates fixtures compile without errors:

```bash
$ npx tsc --noEmit tests/fixtures.ts
(no output - compilation successful)
```

## Package Dependencies

### package.json includes @playwright/test dependency

```bash
$ cat package.json | grep -A 5 "devDependencies"
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "@types/chrome": "^0.1.32",
    "@types/node": "^24.10.1",
    "typescript": "^5.9.3"
  }
```

## Directory Structure

Tests directory structure created:

```bash
$ tree tests/ -L 2
tests/
├── fixtures.ts
├── page-objects/
└── test-data.ts
```

## .gitignore Updated

Playwright test artifacts excluded:

```bash
$ cat .gitignore
.temp

# Playwright test artifacts
test-results/
playwright-report/
playwright/.cache/
```

## Verification Summary

✅ `package.json` exists with Playwright and TypeScript dependencies
✅ `tsconfig.json` exists with Playwright-compatible configuration
✅ `playwright.config.ts` exists with Chromium browser configuration
✅ `tests/fixtures.ts` exists with extension context and storage helper fixtures
✅ `tests/test-data.ts` exists with test URL constants
✅ `npx playwright test --list` runs without configuration errors
✅ TypeScript compilation succeeds for fixtures
✅ Dependencies installed successfully
✅ Directory structure created
✅ `.gitignore` updated with Playwright artifacts

All proof artifacts demonstrate that Task 1.0 has been successfully completed.
