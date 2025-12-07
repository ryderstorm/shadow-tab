# Task 4.0 Proof Artifacts: Update New Tab Page to Use Dynamic Configuration

## Code Review: Updated newtab.js

### Complete newtab.js File

```javascript
// newtab.js

/**
 * Validates URL format
 * Supports: http, https, chrome://, file://, data:, and other standard URL schemes
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
    // Allow any scheme (http, https, chrome, file, data, etc.)
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
 * Hides error message and shows loading text
 */
function hideError() {
  const errorElement = document.getElementById("error-message");
  const loadingElement = document.getElementById("loading");
  if (errorElement) {
    errorElement.classList.remove("show");
  }
  if (loadingElement) {
    loadingElement.style.display = "block";
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
    showError("Invalid or missing URL. Please configure a valid URL in the extension options.");
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
        console.error("[NewTab] Error loading settings:", chrome.runtime.lastError);
        showError("Error loading settings. Please check the extension configuration.");
        return;
      }

      console.log("[NewTab] Settings loaded:", result);

      // Apply background color immediately (before any redirect)
      const backgroundColor =
        result.backgroundColor !== undefined && result.backgroundColor.trim() !== ""
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

      // Hide loading text if redirect is immediate
      if (redirectDelay === 0) {
        const loadingElement = document.getElementById("loading");
        if (loadingElement) {
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
```

**Verification:**

- ✓ Reads configuration from chrome.storage.local on page load
- ✓ Includes error handling for storage operations
- ✓ Applies background color immediately before redirect
- ✓ Validates URL before attempting redirect
- ✓ Implements redirect delay using setTimeout
- ✓ Handles missing/invalid URL with error message
- ✓ Removed hardcoded DASHBOARD_URL constant
- ✓ Console logging with [NewTab] prefix for debugging

## Code Review: Updated newtab.html

### Complete newtab.html File

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>New Tab</title>

    <!-- Hint Chrome that this is dark UI -->
    <meta name="color-scheme" content="dark" />

    <link rel="stylesheet" href="newtab.css" />
  </head>
  <body>
    <div id="loading">Loading…</div>
    <div id="error-message" class="error-message" role="alert"></div>

    <script src="newtab.js"></script>
  </body>
</html>
```

**Verification:**

- ✓ Error message container div added (`id="error-message"`)
- ✓ Error message initially hidden (no `show` class)
- ✓ Loading text updated to generic "Loading…"
- ✓ External script reference (CSP compliant)
- ✓ External CSS reference (CSP compliant)

## Code Review: Updated newtab.css

### Error Message Styling

```css
.error-message {
  font-size: 14px;
  color: #e53e3e;
  text-align: center;
  padding: 20px;
  display: none;
  z-index: 2;
}
.error-message.show {
  display: block;
}
```

**Verification:**

- ✓ Error message styled with red color (#e53e3e) matching dark theme
- ✓ Centered text alignment
- ✓ Hidden by default (`display: none`)
- ✓ Shown when `.show` class is added
- ✓ Higher z-index (2) than loading element (1)

## Code Review: Background Color Application

### Immediate Background Color Application

```javascript
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

// Applied immediately in loadAndApplySettings()
applyBackgroundColor(backgroundColor);
```

**Verification:**

- ✓ Background color applied immediately on page load
- ✓ Uses configured color from storage if available
- ✓ Falls back to default #05060a if not configured
- ✓ Applied before any redirect logic

## Code Review: URL Validation

### URL Validation Function

```javascript
function validateURL(urlString) {
  if (!urlString || typeof urlString !== "string" || urlString.trim() === "") {
    return false;
  }

  const trimmedUrl = urlString.trim();

  try {
    const url = new URL(trimmedUrl);
    return true;
  } catch (e) {
    if (trimmedUrl.startsWith("/") || trimmedUrl.startsWith("./")) {
      return true;
    }
    return false;
  }
}
```

**Verification:**

- ✓ Supports http/https schemes
- ✓ Supports chrome:// scheme
- ✓ Supports file:// scheme
- ✓ Supports data: scheme
- ✓ Supports relative URLs (/, ./)
- ✓ Validates before redirect attempt

## Code Review: Redirect Delay Implementation

### Redirect Delay Logic

```javascript
function redirectToURL(url, delay) {
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
```

**Verification:**

- ✓ Uses setTimeout for delay implementation
- ✓ Handles delay = 0 as immediate redirect
- ✓ Respects configured delay value
- ✓ Logs redirect timing for debugging

## Code Review: Error Handling

### Missing/Invalid URL Handling

```javascript
const url = result.url;
if (!url || !validateURL(url)) {
  showError(
    "No valid URL configured. Please set a URL in the extension options."
  );
  console.error("[NewTab] No valid URL found in settings");
  return;
}
```

**Verification:**

- ✓ Checks for missing URL
- ✓ Validates URL format before redirect
- ✓ Shows error message instead of redirecting
- ✓ Hides loading text when error shown
- ✓ Provides helpful error message to user

## CLI Output: Verification

### Hardcoded URL Removal Verification

```bash
$ grep -c "DASHBOARD_URL" newtab.js
0
```

**Result**: No hardcoded DASHBOARD_URL constant found ✓

### Storage API Usage Verification

```bash
$ grep -c "chrome.storage.local" newtab.js
1
```

**Functions using chrome.storage.local:**

1. `loadAndApplySettings()` - Loads all settings from storage

## Test: Console Logging

### Console Log Output Structure

The newtab.js includes comprehensive console logging:

- `[NewTab] Page initialized` - On DOMContentLoaded
- `[NewTab] Loading settings from storage...` - Before storage read
- `[NewTab] Settings loaded: {url, redirectDelay, backgroundColor}` - After successful load
- `[NewTab] Applied background color: [color]` - When color applied
- `[NewTab] Using default background color: #05060a` - When using default
- `[NewTab] Redirect delay: [ms] ms` - Delay value
- `[NewTab] Redirecting to: [url] after [ms] ms delay` - Before redirect
- `[NewTab] Executing redirect to: [url]` - When redirect executes
- `[NewTab] Error loading settings: [error]` - Storage errors
- `[NewTab] Invalid URL: [url]` - Invalid URL errors
- `[NewTab] No valid URL found in settings` - Missing URL errors

**Verification:**

- ✓ All logs prefixed with [NewTab] for easy filtering
- ✓ Logs show settings loading process
- ✓ Logs show background color application
- ✓ Logs show redirect timing
- ✓ Error logs use console.error

## Verification Summary

All proof artifacts demonstrate:

1. **Dynamic Configuration Loading**: Reads URL, redirectDelay, and backgroundColor from chrome.storage.local
2. **Immediate Background Display**: Applies background color immediately on page load
3. **URL Validation**: Validates stored URL before redirect attempt
4. **Redirect Delay**: Implements delay using setTimeout (0 = immediate)
5. **Error Handling**: Shows error message for missing/invalid URL instead of redirecting
6. **Error Message Display**: Error container added to HTML and styled
7. **Hardcoded URL Removed**: No DASHBOARD_URL constant present
8. **Loading Text Updated**: Changed to generic "Loading…"
9. **Console Logging**: Comprehensive logging with [NewTab] prefix

## Files Modified

- `newtab.js` - Complete rewrite to use dynamic configuration
- `newtab.html` - Added error message container, updated loading text
- `newtab.css` - Added error message styling

## Manual Testing Notes

**Note:** Manual testing screenshots will be provided by the user to demonstrate:

- New tab opens showing dark background with configured color immediately
- Redirect occurs after configured delay
- Error message displays when URL is missing or invalid
- Various URL formats (http, https, chrome://, file://) work correctly
