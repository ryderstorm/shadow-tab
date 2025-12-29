// newtab.js

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
      const domainPattern =
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
      if (!hostname || !domainPattern.test(hostname)) {
        return false;
      }
    }

    // Allow any other scheme (chrome://, file://, data:, etc.) without domain validation
    return true;
  } catch (_e) {
    // If URL constructor fails, check for common patterns
    // Allow relative URLs starting with / or ./
    if (trimmedUrl.startsWith("/") || trimmedUrl.startsWith("./")) {
      return true;
    }
    return false;
  }
}

/**
 * Shows error message on new tab page
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorElement = document.getElementById("error-message");
  const loadingElement = document.getElementById("loading");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

/**
 * Applies background color to body element
 * @param {string} color - CSS color value
 */
function applyBackgroundColor(color) {
  if (color && typeof color === "string" && color.trim() !== "") {
    document.body.style.backgroundColor = color.trim();
    console.log("[NewTab] Applied background color:", color.trim());
  } else {
    // Use default dark color
    document.body.style.backgroundColor = "#05060a";
    console.log("[NewTab] Using default background color: #05060a");
  }
}

/**
 * Redirects to the configured URL
 * @param {string} url - URL to redirect to
 * @param {number} delay - Delay in milliseconds before redirect
 */
function redirectToURL(url, delay) {
  if (!url || !validateURL(url)) {
    showError(
      "Invalid or missing URL. Please configure a valid URL in the extension options."
    );
    console.error("[NewTab] Invalid URL:", url);
    return;
  }

  const delayMs = delay && delay >= 0 ? delay : 0;

  console.log("[NewTab] Redirecting to:", url, "after", delayMs, "ms delay");

  if (delayMs === 0) {
    // Immediate redirect
    window.location.href = url;
  } else {
    // Delayed redirect
    setTimeout(() => {
      console.log("[NewTab] Executing redirect to:", url);
      window.location.href = url;
    }, delayMs);
  }
}

/**
 * Loads settings from chrome.storage.local and applies them
 */
function loadAndApplySettings() {
  console.log("[NewTab] Loading settings from storage...");

  chrome.storage.local.get(
    ["url", "redirectDelay", "backgroundColor"],
    (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "[NewTab] Error loading settings:",
          chrome.runtime.lastError
        );
        showError(
          "Error loading settings. Please check the extension configuration."
        );
        return;
      }

      console.log("[NewTab] Settings loaded:", result);

      // Apply background color immediately (before any redirect)
      const backgroundColor =
        result.backgroundColor !== undefined &&
        result.backgroundColor.trim() !== ""
          ? result.backgroundColor
          : "#05060a";
      applyBackgroundColor(backgroundColor);

      // Get redirect delay (default to 0 if not set)
      const redirectDelay =
        result.redirectDelay !== undefined ? result.redirectDelay : 0;
      console.log("[NewTab] Redirect delay:", redirectDelay, "ms");

      // Get URL and redirect
      const url = result.url;
      if (!url || !validateURL(url)) {
        showError(
          "No valid URL configured. Please set a URL in the extension options."
        );
        console.error("[NewTab] No valid URL found in settings");
        return;
      }

      // Show/hide loading animation based on redirect delay
      const loadingElement = document.getElementById("loading");
      if (loadingElement) {
        if (redirectDelay > 0) {
          loadingElement.style.display = "flex";
        } else {
          loadingElement.style.display = "none";
        }
      }

      // Redirect to configured URL
      redirectToURL(url, redirectDelay);
    }
  );
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("[NewTab] Page initialized");
  loadAndApplySettings();
});
