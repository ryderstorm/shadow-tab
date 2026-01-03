# 05 Spec - Shadow Tab Rebrand

## Overview

Transform the "Dark New Tab Homepage" Chrome extension into "Shadow Tab" with a complete visual rebranding featuring a new color palette, custom icons, and updated marketing messaging while maintaining all existing functionality and technical performance characteristics.

## User Stories

### Primary User Story

As a user of dark-mode dashboards and self-hosted tools, I want a sleek, professionally-branded new tab extension that eliminates the white flash (FOUC) and provides a seamless visual experience that matches my dark workflow environment.

### Secondary User Stories

- As a Chrome Web Store visitor, I want to quickly understand the extension's value proposition through compelling marketing copy that emphasizes eye comfort and performance
- As a developer/power user, I want the extension to maintain its technical excellence (zero FOUC, lightweight, privacy-focused) while having an improved visual presentation
- As an existing user, I want the rebrand to be seamless with all my settings and functionality preserved

## Functional Requirements

### FR-1: Color Palette Implementation

- Replace all existing colors in the extension with the new Shadow Tab palette:
  - Black: `#090909ff` (primary backgrounds)
  - Shadow Grey: `#222227ff` (secondary backgrounds/accents)
  - True Cobalt: `#002078ff` (interactive elements)
  - Royal Azure: `#1d4ed8ff` (hover states/highlights)
- Apply colors consistently across new tab page, options page, and any UI elements
- **Implement CSS variables** in `newtab.css` with color name comments for maintainability
- Maintain existing color roles but substitute with new palette values
- **Update default color presets** in options page to use new palette colors

### FR-2: Icon Integration

- Replace extension icon in manifest.json with new Shadow Tab icon
- Add favicon for options page using the new icon design
- Update any UI icons in options/new tab pages with new branding
- Include all required icon sizes (16x16, 32x32, 48x48, 128x128, etc.)
- **Organize asset structure** following Chrome extension best practices:
  - Move `icon.svg` to root directory for manifest reference
  - Organize PNG exports in `assets/icons/` directory
  - Include `palette.png` in documentation for visual reference

### FR-3: Text Content Updates

- Update all user-facing text from "Dark New Tab Homepage" to "Shadow Tab"
- Update manifest.json name and description
- Update README.md, documentation, and code comments
- Ensure no old branding references remain in user-facing elements

### FR-4: Marketing Content Integration

- Update Chrome Web Store description with marketing-optimized copy
- Implement new tagline: "Zero-flash, stealth-mode redirects for your dark-mode dashboard"
- Include key value propositions: eye comfort, performance, privacy-first

## Technical Considerations

### Color Implementation Strategy

- Map new colors to existing CSS variables and inline styles
- **Implement CSS custom properties** in `newtab.css`:

  ```css
  :root {
    --black: #090909ff; /* Black - Primary background color */
    --shadow-grey: #222227ff; /* Shadow Grey - Secondary background color */
    --true-cobalt: #002078ff; /* True Cobalt - Interactive elements */
    --royal-azure: #1d4ed8ff; /* Royal Azure - Hover states and highlights */
    --shadow-text: #e5e5e5; /* Text color (maintained for readability) */
  }
  ```

- Ensure contrast ratios meet WCAG accessibility standards
- Test color appearance across different Chrome themes and display settings
- Preserve the FOUC elimination technique while updating visual appearance
- **Update options page presets** to use new palette colors as defaults

### Asset Organization

- **Root directory**: `icon.svg` for manifest reference
- **Assets directory**: `assets/icons/` containing all PNG exports
- **Documentation**: Include `palette.png` in spec documentation for visual reference
- **Favicon**: Add `favicon.ico` in root for options page
- Ensure all icon paths are correctly referenced in manifest.json
- Optimize file sizes for Chrome Web Store requirements

### Content Security Policy Compliance

- Ensure all branding changes comply with Manifest V3 CSP requirements
- No inline styles or scripts introduced during rebrand
- Maintain existing security posture while updating visual elements

## Demoable Units

### DU-1: New Tab Page Rebrand

- Complete visual transformation of the new tab experience
- Loading animation uses new color palette
- Smooth transition from dark background to target URL
- No white flash or visual artifacts

### DU-2: Options Page Rebrand

- Fully redesigned options interface with Shadow Tab branding
- All interactive elements use new color scheme
- Favicon displays correctly in browser tab
- Settings functionality remains identical

### DU-3: Extension Icon and Branding

- New Shadow Tab icon visible in Chrome toolbar
- Icon integrates well with Chrome's UI themes
- Extension details show updated name and description
- Professional appearance in Chrome Web Store listing

## Proof Artifacts

### PA-1: New Tab Page Screenshot

- **Purpose**: Demonstrate complete color palette implementation and loading animation
- **Content**: Shows new tab page with Shadow Tab colors, loading animation, and smooth redirect
- **Validation**: All colors match specified palette, no old branding visible

### PA-2: Options Page Screenshot

- **Purpose**: Show rebranded settings interface with new colors and favicon
- **Content**: Complete options page displaying Shadow Tab branding throughout
- **Validation**: All UI elements use new colors, text updated to "Shadow Tab"

### PA-3: Extension Icon Screenshot

- **Purpose**: Display new icon in Chrome toolbar context
- **Content**: Extension icon visible in browser toolbar with proper sizing
- **Validation**: Icon matches provided design, renders cleanly at different sizes

### PA-4: Before/After Comparison

- **Purpose**: Highlight transformation from old to new branding
- **Content**: Side-by-side comparison of original vs rebranded interface
- **Validation**: Clear visual improvement while maintaining functionality

## Success Criteria

### Visual Consistency

- [ ] All UI elements use new Shadow Tab color palette consistently
- [ ] No old branding colors or references remain in user-facing elements
- [ ] Icons integrate seamlessly with Chrome's interface design

### Functional Preservation

- [ ] All existing features work exactly as before rebrand
- [ ] Settings and user preferences are preserved during update
- [ ] FOUC elimination performance remains uncompromised

### Documentation Completeness

- [ ] README.md reflects new Shadow Tab branding and messaging
- [ ] All documentation files updated with new name and descriptions
- [ ] Code comments and internal references updated appropriately

### Store Readiness

- [ ] Chrome Web Store description incorporates marketing messaging
- [ ] All required assets (icons, screenshots) prepared for store listing
- [ ] Extension meets all Chrome Web Store guidelines and requirements

## Implementation Notes

### Color Mapping Reference

```css
/* New Shadow Tab Color Mappings with CSS Variables */
:root {
  --black: #090909ff; /* Black - Primary background - was #05060a */
  --shadow-grey: #222227ff; /* Shadow Grey - Secondary background - was #1a1a1a */
  --true-cobalt: #002078ff; /* True Cobalt - Accent color - was #007acc */
  --royal-azure: #1d4ed8ff; /* Royal Azure - Hover color - was #005a9e */
  --shadow-text: #e5e5e5; /* Text color - maintained for readability */
}

/* Implementation example */
body {
  background: var(--black); /* very dark, no flash */
  color: var(--shadow-text);
}

.pulsing-dot {
  background-color: var(--true-cobalt);
}

.pulsing-dot:hover {
  background-color: var(--royal-azure);
}
```

### Marketing Copy Integration

- **Short Description**: "Stop the blinding white flash. Shadow Tab provides instant, zero-FOUC redirects to your favorite dark-mode dashboard."
- **Long Description**: Use full marketing content from planning document emphasizing eye comfort, performance, and self-hosted dashboard compatibility

### File Update Checklist

- [ ] `manifest.json` - name, description, icons
- [ ] `newtab.html` - title, meta descriptions
- [ ] `newtab.css` - **implement CSS variables** with color comments, update all color values
- [ ] `options.html` - title, interface text
- [ ] `options.css` - all color values and styles
- [ ] `options.js` - **update default color presets** to use new palette
- [ ] `README.md` - complete content rewrite with Shadow Tab messaging
- [ ] `CONTRIBUTING.md` - update project name references
- [ ] Documentation files - update all branding references
- [ ] **Asset organization**:
  - [ ] Move `icon.svg` to root directory
  - [ ] Create `assets/icons/` and organize PNG exports
  - [ ] Add `favicon.ico` for options page
  - [ ] Include `palette.png` in documentation

## Dependencies

### Required Assets

- Shadow Tab SVG icon (provided) - **move to root directory**
- PNG icon exports in all required sizes (provided) - **organize in assets/icons/**
- Marketing copy and messaging (provided)
- **Color palette reference image** (`palette.png`) - **include in documentation**

### Technical Dependencies

- Existing CSS architecture and styling approach
- Current FOUC elimination implementation
- Manifest V3 compliance requirements
- Chrome Extension APIs currently in use

## Risk Mitigation

### Visual Consistency Risks

- **Risk**: Inconsistent color application across different elements
- **Mitigation**: Systematic replacement of all color values using CSS variables where possible

### Functionality Preservation Risks

- **Risk**: Accidental changes to core functionality during rebrand
- **Mitigation**: Comprehensive testing of all features before and after visual changes

### Accessibility Risks

- **Risk**: New color palette fails contrast requirements
- **Mitigation**: Verify all color combinations meet WCAG AA standards before implementation

## Acceptance Testing

### Visual Regression Tests

- Verify all pages render correctly with new color scheme
- Test icon display across different Chrome themes
- Validate text readability with new color combinations

### Functional Tests

- Confirm all settings save and load correctly
- Test redirect functionality with various URLs
- Verify loading animation displays properly
