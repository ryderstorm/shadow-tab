# Shadow Tab

Transform your new tab into a sleek, customizable dark workspace with Shadow Tab's modern design and powerful redirect capabilities.

## Installation

### Loading the Extension in Chrome Developer Mode

1. **Download or clone this repository** to your local machine

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/` in your Chrome browser
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner of the Extensions page

4. **Load the extension**:
   - Click the "Load unpacked" button
   - Select the directory containing this extension (the folder with `manifest.json`)
   - The extension should now appear in your extensions list

5. **Verify installation**:
   - Open a new tab to see the dark homepage
   - Right-click the extension icon and select "Options" to configure settings

## Features

### Core Functionality

- **Customizable New Tab URL**: Set any URL to redirect to when opening a new tab
- **Redirect Delay**: Configure delay (0-60000ms) before redirect, with optional loading animation
- **Dark Theme**: Beautiful Shadow Tab color palette (#090909 Shadow Black background, #e5e5e5 text) with True Cobalt and Royal Azure accents

### Enhanced Features

- **Enhanced URL Validation**: Domain format validation with real-time domain resolution feedback
- **Loading Animation**: Smooth pulsing dot animation during redirect delays
- **Color Customization**:
  - Native HTML5 color picker for background color selection
  - 10 preset colors featuring Shadow Tab palette (Shadow Black, Shadow Grey, True Cobalt, Royal Azure, and more)
  - Live preview on options page
  - Smooth color transitions
- **Accessibility**: Full keyboard navigation and screen reader support with ARIA labels
- **Version Display**: Shows extension version and git commit hash in options page footer
- **Settings Validation**: Graceful handling of invalid stored settings with helpful warnings

## Configuration Options

### New Tab URL

Set the destination URL for new tabs. Supports:

- Web URLs (http/https) with domain validation
- Chrome internal URLs (chrome://)
- File URLs (file://)
- Data URLs (data:)
- Other standard URL schemes

**Example**: `https://example.com`

### Redirect Delay

Configure the delay in milliseconds before redirecting to the configured URL.

- **0ms**: Immediate redirect (no loading animation)
- **1000ms**: 1 second delay with loading animation
- **Maximum**: 60000ms (60 seconds)

### Background Color

Customize the background color of both the new tab page and options page.

**Supported formats**:

- Hex: `#090909`
- RGB: `rgb(9,9,9)`
- RGBA: `rgba(9,9,9,1)`
- HSL: `hsl(0, 0%, 4%)`
- Named colors: `black`, `darkblue`, etc.

**Preset Colors Available**:

- Light Grey (#666666)
- Charcoal (#333333)
- Royal Azure (#1d4ed8)
- True Cobalt (#002078)
- Dark Navy (#000080)
- Midnight Blue (#191970)
- Shadow Grey (#222227)
- Dark Slate (#1a1a1a) - Default
- Shadow Black (#090909)
- Deep Black (#000000)

## Usage

1. **Configure Settings**:
   - Right-click the extension icon → Options
   - Or navigate to `chrome://extensions/` → Find "Shadow Tab" → Click "Options"

2. **Set Your URL**:
   - Enter your desired new tab URL
   - The extension validates the URL format and attempts domain resolution

3. **Customize Appearance**:
   - Adjust redirect delay if desired
   - Choose background color using color picker or preset buttons
   - See live preview on the options page

4. **Save Settings**:
   - Click "Save" button
   - Settings are stored locally and persist across browser sessions

5. **Open New Tab**:
   - Press `Ctrl+T` (or `Cmd+T` on Mac) to open a new tab
   - The extension redirects to your configured URL after the specified delay

## Technical Details

- **Manifest Version**: 3
- **Storage**: Uses `chrome.storage.local` API for settings persistence
- **Security**: Complies with Manifest V3 Content Security Policy (no inline scripts)
- **Accessibility**: WCAG-compliant with ARIA labels and keyboard navigation support

## Development

### Project Structure

```text
dark-homepage-newtab/
├── manifest.json          # Extension manifest
├── newtab.html            # New tab page HTML
├── newtab.js              # New tab page JavaScript
├── newtab.css             # New tab page styles
├── options.html           # Options page HTML
├── options.js             # Options page JavaScript
├── options.css            # Options page styles
├── tests/                 # Playwright test suite
└── README.md              # This file
```

### Code Style

- External JavaScript files (no inline scripts)
- Consistent code formatting
- Dark theme aesthetic maintained throughout
- System fonts for consistency

### Testing

The project includes a comprehensive Playwright test suite. See [docs/testing.md](docs/testing.md) for detailed information on:

- Running tests
- Writing new tests
- Test fixtures and Page Object Model patterns
- Best practices and troubleshooting

## License

This project is open source and available for personal use.

## Version

Current version information is displayed in the options page footer.
