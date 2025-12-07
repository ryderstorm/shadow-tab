# 03-tasks-devops-infrastructure.md

## Relevant Files

- `.pre-commit-config.yaml` - Pre-commit hooks configuration file with YAML/TOML validation, markdown linting, conventional commits, secret scanning, and Renovate validation
- `.markdownlint.yaml` - Markdown linting configuration for consistent documentation formatting
- `.github/workflows/ci.yml` - CI workflow for Chrome extension validation, testing placeholders, and linting
- `.github/workflows/release.yml` - Semantic release workflow that triggers after CI passes on main branch
- `.releaserc.toml` - Semantic release configuration with manifest.json version variable updates
- `.github/chainguard/main-semantic-release.sts.yaml` - Chainguard Octo STS configuration for semantic release authentication
- `CONTRIBUTING.md` - Contribution guidelines with development workflow, conventional commits guide, and branch naming conventions
- `AGENTS.md` - AI assistant guidelines with repository context and development patterns
- `docs/development.md` - Local development setup guide with prerequisites and testing guidelines
- `docs/ARCHITECTURE.md` - System architecture documentation template
- `.github/pull_request_template.md` - Pull request description template
- `.github/ruleset-config.json` - Branch protection ruleset configuration for GitHub Rulesets API
- `.github/CODEOWNERS` - Code ownership file with ryderstorm as codeowner
- `.github/renovate.json` - Renovate Bot configuration for automated dependency updates
- `manifest.json` - Chrome extension manifest file (needs version reset to 0.1.0 for semantic-release)
- `.gitignore` - Git ignore file (needs merging with template patterns)

### Notes

- All GitHub Actions workflows must use pinned versions (e.g., `@v4`) for security and stability
- Pre-commit hooks run automatically on `git commit` after installation via `pre-commit install`
- Semantic release requires Chainguard Octo STS setup at organization level (assumed to be handled separately)
- Renovate Bot requires GitHub App installation at repository or organization level
- Branch protection ruleset must be applied via GitHub CLI: `gh api -X POST repos/{owner}/{repo}/rulesets --input .github/ruleset-config.json`
- Manifest.json version will be reset from `1.0.0` to `0.1.0` to align with semantic-release initial version
- Existing `.gitignore` content (`.temp`) must be preserved when merging with template patterns

## Tasks

### [x] 1.0 Pre-commit Hooks Configuration

#### 1.0 Proof Artifact(s)

- **CLI**: `pre-commit run --all-files` executes successfully and shows all hooks passing demonstrates hooks are configured correctly
- **CLI**: `git commit -m "invalid commit"` fails with commitlint error message demonstrates conventional commits enforcement
- **CLI**: `git commit -m "feat: add new feature"` succeeds demonstrates valid conventional commit format
- **File**: `.pre-commit-config.yaml` exists with all required hooks configured demonstrates configuration is complete

#### 1.0 Tasks

- [x] 1.1 Create `.pre-commit-config.yaml` file with tech-agnostic hooks configuration
- [x] 1.2 Configure pre-commit-hooks repository with YAML validation, TOML validation, trailing whitespace, EOF fixes, and large file checks
- [x] 1.3 Configure markdownlint-cli hook with auto-fix capabilities, excluding CHANGELOG.md
- [x] 1.4 Configure commitlint hook for Conventional Commits enforcement on commit-msg stage
- [x] 1.5 Configure Gitleaks hook for secret scanning with redact option
- [x] 1.6 Configure Renovate config validator hook
- [x] 1.7 Set fail_fast to false and configure default install hook types (pre-commit, pre-push, commit-msg)
- [x] 1.8 Test pre-commit hooks by running `pre-commit run --all-files` and verify all hooks pass
- [x] 1.9 Test commitlint enforcement by attempting invalid commit message and verifying failure
- [x] 1.10 Test valid conventional commit message succeeds

### [x] 2.0 CI/CD Workflow Implementation

#### 2.0 Proof Artifact(s)

- **GitHub Actions**: CI workflow runs successfully on test PR demonstrates workflow is active
- **GitHub Actions**: CI workflow shows "Run Tests" and "Run Linting" jobs passing on test PR demonstrates job structure is correct
- **CLI**: `gh workflow view ci.yml` shows workflow configuration demonstrates workflow file exists
- **File**: `.github/workflows/ci.yml` exists with Chrome extension-specific validation steps demonstrates customization is complete
- **GitHub PR**: Test PR created with CI workflow running demonstrates workflow triggers correctly on pull requests

#### 2.0 Tasks

- [x] 2.1 Create `.github/workflows/` directory if it doesn't exist
- [x] 2.2 Create `.github/workflows/ci.yml` workflow file with name "CI - Tests and Linting"
- [x] 2.3 Configure workflow triggers: push to main branch, pull_request, and workflow_dispatch
- [x] 2.4 Create "Run Tests" job with ubuntu-latest runner
- [x] 2.5 Add manifest.json validation step to test job (validate JSON syntax and structure)
- [x] 2.6 Add Chrome extension packaging validation step (verify extension files can be packaged)
- [x] 2.7 Add placeholder steps for HTML/CSS/JS linting tools (commented with TODO)
- [x] 2.8 Add placeholder steps for automated testing framework (commented with TODO)
- [x] 2.9 Create "Run Linting" job with ubuntu-latest runner
- [x] 2.10 Configure Python 3.12 setup for pre-commit hooks in linting job
- [x] 2.11 Configure Node.js 20 setup for Renovate validator in linting job
- [x] 2.12 Add pre-commit hooks step to linting job using pre-commit/action@v3.0.1 with --all-files flag
- [x] 2.13 Pin all GitHub Actions to specific versions (checkout@v6.0.1, setup-python@v6.1.0, setup-node@v6.1.0)
- [x] 2.14 Create test branch and test PR to verify CI workflow runs successfully
- [x] 2.15 Verify both "Run Tests" and "Run Linting" jobs pass on test PR

### [x] 3.0 Semantic Release Automation

#### 3.0 Proof Artifact(s)

- **GitHub Release**: Pushing a `feat:` commit to `main` creates a new minor version release (starting from `v0.1.0`) demonstrates semantic versioning works
- **File**: `manifest.json` version field updates automatically after release (from `0.1.0` to `0.2.0` for example) demonstrates version variable configuration
- **File**: `CHANGELOG.md` contains release notes generated from commits demonstrates changelog generation
- **CLI**: `git tag -l` shows new version tag (e.g., `v0.1.0`, `v0.2.0`) demonstrates tag creation
- **File**: `.releaserc.toml` exists with `version_variables` configured for `manifest.json` demonstrates configuration is complete

#### 3.0 Tasks

- [x] 3.1 Create `.releaserc.toml` file with semantic release configuration
- [x] 3.2 Configure tag_format as "v{version}" and allow_zero_version as true
- [x] 3.3 Configure version_variables to include "manifest.json:version" for automatic version updates
- [x] 3.4 Configure changelog settings with changelog_file as "CHANGELOG.md" and output_format as "md"
- [x] 3.5 Configure branches section with main branch matching
- [x] 3.6 Configure remote section to use GH_TOKEN from environment variable
- [x] 3.7 Set commit_message template with [skip ci] flag to prevent CI re-triggering
- [x] 3.8 Create `.github/workflows/release.yml` workflow file
- [x] 3.9 Configure release workflow to trigger on workflow_run completion of CI workflow on main branch
- [x] 3.10 Add Chainguard Octo STS authentication step with identity "main-semantic-release"
- [x] 3.11 Configure git author as octo-sts[bot] with proper email format
- [x] 3.12 Set up Python 3.12 and install python-semantic-release>=10.0.0,<11.0.0
- [x] 3.13 Add semantic-release command step with .releaserc.toml configuration
- [x] 3.14 Create `.github/chainguard/` directory
- [x] 3.15 Create `.github/chainguard/main-semantic-release.sts.yaml` file with subject_pattern for repository
- [x] 3.16 Update subject_pattern in STS config to match repository path (ryderstorm/dark-homepage-newtab)
- [x] 3.17 Reset manifest.json version from "1.0.0" to "0.1.0" to align with semantic-release initial version
- [x] 3.18 Delete any existing git tags if present (for clean semantic-release start)
- [x] 3.19 Remove CHANGELOG.md if it exists (semantic-release will generate it)
- [x] 3.20 Test semantic release by creating test commit with feat: prefix and verifying version bump (after CI setup is complete)

### [ ] 4.0 Documentation Structure and Standards

#### 4.0 Proof Artifact(s)

- **File**: `CONTRIBUTING.md` exists with conventional commits examples demonstrates contribution guidelines are documented
- **File**: `AGENTS.md` exists with repository context demonstrates AI assistant guidelines are available
- **File**: `.github/pull_request_template.md` exists and appears in PR creation form demonstrates template is active
- **CLI**: `markdownlint docs/**/*.md` passes without errors demonstrates documentation follows standards
- **File**: `.markdownlint.yaml` exists with configuration demonstrates linting rules are defined

#### 4.0 Tasks

- [ ] 4.1 Create `.markdownlint.yaml` configuration file with disabled rules (MD013, MD024, MD033, MD034, MD041)
- [ ] 4.2 Create `CONTRIBUTING.md` file with development workflow section
- [ ] 4.3 Add conventional commits guide with types, examples, scope guidelines, and breaking change format
- [ ] 4.4 Add branch naming conventions section with format and examples
- [ ] 4.5 Add pre-commit hooks section with installation and usage instructions
- [ ] 4.6 Add testing guidelines section with placeholder for Chrome extension-specific testing
- [ ] 4.7 Customize CONTRIBUTING.md for Chrome extension project (remove language-specific examples not applicable)
- [ ] 4.8 Create `AGENTS.md` file with repository overview section
- [ ] 4.9 Add project structure section describing Chrome extension files and DevOps infrastructure
- [ ] 4.10 Add key files table with descriptions of configuration files
- [ ] 4.11 Add quick reference section with common commands
- [ ] 4.12 Add important notes for AI assistants about Chrome extension project specifics
- [ ] 4.13 Create `docs/development.md` file with local development setup section
- [ ] 4.14 Add prerequisites section (Git, pre-commit) without language-specific requirements
- [ ] 4.15 Add initial setup steps customized for Chrome extension (no dependency installation needed)
- [ ] 4.16 Add pre-commit installation instructions
- [ ] 4.17 Add environment variables section (if applicable) or note that none are required
- [ ] 4.18 Add secret scanning section explaining Gitleaks usage
- [ ] 4.19 Create `docs/ARCHITECTURE.md` file with system overview template
- [ ] 4.20 Customize ARCHITECTURE.md template for Chrome extension architecture (update component descriptions)
- [ ] 4.21 Create `.github/pull_request_template.md` file with PR description template
- [ ] 4.22 Add Why?, What Changed?, Testing, Additional Notes, and Checklist sections to PR template
- [ ] 4.23 Run markdownlint on all documentation files and fix any linting errors
- [ ] 4.24 Verify all documentation files pass markdownlint validation

### [ ] 5.0 Repository Configuration and Branch Protection

#### 5.0 Proof Artifact(s)

- **GitHub API**: `gh api repos/{owner}/{repo}` shows `allow_squash_merge: true` demonstrates repository settings are configured
- **GitHub API**: `gh api repos/{owner}/{repo}/rulesets` returns ruleset configuration demonstrates branch protection is active
- **GitHub UI**: Attempting to push directly to `main` branch fails demonstrates branch protection is enforced
- **File**: `.github/ruleset-config.json` exists with protection rules demonstrates configuration is complete
- **File**: `.github/CODEOWNERS` exists with `ryderstorm` as codeowner demonstrates code ownership is configured
- **CLI**: `gh api -X POST repos/{owner}/{repo}/rulesets --input .github/ruleset-config.json` succeeds demonstrates ruleset can be applied

#### 5.0 Tasks

- [ ] 5.1 Create `.github/ruleset-config.json` file with branch protection configuration
- [ ] 5.2 Configure ruleset name as "main branch protection" with target "branch" and enforcement "active"
- [ ] 5.3 Configure conditions to include DEFAULT_BRANCH (main) in ref_name
- [ ] 5.4 Add deletion rule to prevent branch deletion
- [ ] 5.5 Add non_fast_forward rule to prevent force pushes
- [ ] 5.6 Add pull_request rule with required_approving_review_count: 1, require_last_push_approval: true, required_review_thread_resolution: true, and allowed_merge_methods: ["squash"]
- [ ] 5.7 Add required_status_checks rule with strict policy and required checks: "Run Tests" and "Run Linting"
- [ ] 5.8 Add required_linear_history rule to enforce linear history
- [ ] 5.9 Configure bypass_actors with RepositoryRole actor_type (for admins and maintainers)
- [ ] 5.10 Create `.github/CODEOWNERS` file with `* @ryderstorm` to set codeowner
- [ ] 5.11 Configure repository settings via GitHub API: `gh api -X PATCH repos/{owner}/{repo}` with allow_squash_merge=true, allow_merge_commit=false, allow_rebase_merge=false, delete_branch_on_merge=true
- [ ] 5.12 Apply branch protection ruleset via GitHub API: `gh api -X POST repos/{owner}/{repo}/rulesets --input .github/ruleset-config.json`
- [ ] 5.13 Verify repository settings are configured correctly using `gh api repos/{owner}/{repo}`
- [ ] 5.14 Verify branch protection ruleset is active using `gh api repos/{owner}/{repo}/rulesets`
- [ ] 5.15 Test branch protection by attempting to push directly to main and verifying it fails (or is blocked)

### [ ] 6.0 Renovate Bot Configuration

#### 6.0 Proof Artifact(s)

- **File**: `.github/renovate.json` exists with configuration demonstrates Renovate is configured
- **CLI**: `npx --yes --package renovate -- renovate-config-validator` validates configuration successfully demonstrates config is valid
- **GitHub**: Renovate Bot creates onboarding PR demonstrates bot is active (after installation)
- **GitHub**: Dependency update PRs follow conventional commit format demonstrates semantic commits are enabled

#### 6.0 Tasks

- [ ] 6.1 Create `.github/renovate.json` configuration file
- [ ] 6.2 Add $schema pointing to Renovate schema JSON
- [ ] 6.3 Add description field explaining the configuration purpose
- [ ] 6.4 Configure extends array with "config:best-practices", ":semanticCommits", and ":enablePreCommit"
- [ ] 6.5 Add labels array with "dependencies" label
- [ ] 6.6 Configure reviewersFromCodeOwners as true to use CODEOWNERS for PR reviewers
- [ ] 6.7 Add packageRules array with automerge rule for non-major updates (minor, patch, pin, digest) if CI passes
- [ ] 6.8 Add packageRules array with grouping rule for non-major dependencies (minor, patch) to reduce PR noise
- [ ] 6.9 Configure ignorePaths array to exclude node_modules, vendor, examples, and test directories
- [ ] 6.10 Validate Renovate configuration using `npx --yes --package renovate -- renovate-config-validator`
- [ ] 6.11 Fix any validation errors if present
- [ ] 6.12 Note that Renovate Bot GitHub App must be installed at repository or organization level (manual step)
