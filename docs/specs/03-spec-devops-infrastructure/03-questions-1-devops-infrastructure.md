# 03 Questions Round 1 - DevOps Infrastructure Integration

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. CI/CD Workflow Customization

The template includes placeholder CI workflows that need customization. For this Chrome extension project, what should the CI workflow do?

- [x] (A) Run basic validation (manifest.json validation, HTML/CSS/JS linting if tools are added)
- [x] (B) Include automated testing (if tests exist or will be added)
- [x] (C) Build/packaging validation (verify extension can be packaged)
- [ ] (D) All of the above
- [ ] (E) Other (describe)

**Additional context:**

## 2. Semantic Release Configuration

The template uses `python-semantic-release` for automated versioning. How should versioning work for this Chrome extension?

- [ ] (A) Update `manifest.json` version field automatically during releases
- [ ] (B) Create GitHub releases with release notes from CHANGELOG.md
- [x] (C) Both A and B
- [ ] (D) Use semantic-release but don't update manifest.json (manual version management)
- [ ] (E) Other (describe)

**Additional context:**

## 3. Pre-commit Hooks Selection

The template includes several pre-commit hooks. Which ones should be enabled for this project?

- [ ] (A) All tech-agnostic hooks (YAML, TOML, markdown linting, trailing whitespace, EOF fixes)
- [ ] (B) Conventional commits enforcement (commitlint)
- [ ] (C) Secret scanning (Gitleaks)
- [ ] (D) Renovate config validation (if using Renovate)
- [x] (E) All of the above
- [ ] (F) Other (describe specific hooks to include/exclude)

**Additional context:**

## 4. Documentation Structure

The template includes several documentation files. Which documentation should be created/updated?

- [ ] (A) CONTRIBUTING.md (development workflow and conventions)
- [ ] (B) AGENTS.md (AI assistant guidelines)
- [ ] (C) docs/development.md (local setup guide)
- [ ] (D) docs/ARCHITECTURE.md (system architecture)
- [ ] (E) .github/pull_request_template.md (PR template)
- [x] (F) All of the above
- [ ] (G) Other (describe)

**Additional context:**

## 5. GitHub Authentication for Semantic Release

The template uses Chainguard Octo STS for GitHub authentication in semantic-release. What authentication method should be used?

- [x] (A) Use Chainguard Octo STS (requires setup at org level)
- [ ] (B) Use GitHub Personal Access Token (GITHUB_TOKEN from secrets)
- [ ] (C) Use GitHub App token
- [ ] (D) Skip semantic-release automation for now (manual releases)
- [ ] (E) Other (describe)

**Additional context:**

## 6. Branch Protection and Repository Settings

Should branch protection rules and repository settings be configured?

- [x] (A) Yes, configure branch protection via GitHub Rulesets API
- [ ] (B) Yes, but configure manually via GitHub UI
- [ ] (C) No, skip branch protection configuration
- [ ] (D) Other (describe)

**Additional context:**

## 7. Dependency Management (Renovate)

Should Renovate Bot be configured for automated dependency updates?

- [x] (A) Yes, add Renovate configuration for automated dependency updates
- [ ] (B) No, skip Renovate configuration
- [ ] (C) Other (describe)

**Additional context:**

## 8. Existing Files to Preserve

Are there any existing files or configurations in the current repository that should be preserved or integrated?

- [x] (A) Current .gitignore (if exists)
- [x] (B) Current README.md structure/content
- [x] (C) Existing documentation in docs/ directory
- [ ] (D) Other files (list them)

**Additional context:**

use tavily and context7 to research best practices and modern standards for all the tech/tools associated with this update.
