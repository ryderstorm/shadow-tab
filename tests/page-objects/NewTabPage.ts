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
    await this.page.waitForLoadState("load");
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
