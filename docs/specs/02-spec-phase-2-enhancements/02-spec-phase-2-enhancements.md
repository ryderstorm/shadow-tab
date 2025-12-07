# 02-spec-phase-2-enhancements.md

## Introduction/Overview

This specification defines Phase 2 enhancements for the Dark New Tab Homepage Chrome extension, focusing on user experience improvements, visual polish, and quality-of-life features. These enhancements build upon the foundation established in Phase 1, adding sophisticated URL validation with domain resolution, improved visual feedback through animations and color customization, accessibility improvements, and better error handling. The goal is to create a polished, professional extension that provides a delightful user experience while maintaining simplicity and ease of use.

## Goals

- Enhance URL validation to require valid domain format and provide real-time domain resolution feedback
- Improve visual feedback with loading animations and smooth color transitions
- Provide intuitive color customization with native color picker and preset theme options
- Implement comprehensive accessibility features for keyboard navigation and screen readers
- Add graceful error handling with helpful examples and validation feedback
- Display version information for transparency and debugging
- Create minimal documentation to help users get started

## User Stories

- **As a user**, I want stricter URL validation so that I can catch invalid URLs before they cause issues
- **As a user**, I want to see real-time feedback when entering URLs so that I know if my domain is valid
- **As a user**, I want a visual loading indicator instead of static text so that I know the extension is working
- **As a user**, I want to easily customize my background color using a color picker so that I can match my preferences
- **As a user**, I want preset color themes so that I can quickly select a professional dark color without manual entry
- **As a user**, I want to see a live preview of my color choice so that I can see how it looks before saving
- **As a user**, I want smooth color transitions so that color changes feel polished and professional
- **As a user**, I want the options page to match my configured background color so that I have a consistent experience
- **As a user**, I want keyboard navigation to work properly so that I can use the extension without a mouse
- **As a user**, I want clear error messages with examples so that I can fix configuration issues quickly
- **As a user**, I want to see version information so that I know what version I'm running
- **As a user**, I want warnings for invalid settings but still be able to use the extension so that I'm not blocked by configuration errors

## Demoable Units of Work

### [Unit 1]: Enhanced URL Validation with Domain Resolution

**Purpose:** Provide robust URL validation that requires valid domain format and attempts to resolve domains, giving users real-time feedback as they type.

**Functional Requirements:**

- The system shall validate URLs to require a valid domain format (must contain at least one dot and match TLD pattern)
- The system shall attempt to resolve domains via fetch() with 10 second timeout after user stops typing for 1 second (debounced)
- The system shall display a spinner indicator while attempting domain resolution
- The system shall display subtle visual feedback indicating domain resolution status (valid/invalid/resolving)
- The system shall reject incomplete URLs like "<https://wut>" that don't have valid domain structure
- The system shall support all standard URL schemes (http, https, chrome://, file://, data:, etc.) while enforcing domain validation for web URLs
- The system shall show error messages with examples of valid URL formats when validation fails

**Proof Artifacts:**

- Screenshot: Options page showing spinner during domain resolution demonstrates real-time validation feedback
- Screenshot: Options page showing subtle domain resolution indicator (valid/invalid) demonstrates resolution status feedback
- Test: Entering "<https://wut>" shows validation error with example formats demonstrates domain format requirement
- Test: Entering "<https://example.com>" shows spinner then successful resolution indicator demonstrates domain resolution working
- Test: Entering URL and waiting 1 second triggers resolution attempt with spinner demonstrates debounced resolution
- Test: Domain resolution times out after 10 seconds if domain is unreachable demonstrates timeout handling

### [Unit 2]: Loading Animation and Visual Feedback

**Purpose:** Replace static loading text with an animated pulsing dot indicator to provide better visual feedback during redirect delays.

**Functional Requirements:**

- The system shall display a pulsing dot animation (CSS-only) instead of static "Loading…" text on the new tab page
- The system shall show the loading animation when redirect delay is greater than 0 milliseconds
- The system shall hide the loading animation immediately when redirect delay is 0 (immediate redirect)
- The animation shall use CSS animations (no JavaScript) for performance
- The animation shall maintain the dark theme aesthetic with appropriate colors

**Proof Artifacts:**

- Screenshot: New tab page showing pulsing dot animation demonstrates loading indicator working
- Test: Setting redirect delay to 1000ms shows animation for 1 second demonstrates timing behavior
- Test: Setting redirect delay to 0ms shows no animation demonstrates immediate redirect behavior
- Code Review: CSS animation implementation demonstrates CSS-only approach

### [Unit 3]: Color Customization with Picker and Presets

**Purpose:** Provide intuitive color customization through native color picker and preset theme buttons, with live preview on the options page.

**Functional Requirements:**

- The system shall provide a native HTML5 color input (`<input type="color">`) for background color selection
- The system shall display 10 preset color theme buttons with classic dark colors (midnight blue, charcoal, deep purple, etc.)
- The system shall update the color input value when a preset button is clicked
- The system shall update the options page background color in real-time as the user types or picks colors
- The system shall maintain the text input field for manual color entry alongside the color picker
- The system shall apply smooth CSS transitions (200-300ms) when background color changes
- The system shall sync the options page background color with the configured new tab background color

**Proof Artifacts:**

- Screenshot: Options page showing color picker and 10 preset buttons demonstrates color customization interface
- Test: Clicking preset button updates color input and options page background demonstrates preset functionality
- Test: Changing color picker updates options page background in real-time demonstrates live preview
- Test: New tab page uses same background color as options page demonstrates color sync
- Screenshot: Smooth color transition visible when changing colors demonstrates CSS transition working

### [Unit 4]: Accessibility Improvements

**Purpose:** Ensure the extension is fully accessible via keyboard navigation and screen readers, meeting modern accessibility standards.

**Functional Requirements:**

- The system shall include ARIA labels for all form inputs, buttons, and interactive elements
- The system shall support keyboard navigation with logical Tab order through all form elements
- The system shall allow form submission via Enter key when focus is on submit button or within form
- The system shall display visible focus indicators for keyboard users (outline or highlight)
- The system shall ensure all error messages are properly associated with their input fields via ARIA attributes
- The system shall maintain keyboard accessibility on both new tab page and options page

**Proof Artifacts:**

- Test: Tab navigation moves through all form elements in logical order demonstrates keyboard navigation
- Test: Enter key submits form when focus is on submit button demonstrates keyboard submission
- Test: Focus indicators visible when tabbing through elements demonstrates focus visibility
- Code Review: ARIA labels present on all inputs and buttons demonstrates accessibility markup
- Test: Screen reader announces form labels and error messages demonstrates screen reader support

### [Unit 5]: Version Display and Settings Validation

**Purpose:** Display version information for transparency and provide graceful handling of invalid settings on page load.

**Functional Requirements:**

- The system shall display extension version from manifest.json in the options page footer
- The system shall display the most recent git commit hash in the options page footer
- The system shall format version display as plain text (e.g., "Version: 1.0.0 (abc1234)")
- The system shall validate all stored settings when the options page loads
- The system shall show warning messages for invalid stored settings but allow user to continue with defaults
- The system shall not block user interaction when invalid settings are detected

**Proof Artifacts:**

- Screenshot: Options page footer showing version and commit hash demonstrates version display
- Test: Loading options page with invalid stored URL shows warning but allows form interaction demonstrates graceful validation
- Test: Version display matches manifest.json version demonstrates correct version reading
- Code Review: Settings validation logic shows warning but doesn't prevent usage demonstrates graceful handling

### [Unit 6]: Enhanced Error Handling and README

**Purpose:** Provide helpful error messages with format examples and create minimal documentation for users.

**Functional Requirements:**

- The system shall display error messages with examples of valid formats when validation fails
- The system shall show specific, actionable error messages for each validation failure type
- The system shall maintain existing error message styling and positioning
- The system shall include a README.md file with installation steps and basic feature outline
- The README.md shall provide clear instructions for loading the extension in developer mode
- The README.md shall list key features and configuration options

**Proof Artifacts:**

- Screenshot: Invalid URL error message showing example formats demonstrates helpful error messages
- Test: Entering invalid color shows error with example color formats demonstrates format examples
- File Review: README.md exists with installation steps and feature outline demonstrates documentation
- Test: Error messages appear in appropriate locations and don't overlap content demonstrates proper error display

## Non-Goals (Out of Scope)

1. **Disable redirect toggle**: This feature was considered but excluded from Phase 2
2. **Test URL button**: Not needed due to automatic domain resolution feature providing real-time feedback
3. **Custom color picker component**: Using native HTML5 color input instead of custom implementation
4. **Multiple URL profiles**: Users cannot configure multiple URLs or switch between different destinations
5. **Settings import/export**: No functionality to export or import configuration as JSON
6. **Reset to defaults button**: No quick reset functionality (users can manually clear and reconfigure)
7. **Debug mode toggle**: No verbose logging toggle feature
8. **Cross-device synchronization**: Settings remain local only (chrome.storage.local)

## Design Considerations

**Color Picker and Presets:**

- Native HTML5 color input should be styled to match the dark theme
- Preset color buttons should be arranged in a visually appealing grid or row layout
- Preset buttons should display the color as their background with appropriate contrast for text/labels
- Preset colors should include 10 classic dark themes (see Open Questions section for final list to confirm)
- Color picker and text input should be positioned logically near each other

**Loading Animation:**

- Pulsing dot animation should be subtle and not distracting
- Animation should use 2-3 dots that fade in and out sequentially
- Animation colors should match the dark theme (light gray/white dots on dark background)
- Animation should be smooth and professional, not jarring

**Live Preview:**

- Options page background should update smoothly when color changes
- Text contrast should remain readable when background color changes
- Preview should feel responsive without lag

**Domain Resolution Spinner:**

- Spinner should be small and unobtrusive, positioned near the URL input field
- Spinner should use CSS animation for smooth rotation
- Spinner should be visible only during active resolution attempts
- Spinner color should match the dark theme (light gray/white)

**Accessibility:**

- Focus indicators should be clearly visible but not overly prominent
- Focus indicators should use a color that contrasts well with the dark background (e.g., blue outline)
- ARIA labels should be descriptive and helpful for screen reader users

## Repository Standards

Follow established repository patterns and conventions:

- Use Manifest V3 structure and best practices
- Maintain consistent code style and formatting
- Use external JavaScript files (no inline scripts)
- Follow Chrome Extension security guidelines
- Use semantic HTML structure
- Apply consistent CSS naming conventions
- Use CSS animations instead of JavaScript for performance
- Follow existing error handling patterns from Phase 1

## Technical Considerations

**URL Validation and Domain Resolution:**

- Domain validation should use regex pattern matching for TLD validation
- Domain resolution should use `fetch()` with 10 second timeout to attempt connection
- A spinner indicator should be displayed while domain resolution is in progress
- Debouncing should be implemented using setTimeout/clearTimeout pattern (1 second delay after typing stops)
- Domain resolution feedback should be subtle (e.g., small icon or color change, not intrusive message)

**Color Picker:**

- Native `<input type="color">` may have browser-specific styling; ensure it matches dark theme
- Color input value should sync with text input field bidirectionally
- Preset colors should be stored as constants in JavaScript

**CSS Transitions:**

- Use CSS `transition` property on `background-color` for smooth color changes
- Transition duration should be 200-300ms for optimal feel
- Ensure transitions don't cause performance issues

**Version Display:**

- Git commit hash should be hardcoded into the options.js file during development (manual update on each commit)
- Eventually, this will be replaced with a build-time script to automate the process
- Version display should show both manifest.json version and git commit hash (e.g., "Version: 1.0.0 (abc1234)")
- Version display should be unobtrusive in footer

**Settings Validation:**

- Validation should run on `DOMContentLoaded` event
- Invalid settings should trigger warning messages but not prevent page functionality
- Default values should be applied when invalid settings are detected

## Security Considerations

**Domain Resolution:**

- Domain resolution attempts should not expose sensitive information
- Failed resolution attempts should not leak user's intended destinations
- Consider rate limiting for resolution attempts to prevent abuse

**Color Input:**

- Native color picker is secure and doesn't require special security considerations
- Ensure color values are validated before applying to prevent CSS injection

**Version Display:**

- Git commit hash display is informational only and doesn't pose security risks
- Version information is already public in manifest.json

## Success Metrics

1. **URL Validation Accuracy**: Invalid URLs like "<https://wut>" are rejected with helpful error messages
2. **User Experience**: Loading animation provides clear visual feedback during redirect delays
3. **Color Customization**: Users can easily select colors via picker or presets with live preview
4. **Accessibility Compliance**: Extension is fully navigable via keyboard and screen reader compatible
5. **Error Clarity**: Error messages include format examples, reducing user confusion
6. **Documentation**: README.md provides sufficient information for users to install and use the extension

## Open Questions

**RESOLVED:**

1. **Domain Resolution Implementation**: ✅ Use `fetch()` with 10 second timeout, display spinner while resolving
2. **Preset Color Selection**: ✅ See proposed list below for confirmation
3. **Git Commit Hash Retrieval**: ✅ Hardcode into options.js file manually during development; replace with build-time script later

**Preset Color Selection - Proposed List (10 colors):**

Please confirm the following 10 classic dark colors for preset theme buttons:

1. **Midnight Blue** - `#191970` - Classic deep blue, professional and calming
2. **Charcoal** - `#36454F` - Neutral dark gray with slight blue tint
3. **Deep Purple** - `#2D1B3D` - Rich, luxurious dark purple
4. **Obsidian** - `#0B0B0B` - Nearly black, pure and minimal
5. **Dark Navy** - `#000080` - Classic navy blue, timeless
6. **Dark Slate** - `#2F4F4F` - Dark gray-green, sophisticated
7. **Rich Black** - `#05060a` - Current default, very dark with slight blue
8. **Midnight** - `#000e34` - Deep blue-black, darker than midnight blue
9. **Dark Slate Gray** - `#2D2D2D` - Neutral dark gray, versatile
10. **Deep Indigo** - `#4B0082` - Dark purple-blue, vibrant yet dark

**Alternative options if any need replacement:**

- Dark Green: `#013220`
- Dark Brown: `#3C241D`
- Dark Gray: `#1C1C1C`
- Dark Purple (alternative): `#341539`

Please review and confirm or suggest replacements for the preset color list.
