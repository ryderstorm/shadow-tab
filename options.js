// options.js

/**
 * Git commit hash (update manually on each commit)
 */
const GIT_COMMIT_HASH = "348bf02";

/**
 * Preset color themes
 */
const PRESET_COLORS = [
  { name: "Midnight Blue", value: "#191970" },
  { name: "Charcoal", value: "#36454F" },
  { name: "Deep Purple", value: "#2D1B3D" },
  { name: "Obsidian", value: "#0B0B0B" },
  { name: "Dark Navy", value: "#000080" },
  { name: "Dark Slate", value: "#2F4F4F" },
  { name: "Rich Black", value: "#05060a" },
  { name: "Midnight", value: "#000e34" },
  { name: "Dark Slate Gray", value: "#2D2D2D" },
  { name: "Deep Indigo", value: "#4B0082" },
];

/**
 * Validates URL format
 * Supports: http, https, chrome://, file://, data:, and other standard URL schemes
 * For web URLs (http/https), requires valid domain format (must contain at least one dot and match TLD pattern)
 * @param {string} urlString - The URL string to validate
 * @returns {boolean} - True if URL is valid, false otherwise
 */
function validateURL(urlString) {
  if (!urlString || typeof urlString !== "string" || urlString.trim() === "") {
    return false;
  }

  const trimmedUrl = urlString.trim();

  try {
    // Use URL constructor to validate URL format
    const url = new URL(trimmedUrl);
    const scheme = url.protocol.slice(0, -1); // Remove trailing colon

    // For web URLs (http/https), require valid domain format
    if (scheme === "http" || scheme === "https") {
      const hostname = url.hostname;
      // Domain must contain at least one dot and match TLD pattern
      // TLD pattern: at least 2 characters, letters only
      const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
      if (!hostname || !domainPattern.test(hostname)) {
        return false;
      }
    }

    // Allow any other scheme (chrome://, file://, data:, etc.) without domain validation
    return true;
  } catch (e) {
    // If URL constructor fails, check for common patterns
    // Allow relative URLs starting with / or ./
    if (trimmedUrl.startsWith("/") || trimmedUrl.startsWith("./")) {
      return true;
    }
    return false;
  }
}

/**
 * Displays error message for URL input
 * @param {string} message - Error message to display
 */
function showURLError(message) {
  const errorElement = document.getElementById("url-error");
  if (errorElement) {
    // Include example formats in error message if not already present
    let errorMessage = message;
    if (!message.includes("e.g.,") && !message.includes("example")) {
      errorMessage = `${message} (e.g., https://example.com)`;
    }
    errorElement.textContent = errorMessage;
    errorElement.classList.add("show");
  }
}

/**
 * Hides error message for URL input
 */
function hideURLError() {
  const errorElement = document.getElementById("url-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }
}

/**
 * Domain resolution timeout ID for debouncing
 */
let domainResolutionTimeout = null;

/**
 * Resolves domain by attempting to fetch the URL
 * @param {string} urlString - The URL string to resolve
 * @returns {Promise<boolean>} - True if domain resolves successfully, false otherwise
 */
async function resolveDomain(urlString) {
  if (!urlString || typeof urlString !== "string" || urlString.trim() === "") {
    return false;
  }

  const trimmedUrl = urlString.trim();

  try {
    const url = new URL(trimmedUrl);
    const scheme = url.protocol.slice(0, -1);

    // Only attempt resolution for http/https URLs
    if (scheme !== "http" && scheme !== "https") {
      // Non-web URLs are considered valid without resolution
      showURLValidationMessage("", false);
      return true;
    }

    // Show "validating url..." message with spinner
    showURLValidationMessage("validating url...", true);
    console.log("[Options] Validating URL:", trimmedUrl);

    // Use no-cors mode since CORS will never work from chrome-extension:// origin
    // Note: We can't read status codes in no-cors mode, so we can't detect 400/500 errors
    // But we can at least verify the URL is reachable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      await fetch(trimmedUrl, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // If fetch succeeds, URL is reachable
      // Note: We can't read status codes in no-cors mode, so we assume it's valid
      console.log("[Options] URL validation successful:", trimmedUrl);
      showURLValidationMessage("URL is reachable", false);
      hideURLError();
      return true;
    } catch (error) {
      clearTimeout(timeoutId);

      // AbortError means timeout - domain is unreachable
      if (error.name === "AbortError") {
        console.log("[Options] URL validation timed out:", trimmedUrl);
        showURLValidationMessage("", false);
        showURLError("URL validation timed out. The URL may be unreachable.");
        return false;
      }

      // Other network errors - URL is unreachable
      console.log("[Options] URL validation failed:", trimmedUrl, error);
      showURLValidationMessage("", false);
      showURLError("URL is unreachable or network error occurred.");
      return false;
    }
  } catch (e) {
    showURLValidationMessage("", false);
    showURLError("Invalid URL format.");
    return false;
  }
}

/**
 * Shows URL validation message with optional spinner
 * @param {string} message - Message to display (empty string hides message)
 * @param {boolean} showSpinner - Whether to show spinner
 */
function showURLValidationMessage(message, showSpinner) {
  const validationMessage = document.getElementById("url-validation-message");
  if (!validationMessage) {
    return;
  }

  if (!message || message === "") {
    validationMessage.textContent = "";
    validationMessage.classList.remove("validating", "success");
    return;
  }

  validationMessage.textContent = message;
  if (showSpinner) {
    validationMessage.classList.add("validating");
    validationMessage.classList.remove("success");
  } else {
    validationMessage.classList.add("success");
    validationMessage.classList.remove("validating");
  }
}

/**
 * Validates redirect delay (must be non-negative number)
 * @param {string|number} delayValue - The delay value to validate
 * @returns {boolean} - True if delay is valid, false otherwise
 */
function validateRedirectDelay(delayValue) {
  if (delayValue === "" || delayValue === null || delayValue === undefined) {
    return true; // Empty is valid (will use default)
  }

  const numValue = Number(delayValue);
  if (isNaN(numValue)) {
    return false;
  }

  // Must be non-negative
  if (numValue < 0) {
    return false;
  }

  // Check for reasonable maximum (e.g., 60 seconds = 60000ms)
  if (numValue > 60000) {
    return false;
  }

  return true;
}

/**
 * Validates background color (must be valid CSS color value)
 * Supports: hex (#rrggbb), rgb/rgba, hsl/hsla, named colors
 * @param {string} colorValue - The color value to validate
 * @returns {boolean} - True if color is valid, false otherwise
 */
function validateBackgroundColor(colorValue) {
  if (!colorValue || typeof colorValue !== "string" || colorValue.trim() === "") {
    return true; // Empty is valid (will use default)
  }

  const trimmedColor = colorValue.trim();

  // Check if it's a valid CSS color by trying to set it on a temporary element
  const tempElement = document.createElement("div");
  tempElement.style.color = trimmedColor;
  const computedColor = tempElement.style.color;

  // If the color was set successfully, it's valid
  if (computedColor !== "" && computedColor !== "transparent") {
    return true;
  }

  // Also check common hex pattern
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (hexPattern.test(trimmedColor)) {
    return true;
  }

  // Check rgb/rgba pattern
  const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;
  if (rgbPattern.test(trimmedColor)) {
    return true;
  }

  // Check hsl/hsla pattern
  const hslPattern = /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/;
  if (hslPattern.test(trimmedColor)) {
    return true;
  }

  return false;
}

/**
 * Displays error message for redirect delay input
 * @param {string} message - Error message to display
 */
function showRedirectDelayError(message) {
  const errorElement = document.getElementById("redirect-delay-error");
  if (errorElement) {
    // Include example format if not already present
    let errorMessage = message;
    if (!message.includes("e.g.,") && !message.includes("example")) {
      errorMessage = `${message} (e.g., 0, 1000, 5000)`;
    }
    errorElement.textContent = errorMessage;
    errorElement.classList.add("show");
  }
}

/**
 * Hides error message for redirect delay input
 */
function hideRedirectDelayError() {
  const errorElement = document.getElementById("redirect-delay-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }
}

/**
 * Displays error message for background color input
 * @param {string} message - Error message to display
 */
function showBackgroundColorError(message) {
  const errorElement = document.getElementById("background-color-error");
  if (errorElement) {
    // Include example formats if not already present
    let errorMessage = message;
    if (!message.includes("e.g.,") && !message.includes("example") && !message.includes("hex:")) {
      errorMessage = `${message} (hex: #05060a, rgb: rgb(5,6,10), or named: black)`;
    }
    errorElement.textContent = errorMessage;
    errorElement.classList.add("show");
  }
}

/**
 * Hides error message for background color input
 */
function hideBackgroundColorError() {
  const errorElement = document.getElementById("background-color-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }
}

/**
 * Displays success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
  const successElement = document.getElementById("save-success");
  if (successElement) {
    successElement.textContent = message;
    successElement.classList.add("show");
    // Hide success message after 3 seconds
    setTimeout(() => {
      successElement.classList.remove("show");
    }, 3000);
  }
}

/**
 * Hides success message
 */
function hideSuccess() {
  const successElement = document.getElementById("save-success");
  if (successElement) {
    successElement.textContent = "";
    successElement.classList.remove("show");
  }
}

/**
 * Saves all settings to chrome.storage.local
 * @param {string} url - URL to save
 * @param {number} redirectDelay - Redirect delay in milliseconds
 * @param {string} backgroundColor - Background color value
 * @returns {Promise<void>}
 */
async function saveSettings(url, redirectDelay, backgroundColor) {
  return new Promise((resolve, reject) => {
    const settings = {
      url: url.trim(),
      redirectDelay: redirectDelay,
      backgroundColor: backgroundColor.trim(),
    };
    console.log("[Options] Saving settings:", settings);
    chrome.storage.local.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error("[Options] Error saving settings:", chrome.runtime.lastError);
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        console.log("[Options] Settings saved successfully");
        resolve();
      }
    });
  });
}

/**
 * Gets version from manifest.json
 * @returns {string} - Version string from manifest
 */
function getManifestVersion() {
  try {
    const manifest = chrome.runtime.getManifest();
    return manifest.version || "unknown";
  } catch (e) {
    console.error("[Options] Error reading manifest version:", e);
    return "unknown";
  }
}

/**
 * Displays version information in footer
 */
function displayVersion() {
  const footer = document.getElementById("version-footer");
  if (footer) {
    const version = getManifestVersion();
    const commitHash = GIT_COMMIT_HASH;
    footer.textContent = `Version: ${version} (${commitHash})`;
    console.log("[Options] Version displayed:", version, commitHash);
  }
}

/**
 * Validates stored settings and shows warnings for invalid values
 */
function validateStoredSettings() {
  chrome.storage.local.get(
    ["url", "redirectDelay", "backgroundColor"],
    (result) => {
      if (chrome.runtime.lastError) {
        console.error("[Options] Error loading settings for validation:", chrome.runtime.lastError);
        return;
      }

      const warnings = [];

      // Validate URL
      if (result.url && !validateURL(result.url)) {
        warnings.push("Stored URL is invalid. Please update it.");
        console.warn("[Options] Invalid stored URL:", result.url);
      }

      // Validate redirect delay
      if (result.redirectDelay !== undefined && !validateRedirectDelay(result.redirectDelay)) {
        warnings.push("Stored redirect delay is invalid. Using default (0ms).");
        console.warn("[Options] Invalid stored redirect delay:", result.redirectDelay);
      }

      // Validate background color
      if (result.backgroundColor && !validateBackgroundColor(result.backgroundColor)) {
        warnings.push("Stored background color is invalid. Using default (#05060a).");
        console.warn("[Options] Invalid stored background color:", result.backgroundColor);
      }

      // Show warnings if any, but don't block functionality
      if (warnings.length > 0) {
        const urlErrorElement = document.getElementById("url-error");
        if (urlErrorElement && warnings[0].includes("URL")) {
          urlErrorElement.textContent = warnings[0];
          urlErrorElement.classList.add("show");
        }
        console.warn("[Options] Settings validation warnings:", warnings);
      }
    }
  );
}

/**
 * Applies background color to options page body
 * @param {string} color - CSS color value
 */
function applyBackgroundColorToPage(color) {
  if (color && typeof color === "string" && color.trim() !== "") {
    document.body.style.backgroundColor = color.trim();
    console.log("[Options] Applied background color to page:", color.trim());
  } else {
    document.body.style.backgroundColor = "#05060a";
  }
}

/**
 * Updates color picker and text input to match a color value
 * @param {string} colorValue - Color value to set
 */
function updateColorInputs(colorValue) {
  const colorPicker = document.getElementById("color-picker");
  const backgroundColorInput = document.getElementById("background-color-input");

  if (colorPicker && colorValue) {
    colorPicker.value = colorValue;
  }
  if (backgroundColorInput && colorValue) {
    backgroundColorInput.value = colorValue;
  }
}

/**
 * Loads all settings from chrome.storage.local and populates input fields
 */
function loadSettings() {
  chrome.storage.local.get(
    ["url", "redirectDelay", "backgroundColor"],
    (result) => {
      if (chrome.runtime.lastError) {
        console.error("[Options] Error loading settings:", chrome.runtime.lastError);
        return;
      }

      console.log("[Options] Loading settings from storage:", result);

      // Load URL
      const urlInput = document.getElementById("url-input");
      if (urlInput) {
        if (result.url) {
          urlInput.value = result.url;
          console.log("[Options] Loaded URL:", result.url);
          // Validate loaded URL
          if (!validateURL(result.url)) {
            showURLError("Stored URL is invalid. Please update it.");
          }
        }
      }

      // Load redirect delay (default to 0 if not set)
      const redirectDelayInput = document.getElementById("redirect-delay-input");
      if (redirectDelayInput) {
        const delayValue = result.redirectDelay !== undefined ? result.redirectDelay : 0;
        redirectDelayInput.value = delayValue;
        console.log("[Options] Loaded redirect delay:", delayValue, "ms");
      }

      // Load background color (default to #05060a if not set)
      const colorValue = result.backgroundColor !== undefined
        ? result.backgroundColor
        : "#05060a";
      updateColorInputs(colorValue);
      applyBackgroundColorToPage(colorValue);
      console.log("[Options] Loaded background color:", colorValue);
    }
  );
}

/**
 * Handles form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  hideSuccess();
  hideURLError();
  hideRedirectDelayError();
  hideBackgroundColorError();

  const urlInput = document.getElementById("url-input");
  const redirectDelayInput = document.getElementById("redirect-delay-input");
  const backgroundColorInput = document.getElementById("background-color-input");

  const urlValue = urlInput.value.trim();
  const redirectDelayValue = redirectDelayInput.value
    ? Number(redirectDelayInput.value)
    : 0;
  const backgroundColorValue = backgroundColorInput.value.trim() || "#05060a";

  // Validate all fields before saving
  let hasErrors = false;

  if (!validateURL(urlValue)) {
    showURLError("Please enter a valid URL");
    hasErrors = true;
  }

  if (!validateRedirectDelay(redirectDelayValue)) {
    showRedirectDelayError(
      "Please enter a valid delay (0-60000 milliseconds, non-negative number)"
    );
    hasErrors = true;
  }

  if (!validateBackgroundColor(backgroundColorValue)) {
    showBackgroundColorError(
      "Please enter a valid CSS color"
    );
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  try {
    console.log("[Options] Form submitted with values:", {
      url: urlValue,
      redirectDelay: redirectDelayValue,
      backgroundColor: backgroundColorValue,
    });
    await saveSettings(urlValue, redirectDelayValue, backgroundColorValue);
    showSuccess("Settings saved successfully!");
  } catch (error) {
    console.error("[Options] Error saving settings:", error);
    showURLError("Failed to save settings. Please try again.");
  }
}

/**
 * Handles real-time URL validation on input
 */
function handleURLInput() {
  const urlInput = document.getElementById("url-input");
  const urlValue = urlInput.value.trim();

  // Clear any existing timeout
  if (domainResolutionTimeout) {
    clearTimeout(domainResolutionTimeout);
    domainResolutionTimeout = null;
  }

  // Clear any existing validation message
  showURLValidationMessage("", false);

  if (urlValue === "") {
    hideURLError();
    return;
  }

  if (!validateURL(urlValue)) {
    showURLError("Please enter a valid URL");
    return;
  }

  // Clear error if URL format is valid
  hideURLError();

  // Debounce domain resolution: wait 1 second after user stops typing
  if (domainResolutionTimeout) {
    clearTimeout(domainResolutionTimeout);
    domainResolutionTimeout = null;
  }

  domainResolutionTimeout = setTimeout(async () => {
    await resolveDomain(urlValue);
  }, 1000);
}

/**
 * Handles real-time redirect delay validation on input
 */
function handleRedirectDelayInput() {
  const redirectDelayInput = document.getElementById("redirect-delay-input");
  const delayValue = redirectDelayInput.value;

  if (delayValue === "") {
    hideRedirectDelayError();
    return;
  }

  if (!validateRedirectDelay(delayValue)) {
    showRedirectDelayError(
      "Please enter a valid delay (0-60000 milliseconds, non-negative number)"
    );
  } else {
    hideRedirectDelayError();
  }
}

/**
 * Handles real-time background color validation on input
 */
function handleBackgroundColorInput() {
  const backgroundColorInput = document.getElementById("background-color-input");
  const colorValue = backgroundColorInput.value.trim();

  if (colorValue === "") {
    hideBackgroundColorError();
    return;
  }

  if (!validateBackgroundColor(colorValue)) {
    showBackgroundColorError(
      "Please enter a valid CSS color"
    );
  } else {
    hideBackgroundColorError();
    // Update color picker to match text input
    const colorPicker = document.getElementById("color-picker");
    if (colorPicker && colorValue) {
      // Try to convert to hex for color picker
      const tempDiv = document.createElement("div");
      tempDiv.style.color = colorValue;
      const computedColor = tempDiv.style.color;
      if (computedColor) {
        // Convert rgb/rgba to hex if needed
        const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]).toString(16).padStart(2, "0");
          const g = parseInt(rgbMatch[2]).toString(16).padStart(2, "0");
          const b = parseInt(rgbMatch[3]).toString(16).padStart(2, "0");
          colorPicker.value = `#${r}${g}${b}`;
        } else if (colorValue.startsWith("#")) {
          colorPicker.value = colorValue;
        }
      }
    }
    // Live preview: update page background
    applyBackgroundColorToPage(colorValue);
  }
}

/**
 * Handles color picker input changes
 */
function handleColorPickerInput() {
  const colorPicker = document.getElementById("color-picker");
  const backgroundColorInput = document.getElementById("background-color-input");
  const colorValue = colorPicker.value;

  if (backgroundColorInput && colorValue) {
    backgroundColorInput.value = colorValue;
    hideBackgroundColorError();
    // Live preview: update page background
    applyBackgroundColorToPage(colorValue);
  }
}

/**
 * Handles preset color button clicks
 * @param {string} colorValue - Color value from preset button
 */
function handlePresetColorClick(colorValue) {
  updateColorInputs(colorValue);
  applyBackgroundColorToPage(colorValue);
  hideBackgroundColorError();
  console.log("[Options] Preset color selected:", colorValue);
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Options] Page initialized, loading settings...");

  // Display version information
  displayVersion();

  // Validate stored settings
  validateStoredSettings();

  // Load saved settings
  loadSettings();

  // Set up form submission handler
  const form = document.getElementById("options-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Set up real-time validation on URL input
  const urlInput = document.getElementById("url-input");
  if (urlInput) {
    urlInput.addEventListener("input", handleURLInput);
    urlInput.addEventListener("blur", handleURLInput);
  }

  // Set up real-time validation on redirect delay input
  const redirectDelayInput = document.getElementById("redirect-delay-input");
  if (redirectDelayInput) {
    redirectDelayInput.addEventListener("input", handleRedirectDelayInput);
    redirectDelayInput.addEventListener("blur", handleRedirectDelayInput);
  }

  // Set up real-time validation on background color input
  const backgroundColorInput = document.getElementById("background-color-input");
  if (backgroundColorInput) {
    backgroundColorInput.addEventListener("input", handleBackgroundColorInput);
    backgroundColorInput.addEventListener("blur", handleBackgroundColorInput);
  }

  // Set up color picker event handler
  const colorPicker = document.getElementById("color-picker");
  if (colorPicker) {
    colorPicker.addEventListener("input", handleColorPickerInput);
    colorPicker.addEventListener("change", handleColorPickerInput);
  }

  // Set up preset color buttons
  const presetButtons = document.querySelectorAll(".preset-color-btn");
  presetButtons.forEach((button) => {
    const colorValue = button.getAttribute("data-color");
    if (colorValue) {
      // Set background color via inline style
      button.style.backgroundColor = colorValue;
      button.addEventListener("click", () => {
        handlePresetColorClick(colorValue);
      });
    }
  });
});
