# System Architecture

This document describes the architecture of the Dark New Tab Homepage Chrome extension.

## Overview

Dark New Tab Homepage is a Chrome extension that replaces the default new tab page with a customizable dark-themed homepage that redirects to a user-configured URL.

```mermaid
flowchart TD
    subgraph "Chrome Extension"
        A[manifest.json] --> B[New Tab Page]
        A --> C[Options Page]
        B --> D[newtab.html/js/css]
        C --> E[options.html/js/css]
    end

    subgraph "Storage Layer"
        F[chrome.storage.local]
    end

    subgraph "User Actions"
        G[Open New Tab] --> B
        H[Configure Settings] --> C
    end

    B --> F
    C --> F
    D --> I[User Configured URL]
    E --> F

    style A fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style B fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style C fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style F fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style I fill:#f5f5f5,stroke:#424242,stroke-width:2px
```

## Architecture Components

### Extension Files

#### manifest.json

The extension manifest file (Manifest V3) that defines:

- Extension metadata (name, version, description)
- Permissions (storage API)
- New tab override configuration
- Options page configuration
- Content Security Policy

#### New Tab Page (newtab.html, newtab.js, newtab.css)

The new tab page component that:

- Displays a dark-themed loading screen
- Shows a loading animation during redirect delay
- Redirects to the configured URL after delay
- Applies custom background color
- Handles URL configuration and redirect logic

#### Options Page (options.html, options.js, options.css)

The options/settings page that:

- Provides UI for configuring new tab URL
- Allows setting redirect delay (0-60000ms)
- Provides color picker for background customization
- Shows preset color options
- Validates URL format and domain resolution
- Saves settings to Chrome storage
- Displays extension version and git commit hash

### Storage

```mermaid
flowchart TD
    A[chrome.storage.local API] --> B[New Tab URL]
    A --> C[Redirect Delay]
    A --> D[Background Color]

    B --> E[Persisted Locally]
    C --> E
    D --> E

    E --> F[Scoped to Extension]
    E --> G[Survives Browser Restart]
    E --> H[Not Synced Across Devices]

    style A fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style E fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style F fill:#f5f5f5,stroke:#424242,stroke-width:1px
    style G fill:#f5f5f5,stroke:#424242,stroke-width:1px
    style H fill:#f5f5f5,stroke:#424242,stroke-width:1px
```

Uses `chrome.storage.local` API to persist:

- New tab URL
- Redirect delay
- Background color preference

Settings persist across browser sessions and are scoped to the extension.

### Security

```mermaid
flowchart TD
    A[Security Measures] --> B[Content Security Policy]
    A --> C[No Inline Scripts]
    A --> D[Storage Isolation]
    A --> E[URL Validation]

    B --> F[Enforced via manifest.json]
    C --> G[All JS in External Files]
    D --> H[Local Storage Only]
    E --> I[Format Validation Before Redirect]

    H --> J[Not Synced Across Devices]
    I --> K[Prevents Malicious Redirects]

    style A fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style B fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style C fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style D fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style E fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style K fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

Security features:

- **Content Security Policy**: Enforced via manifest.json
- **No Inline Scripts**: All JavaScript in external files
- **Storage Isolation**: Settings stored locally, not synced
- **URL Validation**: Domain format validation before redirect

## Data Flow

### New Tab Flow

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Chrome as Chrome Browser
    participant NewTab as newtab.html/js
    participant Storage as chrome.storage.local
    participant Target as Target URL

    User->>Chrome: Open New Tab (Ctrl+T/Cmd+T)
    Chrome->>NewTab: Load newtab.html
    NewTab->>Storage: Load settings (URL, delay, color)
    Storage-->>NewTab: Return configuration
    NewTab->>NewTab: Apply background color
    NewTab->>NewTab: Display loading animation

    alt Delay > 0ms
        NewTab->>NewTab: Wait for delay period
    end

    NewTab->>Target: Redirect to configured URL
    Target-->>User: Display target page

    rect rgb(240, 248, 255)
        Note over NewTab,Storage: Settings loaded<br/>from local storage
    end

    rect rgb(255, 248, 220)
        Note over NewTab: Customizable delay<br/>and background color
    end
```

The new tab flow process:

1. User opens new tab (`Ctrl+T` / `Cmd+T`)
2. Chrome loads `newtab.html`
3. `newtab.js` loads settings from `chrome.storage.local`
4. Page displays with configured background color
5. Loading animation shows (if delay > 0)
6. After delay, redirects to configured URL

### Options Page Flow

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Chrome as Chrome Browser
    participant Options as options.html/js
    participant Storage as chrome.storage.local

    User->>Chrome: Open Options Page
    Chrome->>Options: Load options.html
    Options->>Storage: Load current settings
    Storage-->>Options: Return saved configuration
    Options->>Options: Populate form fields
    Options-->>User: Display settings form

    User->>Options: Modify settings (URL, delay, color)
    Options->>Options: Validate URL format in real-time

    alt Invalid URL
        Options-->>User: Show validation error
    else Valid URL
        Options-->>User: Show validation success
    end

    User->>Options: Click Save button
    Options->>Storage: Write settings to chrome.storage.local
    Storage-->>Options: Confirm save success
    Options->>Options: Display confirmation message
    Options-->>User: Show success notification

    rect rgb(240, 248, 255)
        Note over Options,Storage: Settings persisted<br/>locally only
    end

    rect rgb(255, 248, 220)
        Note over Options: Real-time URL<br/>validation
    end
```

The options page flow process:

1. User opens options page (right-click extension → Options)
2. `options.js` loads current settings from storage
3. User modifies settings (URL, delay, color)
4. URL validation runs in real-time
5. User clicks "Save"
6. Settings written to `chrome.storage.local`
7. Confirmation message displayed

## DevOps Infrastructure

### CI/CD Pipeline

```mermaid
flowchart TD
    A[Developer Push/PR] --> B[CI Workflow Triggered]
    B --> C[Validate manifest.json]
    C --> D{Valid?}
    D -->|No| E[Fail CI]
    D -->|Yes| F[Verify Extension Packaging]
    F --> G{All Files Present?}
    G -->|No| E
    G -->|Yes| H[Run Pre-commit Hooks]
    H --> I{All Hooks Pass?}
    I -->|No| E
    I -->|Yes| J[Future: HTML/CSS/JS Linting]
    J --> K[Future: Automated Testing]
    K --> L[CI Success]
    L --> M{Main Branch?}
    M -->|Yes| N[Trigger Release Workflow]
    M -->|No| O[CI Complete]
    N --> P[Analyze Commit Messages]
    P --> Q{Version Bump Needed?}
    Q -->|No| R[Skip Release]
    Q -->|Yes| S[Update manifest.json Version]
    S --> T[Create Git Tag]
    T --> U[Generate CHANGELOG.md]
    U --> V[Create GitHub Release]
    V --> W[Release Complete]

    style A fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style L fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style E fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style D fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style G fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style I fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style Q fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style W fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

**CI Workflow** (`.github/workflows/ci.yml`):

- Validates manifest.json syntax and structure
- Verifies Chrome extension packaging (all required files present)
- Runs pre-commit hooks for code quality
- Placeholder steps for future HTML/CSS/JS linting
- Placeholder steps for future automated testing

**Release Workflow** (`.github/workflows/release.yml`):

- Triggers after successful CI completion
- Analyzes commit messages for version bumps
- Updates `manifest.json` version automatically
- Creates git tags in format `v{version}`
- Generates `CHANGELOG.md` from commits
- Creates GitHub releases

### Code Quality

```mermaid
flowchart LR
    A[Git Commit] --> B[Pre-commit Hooks]
    B --> C[YAML/TOML Validation]
    B --> D[Markdown Linting]
    B --> E[Trailing Whitespace Removal]
    B --> F[Conventional Commits Check]
    B --> G[Secret Scanning]
    B --> H[Renovate Config Validation]

    C --> I{All Pass?}
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I

    I -->|Yes| J[Commit Success]
    I -->|No| K[Commit Blocked]

    style A fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style J fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style K fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style I fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
```

**Pre-commit Hooks** (`.pre-commit-config.yaml`):

- YAML/TOML validation
- Markdown linting
- Trailing whitespace removal
- Conventional Commits enforcement
- Secret scanning (Gitleaks)
- Renovate config validation

## Technology Stack

- **Runtime**: Chrome Extension APIs (Manifest V3)
- **Storage**: chrome.storage.local API
- **Styling**: CSS3 with dark theme
- **Testing**: Playwright with TypeScript and Page Object Model
- **Version Management**: python-semantic-release
- **CI/CD**: GitHub Actions
- **Code Quality**: pre-commit hooks, markdownlint, commitlint

## Future Enhancements

### Planned Features

- HTML/CSS/JS linting tools
- Chrome Web Store publishing automation
- Additional customization options
- Expanded test coverage for edge cases

### Testing

The project uses Playwright for automated end-to-end testing. See [testing.md](testing.md) for comprehensive documentation on:

- Test suite architecture and fixtures
- Page Object Model implementation
- Writing and running tests
- CI/CD integration

### Architecture Considerations

- Extension is lightweight with no external dependencies
- All code runs in extension context (no external servers)
- Settings stored locally for privacy
- Designed for easy customization and extension

## Security Considerations

- No external API calls (except user-configured redirect)
- Settings stored locally (not synced across devices)
- Content Security Policy prevents inline scripts
- URL validation prevents malicious redirects
- Secret scanning prevents credential leaks

## Performance

- Minimal resource usage
- Fast page load (no external resources)
- Efficient storage API usage
- Smooth animations and transitions

## Maintenance

- Version managed automatically via semantic-release
- Code quality enforced via pre-commit hooks
- CI/CD validates changes before merge
- Documentation maintained alongside code
