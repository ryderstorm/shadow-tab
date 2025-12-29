# Task 2.0 Proof Artifacts: Create Options Page with URL Configuration and Validation

## Code Review: Options Page Structure

### options.html Complete File

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Dark New Tab Homepage - Options</title>

    <!-- Hint Chrome that this is dark UI -->
    <meta name="color-scheme" content="dark" />

    <link rel="stylesheet" href="options.css" />
  </head>
  <body>
    <div class="container">
      <h1>Dark New Tab Homepage Settings</h1>

      <form id="options-form">
        <div class="form-group">
          <label for="url-input">New Tab URL</label>
          <input
            type="text"
            id="url-input"
            name="url"
            placeholder="https://example.com"
            autocomplete="url"
          />
          <div id="url-error" class="error-message" role="alert"></div>
        </div>

        <div class="form-group">
          <button type="submit" id="save-button">Save</button>
          <div id="save-success" class="success-message" role="status"></div>
        </div>
      </form>
    </div>

    <script src="options.js"></script>
  </body>
</html>
```

**Verification:**

- ✓ Dark theme meta tag present (`<meta name="color-scheme" content="dark" />`)
- ✓ External CSS file linked (`options.css`)
- ✓ External JavaScript file linked (`options.js`)
- ✓ URL input field with label present
- ✓ Error message container div present (`id="url-error"`)
- ✓ Save button present
- ✓ Success message container div present (`id="save-success"`)
- ✓ No inline scripts or styles (CSP compliant)

## Code Review: URL Validation Function

### URL Validation Implementation

```javascript
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
```

**Verification:**

- ✓ Supports http/https schemes (via URL constructor)
- ✓ Supports chrome:// scheme (via URL constructor)
- ✓ Supports file:// scheme (via URL constructor)
- ✓ Supports data: scheme (via URL constructor)
- ✓ Supports relative URLs (/, ./)
- ✓ Handles empty/invalid input gracefully

## Code Review: Storage Functions

### Save URL Function

```javascript
async function saveURL(url) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ url: url.trim() }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}
```

**Verification:**

- ✓ Uses `chrome.storage.local.set()` API
- ✓ Includes error handling for `chrome.runtime.lastError`
- ✓ Returns Promise for async/await support
- ✓ Trims URL before saving

### Load URL Function

```javascript
function loadURL() {
  chrome.storage.local.get(["url"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error loading URL:", chrome.runtime.lastError);
      return;
    }

    const urlInput = document.getElementById("url-input");
    if (urlInput && result.url) {
      urlInput.value = result.url;
      // Validate loaded URL
      if (!validateURL(result.url)) {
        showURLError("Stored URL is invalid. Please update it.");
      }
    }
  });
}
```

**Verification:**

- ✓ Uses `chrome.storage.local.get()` API
- ✓ Includes error handling
- ✓ Populates input field on page load
- ✓ Validates loaded URL and shows error if invalid

## Code Review: Real-Time Validation

### Real-Time Validation Implementation

```javascript
function handleURLInput() {
  const urlInput = document.getElementById("url-input");
  const urlValue = urlInput.value.trim();

  if (urlValue === "") {
    hideURLError();
    return;
  }

  if (!validateURL(urlValue)) {
    showURLError("Please enter a valid URL (e.g., https://example.com)");
  } else {
    hideURLError();
  }
}

// Set up real-time validation on URL input
const urlInput = document.getElementById("url-input");
if (urlInput) {
  urlInput.addEventListener("input", handleURLInput);
  urlInput.addEventListener("blur", handleURLInput);
}
```

**Verification:**

- ✓ Real-time validation on `input` event
- ✓ Validation on `blur` event
- ✓ Shows error message for invalid URLs
- ✓ Hides error message for valid URLs
- ✓ Clears error when input is empty

## Code Review: Save Button Handler

### Form Submission Handler

```javascript
async function handleFormSubmit(event) {
  event.preventDefault();
  hideSuccess();
  hideURLError();

  const urlInput = document.getElementById("url-input");
  const urlValue = urlInput.value.trim();

  // Validate URL before saving
  if (!validateURL(urlValue)) {
    showURLError("Please enter a valid URL (e.g., https://example.com)");
    return;
  }

  try {
    await saveURL(urlValue);
    showSuccess("Settings saved successfully!");
  } catch (error) {
    console.error("Error saving URL:", error);
    showURLError("Failed to save settings. Please try again.");
  }
}
```

**Verification:**

- ✓ Prevents default form submission
- ✓ Validates URL before saving
- ✓ Shows error if URL is invalid
- ✓ Saves to chrome.storage.local on success
- ✓ Shows success message on save
- ✓ Shows error message on save failure

## Code Review: Success Feedback

### Success Message Implementation

```javascript
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
```

**Verification:**

- ✓ Displays success message when URL is saved
- ✓ Auto-hides after 3 seconds
- ✓ Uses CSS class for visibility control

## CLI Output: File Verification

```bash
$ test -f options.html && test -f options.css && test -f options.js && echo "✓ All options page files exist"
✓ All options page files exist
```

## Code Review: Dark Theme Styling

### options.css Key Styles

```css
:root {
  color-scheme: dark;
}
html,
body {
  background: #05060a; /* very dark, no flash */
  color: #e5e5e5;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}
```

**Verification:**

- ✓ Dark background color (#05060a) matches newtab.html
- ✓ Light text color (#e5e5e5) matches newtab.html
- ✓ System fonts match newtab.html
- ✓ Consistent dark theme aesthetic

## Test: Storage Persistence

### Storage API Usage Verification

```bash
$ grep -c "chrome.storage.local" options.js
4
```

**Functions using chrome.storage.local:**

1. `saveURL()` - Saves URL to storage
2. `loadURL()` - Loads URL from storage
3. Error handling present in both functions

## Verification Summary

All proof artifacts demonstrate:

1. **Options Page Structure**: Complete HTML with form, input field, error container, and success message
2. **URL Validation**: Function supports http/https/chrome:///file:///data: schemes and relative URLs
3. **Real-Time Validation**: Input field validates on input and blur events with error messages
4. **Storage Integration**: Save and load functions use chrome.storage.local with error handling
5. **User Feedback**: Success and error messages display appropriately
6. **Dark Theme**: Styling matches newtab.html aesthetic
7. **CSP Compliance**: No inline scripts or styles

## Files Created

- `options.html` - Options page HTML structure
- `options.css` - Options page styling with dark theme
- `options.js` - Options page JavaScript with validation and storage

## Screenshots

### Screenshot 1: Options Page with Valid URL Configuration

![Options page displaying URL input field with dark theme styling](screenshots/01-task-02-options-page-valid-url.png)

**Description:** The options page displays the "Dark New Tab Homepage Settings" interface with dark theme styling. The URL input field contains a valid URL (`https://homepage.stormhold.net`) that was loaded from chrome.storage.local. The page demonstrates:

- Dark background (#05060a) with light text (#e5e5e5)
- URL input field with label "New Tab URL"
- Save button present and functional
- Settings loaded from storage on page load

**Verification:**

- ✓ Options page displays URL input field with dark theme styling
- ✓ Settings persist and load correctly from chrome.storage.local

### Screenshot 2: Real-Time Validation - Incomplete URL Error

![Options page showing error message for incomplete URL](screenshots/01-task-02-options-page-incomplete-url-error.png)

**Description:** The options page demonstrates real-time URL validation. When the user enters an incomplete URL (`https://`), the validation function immediately detects the invalid format and displays a red error message below the input field: "Please enter a valid URL (e.g., https://example.com)".

**Verification:**

- ✓ Real-time validation triggers on input
- ✓ Error message displays below input field
- ✓ Error message uses red color (#e53e3e) for visibility
- ✓ Validation provides helpful example in error message

### Screenshot 3: Real-Time Validation - Invalid URL Error

![Options page showing error message for invalid URL format](screenshots/01-task-02-options-page-invalid-url-error.png)

**Description:** The options page demonstrates validation for invalid URL formats. When the user enters "file" (which is not a complete URL), the validation function detects the invalid format and displays the error message: "Please enter a valid URL (e.g., https://example.com)".

**Verification:**

- ✓ Validation correctly identifies invalid URL formats
- ✓ Error message displays for non-URL text input
- ✓ Validation works for various invalid input types
- ✓ User receives immediate feedback during input

## Manual Testing Summary

The screenshots demonstrate:

1. **Configuration Interface**: Options page displays URL input field with dark theme styling matching newtab.html aesthetic
2. **Validation Feedback**: Invalid URL entries show error messages below the input field in real-time
3. **Settings Persistence**: Valid URL (`https://homepage.stormhold.net`) loads from chrome.storage.local on page reload
4. **User Experience**: Clear visual feedback with error messages and consistent dark theme throughout
