import {
  test as base,
  expect,
  chromium,
  BrowserContext,
  Page,
} from "@playwright/test";
import * as path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { NewTabPage } from "./page-objects/NewTabPage";
import { OptionsPage } from "./page-objects/OptionsPage";

// Resolve extension path (one level up from tests directory)
// Use ES module syntax for __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathToExtension = path.join(__dirname, "..");

// Verify manifest exists
if (!existsSync(path.join(pathToExtension, "manifest.json"))) {
  throw new Error("Extension manifest.json not found at: " + pathToExtension);
}

// Define fixtures type
type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
  setStorage: (data: Record<string, any>) => Promise<void>;
  getStorage: (keys?: string | string[]) => Promise<Record<string, any>>;
  clearStorage: () => Promise<void>;
  newTabPage: NewTabPage;
  optionsPage: OptionsPage;
  page: Page;
};

// Extend base test with extension fixtures
export const test = base.extend<ExtensionFixtures>({
  // Context fixture: loads Chrome extension
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium",
      headless: true, // Run in headless mode
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    await use(context);

    await context.close();
  },

  // Extension ID fixture: retrieves extension ID from extension page using chrome.runtime
  extensionId: async ({ context }, use) => {
    // Wait for extension to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let extensionId: string | null = null;

    // Method 1: Navigate to chrome://newtab which loads the extension's newtab.html
    // Then use chrome.runtime.id to get the extension ID
    const page = await context.newPage();
    try {
      await page.goto("chrome://newtab", {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });

      // Get extension ID using chrome.runtime API from the extension page
      extensionId = await page.evaluate(() => {
        return new Promise<string | null>((resolve) => {
          if (
            typeof chrome !== "undefined" &&
            chrome.runtime &&
            chrome.runtime.id
          ) {
            resolve(chrome.runtime.id);
          } else {
            resolve(null);
          }
        });
      });

      // If that didn't work, try to get it from the page URL
      if (!extensionId) {
        const url = page.url();
        const match = url.match(/chrome-extension:\/\/([a-z]{32})/);
        if (match) {
          extensionId = match[1];
        }
      }
    } catch {
      // chrome://newtab failed, try alternatives
    } finally {
      await page.close();
    }

    // Method 2: Try accessing options.html directly by trying common extension ID patterns
    // or use CDP to find extension targets
    if (!extensionId) {
      const tempPage = await context.newPage();
      try {
        const client = await context.newCDPSession(tempPage);
        const targets = await client.send("Target.getTargets");

        for (const target of targets.targetInfos) {
          if (target.url?.startsWith("chrome-extension://")) {
            const match = target.url.match(/chrome-extension:\/\/([a-z]{32})/);
            if (match) {
              extensionId = match[1];
              break;
            }
          }
        }
        await client.detach();
      } catch {
        // CDP failed
      } finally {
        await tempPage.close();
      }
    }

    if (!extensionId || !/^[a-z]{32}$/.test(extensionId)) {
      throw new Error(
        "Could not extract extension ID. Extension may not be loaded correctly."
      );
    }

    await use(extensionId);
  },

  // Storage helper: set storage values
  setStorage: async ({ context, extensionId: _extensionId }, use) => {
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

  // Storage helper: get storage values
  getStorage: async ({ context, extensionId: _extensionId }, use) => {
    await use(async (keys?: string | string[]) => {
      // Navigate to extension page to access chrome.storage API
      const page = await context.newPage();
      try {
        // Navigate to chrome://newtab which loads the extension's newtab.html
        // This ensures chrome.storage API is available
        await page.goto("chrome://newtab", {
          waitUntil: "domcontentloaded",
        });

        return await page.evaluate((storageKeys) => {
          return new Promise<Record<string, any>>((resolve) => {
            chrome.storage.local.get(storageKeys || null, (result) => {
              resolve(result);
            });
          });
        }, keys);
      } finally {
        await page.close();
      }
    });
  },

  // Storage helper: clear storage
  clearStorage: async ({ context, extensionId: _extensionId }, use) => {
    await use(async () => {
      // Navigate to extension page to access chrome.storage API
      const page = await context.newPage();
      try {
        // Navigate to chrome://newtab which loads the extension's newtab.html
        // This ensures chrome.storage API is available
        await page.goto("chrome://newtab", {
          waitUntil: "domcontentloaded",
        });

        await page.evaluate(() => {
          return new Promise<void>((resolve) => {
            chrome.storage.local.clear(() => {
              resolve();
            });
          });
        });
      } finally {
        await page.close();
      }
    });
  },

  // Page fixture: provides a Page instance with automatic cleanup
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },

  // New tab page fixture: provides a NewTabPage instance (doesn't auto-open, test calls openNewTab() when ready)
  newTabPage: async ({ page }, use) => {
    const newTabPage = new NewTabPage(page);
    await use(newTabPage);
  },

  // Options page fixture: provides an OptionsPage instance (doesn't auto-navigate, test calls goto() when ready)
  optionsPage: async ({ page }, use) => {
    const optionsPage = new OptionsPage(page);
    await use(optionsPage);
  },
});

export { expect };
