# AI Assistant Guidelines

This document provides context and guidelines for AI assistants working with this repository.

## Repository Overview

**Dark New Tab Homepage** is a Chrome extension that replaces the default new tab page with a customizable dark-themed homepage that redirects to a user-configured URL.

## Project Structure

### Chrome Extension Files

- `manifest.json`: Chrome extension manifest (Manifest V3)
- `newtab.html`: New tab page HTML
- `newtab.js`: New tab page JavaScript logic
- `newtab.css`: New tab page styles
- `options.html`: Options page HTML
- `options.js`: Options page JavaScript logic
- `options.css`: Options page styles

### DevOps Infrastructure

- `.pre-commit-config.yaml`: Pre-commit hooks configuration
- `.markdownlint.yaml`: Markdown linting configuration
- `.github/workflows/ci.yml`: CI workflow for tests and linting
- `.github/workflows/release.yml`: Semantic release workflow
- `.releaserc.toml`: Semantic release configuration
- `.github/chainguard/main-semantic-release.sts.yaml`: Chainguard Octo STS configuration
- `.github/ruleset-config.json`: Branch protection ruleset
- `.github/CODEOWNERS`: Code ownership file
- `.github/renovate.json`: Renovate Bot configuration
- `.github/pull_request_template.md`: PR template

### Documentation

- `README.md`: Project overview and user documentation
- `CONTRIBUTING.md`: Contribution guidelines
- `AGENTS.md`: This file - AI assistant guidelines
- `docs/development.md`: Local development setup guide
- `docs/ARCHITECTURE.md`: System architecture documentation
- `docs/testing.md`: Testing guide with Playwright setup and patterns
- `docs/specs/`: Specification documents and task breakdowns

## Key Files

| File                       | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `manifest.json`            | Chrome extension configuration and metadata |
| `.pre-commit-config.yaml`  | Pre-commit hooks for code quality           |
| `.github/workflows/ci.yml` | CI/CD pipeline configuration                |
| `.releaserc.toml`          | Semantic versioning configuration           |
| `CONTRIBUTING.md`          | Contribution guidelines and conventions     |

## Quick Reference

### Common Commands

```bash
# Install pre-commit hooks
pre-commit install

# Run pre-commit hooks on all files
pre-commit run --all-files

# Validate manifest.json
python3 -m json.tool manifest.json

# Check git status
git status

# View recent commits
git log --oneline -5
```

### Development Workflow

1. Create a feature branch: `git checkout -b feat/feature-name`
2. Make changes
3. Commit using Conventional Commits: `git commit -m "feat: add feature"`
4. Run pre-commit hooks: `pre-commit run --all-files`
5. Push and create PR: `git push origin feat/feature-name`

## Important Notes for AI Assistants

### Chrome Extension Specifics

- This is a **Chrome Extension** project, not a web application
- Uses **Manifest V3** (not V2)
- No build step required - files are loaded directly
- Uses `chrome.storage.local` API for settings persistence
- Must comply with Content Security Policy (no inline scripts)

### Commit Conventions

- **Always use Conventional Commits** format
- Commit messages are enforced by commitlint pre-commit hook
- Format: `<type>[scope]: <description>`
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

### Code Quality

- Pre-commit hooks run automatically on commit
- Markdown files must pass markdownlint
- YAML/TOML files are validated
- Secrets are scanned with Gitleaks
- All hooks must pass before commit succeeds

### Version Management

- Version is managed by semantic-release
- Version is stored in `manifest.json`
- Semantic-release updates version automatically based on commits
- Starting version: `0.1.0`

### Testing

- **Automated Testing**: Playwright test suite with Page Object Model pattern
- **Test Fixtures**: Custom fixtures for extension loading, page management, and storage operations
- **CI Integration**: Tests run automatically in CI workflow
- **Documentation**: See [docs/testing.md](docs/testing.md) for comprehensive testing guide
- **Manual Testing**: Can also test by loading extension in Chrome Developer Mode

### Documentation

- All markdown files must pass markdownlint
- Use `.markdownlint.yaml` configuration
- Follow existing documentation patterns
- Update relevant docs when making changes

## Repository Standards

- **Conventional Commits**: Enforced by commitlint
- **Markdown Linting**: Enforced by markdownlint-cli
- **GitHub Actions**: All actions pinned to specific versions
- **Branch Protection**: Enforced via GitHub Rulesets API
- **Semantic Versioning**: Automated via python-semantic-release

## Getting Help

- Check `CONTRIBUTING.md` for contribution guidelines
- Review `docs/development.md` for setup instructions
- See `docs/ARCHITECTURE.md` for system architecture
- Read `docs/testing.md` for testing patterns and best practices
- Check existing issues and PRs for examples
