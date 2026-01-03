#!/usr/bin/env node

/**
 * Manual testing script for Shadow Tab Chrome extension
 * Opens a Playwright browser with the extension loaded for manual testing
 */

import { chromium } from "@playwright/test";
import * as path from "path";
import { existsSync, mkdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import process from "node:process";

// Resolve extension path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathToExtension = path.join(__dirname, "..");

// Verify manifest exists
if (!existsSync(path.join(pathToExtension, "manifest.json"))) {
  console.error("❌ Extension manifest.json not found at:", pathToExtension);
  process.exit(1);
}

async function startManualTesting() {
  console.log("🚀 Starting Shadow Tab manual testing...");
  console.log("📁 Extension path:", pathToExtension);
  const userDataDir = path.join(pathToExtension, ".temp", "playwright-profile");
  mkdirSync(userDataDir, { recursive: true });
  console.log("👤 Playwright profile dir:", userDataDir);

  let context = null;

  try {
    // Launch browser with extension loaded
    context = await chromium.launchPersistentContext(userDataDir, {
      channel: "chromium",
      headless: false, // Show browser window
      viewport: { width: 1920, height: 1080 }, // Set window size
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    const homePageUrl = pathToFileURL(
      path.join(pathToExtension, "assets", "index.html")
    ).toString();
    const homePage = context.pages()[0] || (await context.newPage());
    await homePage.goto(homePageUrl, { waitUntil: "domcontentloaded" });

    console.log("✅ Browser launched with extension loaded");
    console.log("🔧 Testing tips:");
    console.log("   - Open a new tab to see the extension in action");
    console.log(
      "   - Navigate to chrome://extensions to see extension details"
    );
    console.log("   - Right-click the extension icon to access options");
    console.log("   - Use Chrome DevTools to debug extension pages");
    console.log("");
    console.log("🌐 Extension pages you can visit:");

    let extensionId = null;
    try {
      let [serviceWorker] = context.serviceWorkers();
      if (!serviceWorker) {
        serviceWorker = await context.waitForEvent("serviceworker", {
          timeout: 10000,
        });
      }

      extensionId = serviceWorker.url().split("/")[2] || null;
    } catch {
      console.warn("⚠️  Could not auto-detect extension ID");
    }

    if (extensionId) {
      console.log(`   - New Tab: chrome://newtab`);
      console.log(
        `   - Options: chrome-extension://${extensionId}/options.html`
      );
      console.log(`   - Extension ID: ${extensionId}`);
    } else {
      console.log("   - New Tab: chrome://newtab");
      console.log(
        "   - Options: chrome-extension://[EXTENSION_ID]/options.html"
      );
      console.log("   (Extension ID will be shown in Chrome://extensions)");
    }

    console.log("");
    console.log("🛑 Press Ctrl+C to close the browser and exit");

    // Keep the process running
    process.on("SIGINT", async () => {
      console.log("\n🔄 Shutting down...");
      if (context) {
        await context.close();
      }
      process.exit(0);
    });

    // Wait indefinitely until interrupted
    await new Promise(() => {});
  } catch (error) {
    console.error("❌ Failed to start manual testing:", error);
    if (context) {
      await context.close();
    }
    process.exit(1);
  }
}

// Run the manual testing
startManualTesting().catch(console.error);
