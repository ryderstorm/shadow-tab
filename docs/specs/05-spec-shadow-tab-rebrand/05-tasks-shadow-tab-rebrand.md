# 05 Tasks - Shadow Tab Rebrand

## Overview

This task list breaks down the Shadow Tab rebrand into demoable units of work that transform the "Dark New Tab Homepage" extension into the new "Shadow Tab" branding while maintaining all existing functionality.

## Tasks

### [x] 1.0 Asset Organization and Icon Integration

#### 1.0 Proof Artifact(s)

- Screenshot: Extension icon visible in Chrome toolbar showing new Shadow Tab design
- File listing: `assets/icons/` directory structure with all PNG exports properly organized
- Manifest validation: `manifest.json` passes Chrome extension validation with new icon paths

#### 1.0 Tasks

- [x] 1.1 Create `assets/icons/` directory structure
- [x] 1.2 Move PNG icon exports from `.temp/icon-exports/` to `assets/icons/`
- [x] 1.3 Copy `icon.svg` from `.temp/` to root directory
- [x] 1.4 Update `manifest.json` to reference new icon paths
- [x] 1.5 Create `favicon.ico` from SVG for options page
- [x] 1.6 Add favicon link to `options.html`
- [x] 1.7 Copy `palette.png` to documentation for reference
- [x] 1.8 Test icon display in Chrome Developer Mode

#### 1.0 Relevant Files

- `manifest.json` - Update icon paths
- `assets/icons/` - New directory for PNG exports
- `icon.svg` - Move to root directory
- `options.html` - Add favicon link
- `favicon.ico` - Create new favicon file

### [x] 2.0 CSS Variables Implementation and Color Palette Update

#### 2.0 Proof Artifact(s)

- Screenshot: New tab page showing complete color transformation with loading animation
- CSS validation: `newtab.css` passes linting and uses CSS variables consistently
- Color contrast test: All color combinations meet WCAG AA accessibility standards

#### 2.0 Tasks

- [x] 2.1 Add CSS custom properties to `newtab.css` with Shadow Tab color variables
- [x] 2.2 Replace all hardcoded colors in `newtab.css` with CSS variables
- [x] 2.3 Update loading animation colors to use new palette
- [x] 2.4 Add color name comments for maintainability
- [x] 2.5 Test color contrast ratios meet WCAG AA standards
- [x] 2.6 Verify FOUC elimination technique still works with new colors
- [x] 2.7 Run CSS linting to ensure code quality

#### 2.0 Relevant Files

- `newtab.css` - Implement CSS variables and update all colors
- `newtab.html` - Verify styling applies correctly
- `newtab.js` - Ensure no color conflicts in JavaScript

### [x] 3.0 Options Page Rebrand and Default Color Presets

#### 3.0 Proof Artifact(s)

- Screenshot: Options page displaying full Shadow Tab branding with new color scheme
- Favicon display: Options page tab showing new Shadow Tab favicon in browser
- Functional test: All color presets work correctly and save/load settings properly

#### 3.0 Tasks

- [x] 3.1 Add CSS custom properties to `options.css` with Shadow Tab color variables
- [x] 3.2 Replace all hardcoded colors in `options.css` with CSS variables
- [x] 3.3 Update `_PRESET_COLORS` array in `options.js` with new Shadow Tab palette
- [x] 3.4 Update preset color buttons in `options.html` to use new palette
- [x] 3.5 Update default color picker value to use new palette
- [x] 3.6 Test all color presets save and load correctly
- [x] 3.7 Verify favicon displays in browser tab
- [x] 3.8 Test form functionality with new colors

#### 3.0 Relevant Files

- `options.css` - Implement CSS variables and update all colors
- `options.js` - Update preset colors array and functionality
- `options.html` - Update preset color buttons and default values
- `favicon.ico` - Reference in HTML head

### [x] 4.0 Text Content and Marketing Integration

#### 4.0 Proof Artifact(s)

- Manifest preview: Extension details showing updated "Shadow Tab" name and description
- README validation: Documentation displays complete Shadow Tab messaging and branding
- Store listing mockup: Chrome Web Store description with marketing-optimized copy

#### 4.0 Tasks

- [ ] 4.1 Update `manifest.json` name from "Dark New Tab Homepage" to "Shadow Tab"
- [ ] 4.2 Update `manifest.json` description with marketing-optimized copy
- [ ] 4.3 Update `newtab.html` title to "Shadow Tab"
- [ ] 4.4 Update `options.html` title to "Shadow Tab - Options"
- [ ] 4.5 Rewrite `README.md` with Shadow Tab branding and marketing messaging
- [ ] 4.6 Update `CONTRIBUTING.md` project name references
- [ ] 4.7 Update page headings and UI text in `options.html`
- [ ] 4.8 Update code comments to reflect new branding

#### 4.0 Relevant Files

- `manifest.json` - Update name and description
- `newtab.html` - Update page title
- `options.html` - Update page title and UI text
- `README.md` - Complete rewrite with Shadow Tab messaging
- `CONTRIBUTING.md` - Update project name references
- `newtab.js` - Update code comments if needed
- `options.js` - Update code comments if needed

### [ ] 5.0 Documentation and Asset Finalization

#### 5.0 Proof Artifact(s)

- Documentation review: All files updated with Shadow Tab branding, no old references remaining
- Before/after comparison: Side-by-side screenshots showing complete transformation
- Asset verification: All required assets (icons, palette reference) properly integrated

#### 5.0 Tasks

- [ ] 5.1 Audit all files for remaining "Dark New Tab Homepage" references
- [ ] 5.2 Create before/after comparison screenshots
- [ ] 5.3 Verify all assets are properly organized and referenced
- [ ] 5.4 Run full test suite to ensure no functionality regression
- [ ] 5.5 Validate all color contrast ratios meet accessibility standards
- [ ] 5.6 Test extension loading in Chrome Developer Mode
- [ ] 5.7 Run pre-commit hooks to ensure code quality
- [ ] 5.8 Final documentation review and cleanup

#### 5.0 Relevant Files

- All project files - Audit for old branding references
- `tests/` - Run test suite for regression testing
- Documentation files - Final review and cleanup
- Chrome extension - Final functionality testing

## Implementation Notes

### Current State Assessment

The extension currently uses:

- `manifest.json` for extension configuration
- `newtab.html` and `newtab.css` for the new tab page
- `options.html`, `options.css`, and `options.js` for the settings interface
- Direct color values in CSS files that need to be converted to variables

### Repository Standards

- Follow Conventional Commits for all changes
- Run pre-commit hooks before committing
- Maintain Manifest V3 compliance
- Preserve FOUC elimination technique
- Keep all existing functionality intact

### Success Criteria

- All visual elements use new Shadow Tab color palette
- Extension icon and branding updated throughout
- Documentation reflects new messaging
- No functionality regression
- Assets organized following Chrome extension best practices
