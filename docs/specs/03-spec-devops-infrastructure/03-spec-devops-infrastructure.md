# 03-spec-devops-infrastructure.md

## Introduction/Overview

This specification defines the integration of modern DevOps infrastructure and development workflow automation into the Dark New Tab Homepage Chrome extension project. The integration incorporates CI/CD automation, quality gates via pre-commit hooks, semantic versioning with automated releases, comprehensive documentation standards, and repository management best practices from the liatrio-labs/base-repo-template. This will establish a professional development workflow that automates versioning, enforces code quality, and streamlines the release process for the Chrome extension.

## Goals

- Establish automated CI/CD pipeline with validation, testing, and packaging checks for Chrome extension
- Implement pre-commit hooks for code quality gates (YAML/TOML validation, markdown linting, conventional commits, secret scanning)
- Configure semantic release automation that updates `manifest.json` version and creates GitHub releases with changelogs
- Create comprehensive documentation structure following modern open-source project standards
- Set up branch protection and repository settings via GitHub Rulesets API
- Configure Renovate Bot for automated dependency management
- Preserve existing repository files and documentation while integrating new infrastructure

## User Stories

- **As a developer**, I want pre-commit hooks to catch formatting and quality issues locally so that I don't waste time fixing them in CI
- **As a maintainer**, I want automated semantic versioning based on commit messages so that releases are consistent and changelogs are automatically generated
- **As a contributor**, I want clear documentation and contribution guidelines so that I can understand how to contribute effectively
- **As a project owner**, I want CI/CD to validate the extension can be packaged correctly so that broken builds are caught before release
- **As a developer**, I want automated dependency updates so that security patches and improvements are applied without manual intervention

## Demoable Units of Work

### [Unit 1]: Pre-commit Hooks Configuration

**Purpose:** Establish local quality gates that run automatically before commits, catching common issues early and maintaining code quality standards.

**Functional Requirements:**

- The system shall validate YAML and TOML files for syntax errors before commits
- The system shall lint markdown files using markdownlint-cli with auto-fix capabilities
- The system shall enforce trailing whitespace removal and end-of-file fixes
- The system shall validate commit messages follow Conventional Commits specification via commitlint
- The system shall scan for hardcoded secrets using Gitleaks before commits
- The system shall validate Renovate configuration files if present
- The system shall check for large files (>500KB) being committed
- Pre-commit hooks shall be installable via `pre-commit install` command
- Pre-commit hooks shall run automatically on `git commit` and be skippable with `--no-verify` flag

**Proof Artifacts:**

- **CLI**: `pre-commit run --all-files` executes successfully and shows all hooks passing demonstrates hooks are configured correctly
- **CLI**: `git commit -m "invalid commit"` fails with commitlint error message demonstrates conventional commits enforcement
- **CLI**: `git commit -m "feat: add new feature"` succeeds demonstrates valid conventional commit format
- **File**: `.pre-commit-config.yaml` exists with all required hooks configured demonstrates configuration is complete

### [Unit 2]: CI/CD Workflow Implementation

**Purpose:** Automate validation, testing, and packaging verification for the Chrome extension to catch issues before they reach production.

**Functional Requirements:**

- The system shall validate `manifest.json` syntax and structure in CI workflow
- The system shall include placeholder steps for HTML/CSS/JS linting tools (to be configured in future)
- The system shall include placeholder steps for automated testing framework (to be configured in future)
- The system shall verify the extension can be packaged into a valid Chrome extension format
- The system shall run pre-commit hooks against all files in CI to ensure consistency
- CI workflow shall trigger on pushes to `main` branch and pull requests
- CI workflow shall include separate jobs for tests and linting that run in parallel
- CI workflow shall use GitHub Actions with pinned action versions for security

**Proof Artifacts:**

- **GitHub Actions**: CI workflow runs successfully on push to `main` branch demonstrates workflow is active
- **GitHub Actions**: CI workflow shows "Run Tests" and "Run Linting" jobs passing demonstrates job structure is correct
- **CLI**: `gh workflow view ci.yml` shows workflow configuration demonstrates workflow file exists
- **File**: `.github/workflows/ci.yml` exists with Chrome extension-specific validation steps demonstrates customization is complete

### [Unit 3]: Semantic Release Automation

**Purpose:** Automate version management, changelog generation, and GitHub releases based on Conventional Commits, including automatic updates to `manifest.json`.

**Functional Requirements:**

- The system shall analyze commit messages using Conventional Commits to determine version bump (major/minor/patch)
- The system shall start semantic versioning from initial version `v0.1.0`
- The system shall automatically update `manifest.json` version field during releases
- The system shall generate or update `CHANGELOG.md` with release notes from commit messages
- The system shall create annotated Git tags in format `v{version}` (e.g., `v0.1.0`, `v0.2.0`)
- The system shall create GitHub releases with release notes from CHANGELOG.md
- The system shall use Chainguard Octo STS for GitHub authentication in release workflow
- Semantic release workflow shall trigger after successful CI completion on `main` branch
- The system shall support version format `v{version}` in tags and `{version}` in manifest.json
- Release commits shall include `[skip ci]` in commit message to prevent CI re-triggering

**Proof Artifacts:**

- **GitHub Release**: Pushing a `feat:` commit to `main` creates a new minor version release (starting from `v0.1.0`) demonstrates semantic versioning works
- **File**: `manifest.json` version field updates automatically after release (from `0.1.0` to `0.2.0` for example) demonstrates version variable configuration
- **File**: `CHANGELOG.md` contains release notes generated from commits demonstrates changelog generation
- **CLI**: `git tag -l` shows new version tag (e.g., `v0.1.0`, `v0.2.0`) demonstrates tag creation
- **File**: `.releaserc.toml` exists with `version_variables` configured for `manifest.json` demonstrates configuration is complete

### [Unit 4]: Documentation Structure and Standards

**Purpose:** Establish comprehensive documentation following modern open-source project standards to guide contributors and AI assistants.

**Functional Requirements:**

- The system shall include `CONTRIBUTING.md` with development workflow, conventional commits guide, and branch naming conventions
- The system shall include `AGENTS.md` with context for AI assistants working with the repository
- The system shall include `docs/development.md` with local setup instructions and testing guidelines
- The system shall include `docs/ARCHITECTURE.md` template for system architecture documentation
- The system shall include `.github/pull_request_template.md` with PR description template
- The system shall include `.markdownlint.yaml` configuration for consistent markdown formatting
- Documentation shall follow markdown linting standards enforced by pre-commit hooks
- Documentation shall preserve existing content in `README.md` and `docs/` directory structure

**Proof Artifacts:**

- **File**: `CONTRIBUTING.md` exists with conventional commits examples demonstrates contribution guidelines are documented
- **File**: `AGENTS.md` exists with repository context demonstrates AI assistant guidelines are available
- **File**: `.github/pull_request_template.md` exists and appears in PR creation form demonstrates template is active
- **CLI**: `markdownlint docs/**/*.md` passes without errors demonstrates documentation follows standards
- **File**: `.markdownlint.yaml` exists with configuration demonstrates linting rules are defined

### [Unit 5]: Repository Configuration and Branch Protection

**Purpose:** Configure repository settings and branch protection rules to enforce code quality and prevent direct pushes to main branch.

**Functional Requirements:**

- The system shall configure repository settings via GitHub API (squash merge only, auto-delete branches)
- The system shall apply branch protection ruleset via GitHub Rulesets API for `main` branch
- Branch protection shall require pull request reviews before merging
- Branch protection shall require CI status checks to pass before merging
- Branch protection shall enforce linear history (no merge commits)
- Branch protection shall prevent branch deletion
- Branch protection shall prevent force pushes (non-fast-forward)
- The system shall include `.github/ruleset-config.json` with branch protection configuration
- The system shall include `.github/CODEOWNERS` file with `ryderstorm` as the codeowner

**Proof Artifacts:**

- **GitHub API**: `gh api repos/{owner}/{repo}` shows `allow_squash_merge: true` demonstrates repository settings are configured
- **GitHub API**: `gh api repos/{owner}/{repo}/rulesets` returns ruleset configuration demonstrates branch protection is active
- **GitHub UI**: Attempting to push directly to `main` branch fails demonstrates branch protection is enforced
- **File**: `.github/ruleset-config.json` exists with protection rules demonstrates configuration is complete
- **File**: `.github/CODEOWNERS` exists with `ryderstorm` as codeowner demonstrates code ownership is configured
- **CLI**: `gh api -X POST repos/{owner}/{repo}/rulesets --input .github/ruleset-config.json` succeeds demonstrates ruleset can be applied

### [Unit 6]: Renovate Bot Configuration

**Purpose:** Automate dependency updates and security patches through Renovate Bot integration.

**Functional Requirements:**

- The system shall include `.github/renovate.json` configuration file
- Renovate configuration shall extend `config:best-practices` preset
- Renovate configuration shall enable semantic commits for dependency update PRs
- Renovate configuration shall enable pre-commit hooks for dependency update PRs
- Renovate configuration shall automerge non-major updates (minor, patch) if CI passes
- Renovate configuration shall group non-major dependency updates to reduce PR noise
- Renovate configuration shall use CODEOWNERS for PR reviewers
- Renovate configuration shall ignore test directories and vendor directories
- Renovate configuration shall not include Chrome extension-specific package rules (no package.json or dependency files currently)

**Proof Artifacts:**

- **File**: `.github/renovate.json` exists with configuration demonstrates Renovate is configured
- **CLI**: `npx --yes --package renovate -- renovate-config-validator` validates configuration successfully demonstrates config is valid
- **GitHub**: Renovate Bot creates onboarding PR demonstrates bot is active (after installation)
- **GitHub**: Dependency update PRs follow conventional commit format demonstrates semantic commits are enabled

## Non-Goals (Out of Scope)

1. **Chrome Web Store Publishing Automation**: This spec does not include automation for publishing to Chrome Web Store (can be added in future)
2. **Language-Specific Linting**: HTML/CSS/JS linting tools configuration is out of scope (placeholders provided in CI workflow for future addition)
3. **Automated Testing Framework**: Test framework setup and test writing is out of scope (CI includes placeholder steps for future test implementation)
4. **Docker/Containerization**: Container builds and Docker workflows are out of scope for this Chrome extension project
5. **Multi-Branch Release Strategy**: Only `main` branch releases are configured (no develop/staging branch workflows)
6. **Custom Changelog Templates**: Uses default semantic-release changelog templates (customization can be added later)
7. **GitHub App Setup**: Chainguard Octo STS setup at organization level is assumed to be handled separately

## Design Considerations

No specific UI/UX design requirements for this infrastructure integration. All changes are configuration files, workflows, and documentation that operate behind the scenes. The Chrome extension user interface remains unchanged.

## Repository Standards

Implementation shall follow patterns established in the liatrio-labs/base-repo-template:

- **Conventional Commits**: All commits must follow Conventional Commits specification (enforced by commitlint)
- **Markdown Linting**: All markdown files must pass markdownlint validation (enforced by pre-commit)
- **GitHub Actions Versioning**: All GitHub Actions must use pinned versions (e.g., `@v4`) for security and stability
- **YAML/TOML Validation**: All configuration files must be valid YAML/TOML (enforced by pre-commit)
- **Secret Scanning**: No secrets shall be committed to repository (enforced by Gitleaks)
- **Documentation Structure**: Follow template structure for consistency with other Liatrio projects
- **Branch Naming**: Use conventional branch names (`feat/`, `fix/`, `docs/`, etc.) as documented in CONTRIBUTING.md

## Technical Considerations

- **Python Semantic Release**: Uses `python-semantic-release` (Python-based) for semantic versioning, requiring Python 3.12+ in CI environment
- **Initial Version**: Semantic release will start from version `v0.1.0` (current manifest.json shows `1.0.0` but will be reset to `0.1.0` for initial release)
- **Manifest.json Version Format**: `manifest.json` uses string format `"version": "0.1.0"` which semantic-release can update via `version_variables` configuration
- **HTML/CSS/JS Linting**: Linting tools (ESLint, Stylelint) are left as placeholders in CI workflow for future configuration
- **Testing Framework**: Automated testing framework (Jest, Mocha, etc.) is left as placeholder in CI workflow for future configuration
- **Chainguard Octo STS**: Requires organization-level setup of Octo STS GitHub App before semantic-release workflow will work
- **GitHub Rulesets API**: Uses modern GitHub Rulesets API (not legacy branch protection) for branch protection configuration
- **Pre-commit Framework**: Uses `pre-commit` Python framework for hook management (language-agnostic)
- **Renovate Bot**: Requires Renovate Bot GitHub App to be installed at repository or organization level
- **File Preservation**: Existing `.gitignore`, `README.md`, and `docs/` directory structure must be preserved and merged with new configurations
- **Chrome Extension Packaging**: CI workflow includes validation that extension files can be packaged (no actual Chrome Web Store API calls)

## Security Considerations

- **Secret Scanning**: Gitleaks pre-commit hook scans for hardcoded secrets, API keys, tokens, and credentials before commits
- **GitHub Token Security**: Chainguard Octo STS provides short-lived tokens instead of long-lived PATs for semantic-release workflow
- **Action Version Pinning**: All GitHub Actions use specific version pins (not `@latest`) to prevent supply chain attacks
- **Branch Protection**: Prevents force pushes and requires code review, reducing risk of malicious code injection
- **Proof Artifacts Security**: No sensitive information (API keys, tokens, credentials) should be included in proof artifacts or screenshots

## Success Metrics

1. **Pre-commit Hook Adoption**: 100% of commits after implementation use pre-commit hooks (measured by hook execution logs)
2. **CI Success Rate**: CI workflow passes on all commits to `main` branch (measured by GitHub Actions success rate)
3. **Semantic Release Automation**: Version updates and releases occur automatically without manual intervention (measured by release creation frequency)
4. **Documentation Completeness**: All required documentation files exist and are accessible (measured by file existence checks)
5. **Code Quality**: Zero pre-commit hook failures in CI after initial setup (measured by CI job success rate)
6. **Dependency Management**: Renovate Bot creates and merges dependency update PRs automatically (measured by PR creation frequency)

## Open Questions

No open questions at this time. All decisions have been made:

- HTML/CSS/JS linting tools: Left as placeholders for future implementation
- Automated testing framework: Left as placeholders for future implementation
- Initial semantic-release version: `v0.1.0`
- CODEOWNERS: Set to `ryderstorm`
- Renovate Chrome extension rules: Not needed (no package.json or dependency files currently)
