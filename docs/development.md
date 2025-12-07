# Local Development Setup

This guide will help you set up the Dark New Tab Homepage Chrome extension for local development.

## Prerequisites

- **Git**: Version control system
- **Chrome Browser**: For testing the extension
- **pre-commit**: For running code quality hooks (optional but recommended)

### Installing Pre-commit

Pre-commit hooks help maintain code quality and consistency. To install:

```bash
# Using pip
pip install pre-commit

# Using Homebrew (macOS)
brew install pre-commit

# Verify installation
pre-commit --version
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ryderstorm/dark-homepage-newtab.git
cd dark-homepage-newtab
```

### 2. Install Pre-commit Hooks

```bash
pre-commit install
```

This installs git hooks that run automatically on `git commit` to check code quality.

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `dark-homepage-newtab` directory
5. The extension should now appear in your extensions list

### 4. Verify Installation

- Open a new tab to see the dark homepage
- Right-click the extension icon and select "Options" to access settings
- Verify the extension loads without errors

## Development Workflow

### Making Changes

1. Create a feature branch:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes to the extension files

3. Test your changes:
   - Reload the extension in Chrome (`chrome://extensions/` → Reload icon)
   - Test the functionality in a new tab
   - Verify options page works correctly

4. Commit your changes:

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

   Pre-commit hooks will run automatically to check code quality.

5. Push and create a Pull Request:

   ```bash
   git push origin feat/your-feature-name
   ```

### Running Pre-commit Hooks Manually

To run hooks without committing:

```bash
# Run on all files
pre-commit run --all-files

# Run on staged files only
pre-commit run
```

## Environment Variables

No environment variables are required for local development. The extension uses Chrome's storage API for settings persistence.

## Secret Scanning

This project uses Gitleaks to scan for hardcoded secrets before commits. The pre-commit hook will:

- Scan all files for potential secrets
- Redact sensitive information if found
- Prevent commits containing secrets

**Important**: Never commit API keys, tokens, passwords, or other sensitive information.

## Testing Guidelines

### Manual Testing

Currently, testing is done manually. Follow this checklist:

- [ ] Extension loads without errors
- [ ] Options page displays correctly
- [ ] Settings save and persist
- [ ] New tab redirects to configured URL
- [ ] Redirect delay works as expected
- [ ] Background color changes apply
- [ ] URL validation works for various formats
- [ ] Extension works after browser restart

### Future Automated Testing

The CI workflow includes placeholder steps for future automated testing framework integration. When implemented, tests will run automatically on pull requests.

## Troubleshooting

### Extension Not Loading

- Check Chrome console for errors (`chrome://extensions/` → Details → Inspect views)
- Verify `manifest.json` is valid JSON
- Ensure all required files exist

### Pre-commit Hooks Failing

- Run `pre-commit run --all-files` to see specific errors
- Fix linting issues automatically: `pre-commit run --all-files --hook-stage manual`
- Check `.markdownlint.yaml` for markdown linting rules

### Git Credential Issues

If you encounter git credential issues with pre-commit hooks:

- Configure git credential helper: `git config --global credential.helper osxkeychain` (macOS)
- Or use SSH URLs for git remotes
- Pre-commit hooks will work once git authentication is configured

## Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Pre-commit Documentation](https://pre-commit.com/)

## Getting Help

If you encounter issues during setup:

1. Check the [CONTRIBUTING.md](../CONTRIBUTING.md) guide
2. Review existing issues on GitHub
3. Open a new issue with details about your problem

Happy coding!
