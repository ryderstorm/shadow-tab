# Contributing to Dark New Tab Homepage

Thank you for your interest in contributing to Dark New Tab Homepage! This document provides guidelines and instructions for contributing to the project.

## Development Workflow

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/dark-homepage-newtab.git
   cd dark-homepage-newtab
   ```

3. Set up pre-commit hooks (see Pre-commit Hooks section below)
4. Create a branch for your changes (see Branch Naming Conventions below)
5. Make your changes
6. Commit your changes following Conventional Commits (see Conventional Commits Guide below)
7. Push your branch and create a Pull Request

### Pre-commit Hooks

This project uses pre-commit hooks to ensure code quality and consistency. Hooks run automatically on `git commit` and check:

- YAML/TOML file syntax
- Markdown linting
- Trailing whitespace and end-of-file fixes
- Conventional Commits format
- Secret scanning (Gitleaks)
- Renovate configuration validation
- TypeScript type checking
- ESLint linting (JavaScript and TypeScript)
- Prettier code formatting

#### Installation

```bash
# Install pre-commit (if not already installed)
pip install pre-commit

# Install hooks in your local repository
pre-commit install
```

#### Usage

Hooks run automatically on `git commit`. To run hooks manually:

```bash
# Run hooks on all files
pre-commit run --all-files

# Run hooks on staged files only
pre-commit run
```

To skip hooks (not recommended):

```bash
git commit --no-verify
```

#### Manual Linting and Formatting

You can run linting and formatting manually without committing:

```bash
# Run ESLint to check for issues
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are formatted correctly (without changing them)
npm run format:check

# Run TypeScript type checking
npm run type-check
```

#### Fixing Common Linting Issues

- **ESLint errors**: Run `npm run lint:fix` to automatically fix most issues
- **Prettier formatting**: Run `npm run format` to format all files
- **TypeScript errors**: Fix type errors manually, then run `npm run type-check` to verify

## Conventional Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages must follow this format:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
# Feature
git commit -m "feat: add color picker for background customization"

# Bug fix
git commit -m "fix: correct URL validation for chrome:// URLs"

# Documentation
git commit -m "docs: update installation instructions"

# Feature with scope
git commit -m "feat(options): add preset color buttons"

# Breaking change
git commit -m "feat!: change default redirect delay to 1000ms" -m "BREAKING CHANGE: default redirect delay changed from 0ms to 1000ms"
```

### Scope Guidelines

Use scopes to indicate the area of the codebase affected:

- `options`: Options page changes
- `newtab`: New tab page changes
- `manifest`: Manifest.json changes
- `ci`: CI/CD changes
- `docs`: Documentation changes

### Breaking Changes

Breaking changes must be indicated with `!` after the type/scope and include a `BREAKING CHANGE:` footer:

```bash
git commit -m "feat!: change storage API" -m "BREAKING CHANGE: migrate from chrome.storage.sync to chrome.storage.local"
```

## Branch Naming Conventions

Branches should follow this format:

```text
<type>/<description>
```

### Branch Types

- `feat/`: New features
- `fix/`: Bug fixes
- `docs/`: Documentation changes
- `refactor/`: Code refactoring
- `test/`: Test additions or changes
- `chore/`: Maintenance tasks

### Examples

```bash
# Feature branch
git checkout -b feat/color-picker

# Bug fix branch
git checkout -b fix/url-validation

# Documentation branch
git checkout -b docs/installation-guide
```

## Testing Guidelines

### Chrome Extension Testing

Currently, testing is done manually. Future automated testing framework integration is planned.

#### Manual Testing Checklist

- [ ] Extension loads correctly in Chrome
- [ ] Options page displays and saves settings correctly
- [ ] New tab redirects to configured URL
- [ ] Redirect delay works as expected
- [ ] Background color changes apply correctly
- [ ] Settings persist across browser sessions
- [ ] URL validation works for various URL formats

### Running Pre-commit Hooks

Before submitting a PR, ensure all pre-commit hooks pass:

```bash
pre-commit run --all-files
```

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Run pre-commit hooks to ensure code quality
3. Create a Pull Request with a clear description
4. Fill out the PR template completely
5. Wait for code review and address any feedback
6. Once approved, your PR will be merged

## Code Style

- Use consistent indentation (spaces, not tabs)
- Follow existing code patterns
- Keep functions focused and single-purpose
- Add comments for complex logic
- Maintain the dark theme aesthetic

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.

Thank you for contributing to Dark New Tab Homepage!
