import { Page, Locator } from "@playwright/test";

/**
 * Page Object Model for the Options page.
 * Encapsulates all interactions with the options page.
 */
export class OptionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the options page using extension ID.
   * @param extensionId - The extension ID
   */
  async goto(extensionId: string): Promise<void> {
    await this.page.goto(`chrome-extension://${extensionId}/options.html`, {
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Returns locator for the URL input field.
   */
  getUrlInput(): Locator {
    return this.page.locator("#url-input");
  }

  /**
   * Returns locator for the redirect delay input field.
   */
  getRedirectDelayInput(): Locator {
    return this.page.locator("#redirect-delay-input");
  }

  /**
   * Returns locator for the background color text input field.
   */
  getBackgroundColorInput(): Locator {
    return this.page.locator("#background-color-input");
  }

  /**
   * Returns locator for the color picker input.
   */
  getColorPicker(): Locator {
    return this.page.locator("#color-picker");
  }

  /**
   * Returns locator for the save button.
   */
  getSaveButton(): Locator {
    return this.page.locator("#save-button");
  }

  /**
   * Returns locator for the URL error message element.
   */
  getUrlError(): Locator {
    return this.page.locator("#url-error");
  }

  /**
   * Returns locator for the redirect delay error message element.
   */
  getRedirectDelayError(): Locator {
    return this.page.locator("#redirect-delay-error");
  }

  /**
   * Returns locator for the background color error message element.
   */
  getBackgroundColorError(): Locator {
    return this.page.locator("#background-color-error");
  }

  /**
   * Returns locator for the success message element.
   */
  getSuccessMessage(): Locator {
    return this.page.locator("#save-success");
  }

  /**
   * Returns locator for the URL validation message element.
   */
  getUrlValidationMessage(): Locator {
    return this.page.locator("#url-validation-message");
  }

  /**
   * Returns locator for preset color button with specified data-color attribute.
   * @param color - The color value (e.g., "#05060a")
   */
  getPresetColorButton(color: string): Locator {
    return this.page.locator(`button.preset-color-btn[data-color="${color}"]`);
  }

  /**
   * Returns locator for the version footer element.
   */
  getVersionFooter(): Locator {
    return this.page.locator("#version-footer");
  }

  /**
   * Fills the URL input field.
   * @param url - The URL to enter
   */
  async fillUrl(url: string): Promise<void> {
    await this.getUrlInput().fill(url);
  }

  /**
   * Fills the redirect delay input field.
   * @param delay - The delay value in milliseconds
   */
  async fillRedirectDelay(delay: number): Promise<void> {
    await this.getRedirectDelayInput().fill(delay.toString());
  }

  /**
   * Fills the background color input field.
   * @param color - The color value (e.g., "#05060a")
   */
  async fillBackgroundColor(color: string): Promise<void> {
    await this.getBackgroundColorInput().fill(color);
  }

  /**
   * Clicks the save button.
   */
  async clickSave(): Promise<void> {
    await this.getSaveButton().click();
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
