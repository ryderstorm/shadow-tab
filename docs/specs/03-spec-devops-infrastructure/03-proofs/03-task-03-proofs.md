# Task 3.0 Proof Artifacts - Semantic Release Automation

## File Verification

### `.releaserc.toml` Exists

The semantic release configuration file has been created:

```toml
[tool.semantic_release]
tag_format = "v{version}"
allow_zero_version = true
version_variables = [
    "manifest.json:version"
]

[tool.semantic_release.changelog]
changelog_file = "CHANGELOG.md"
output_format = "md"

[tool.semantic_release.branches.main]
match = "main"

[tool.semantic_release.remote]
token_env = "GH_TOKEN"

[tool.semantic_release.commit_message]
template = "chore: release {version} [skip ci]"
```

### `.github/workflows/release.yml` Exists

The semantic release workflow file has been created:

```yaml
name: Semantic Release

on:
  workflow_run:
    workflows: ["CI - Tests and Linting"]
    branches:
      - main
    types:
      - completed

jobs:
  release:
    name: Semantic Release
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v6.0.1
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Authenticate with Chainguard Octo STS
        uses: chainguard-dev/actions/octo-sts@main
        with:
          identity: main-semantic-release

      - name: Configure git author
        run: |
          git config user.name "octo-sts[bot]"
          git config user.email "octo-sts[bot]@users.noreply.github.com"

      - name: Set up Python 3.12
        uses: actions/setup-python@v6.1.0
        with:
          python-version: '3.12'

      - name: Install python-semantic-release
        run: |
          pip install "python-semantic-release>=10.0.0,<11.0.0"

      - name: Run semantic-release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          semantic-release version --config .releaserc.toml
          semantic-release publish --config .releaserc.toml
          semantic-release changelog --config .releaserc.toml
```

### `.github/chainguard/main-semantic-release.sts.yaml` Exists

The Chainguard Octo STS configuration file has been created:

```yaml
apiVersion: identity.chainguard.dev/v1alpha1
kind: WorkloadIdentity
metadata:
  name: main-semantic-release
spec:
  subject_pattern: "repo:ryderstorm/dark-homepage-newtab:ref:refs/heads/main"
```

## CLI Output

### Manifest.json Version Reset

```bash
$ cat manifest.json | grep version
  "manifest_version": 3,
  "version": "0.1.0",
```

**Verification**: The version has been reset from `1.0.0` to `0.1.0` as required for semantic-release initial version.

### Git Tags Verification

```bash
git tag -l

```

**Verification**: No existing git tags found, ensuring a clean start for semantic-release.

### CHANGELOG.md Verification

```bash
$ ls -la CHANGELOG.md
ls: CHANGELOG.md: No such file or directory
```

**Verification**: CHANGELOG.md does not exist (as expected), semantic-release will generate it automatically.

## Configuration Verification

### Semantic Release Configuration Summary

1. **Tag Format**: `v{version}` ✅
   - Tags will be created in format `v0.1.0`, `v0.2.0`, etc.

2. **Allow Zero Version**: `true` ✅
   - Enables starting from version `0.1.0`

3. **Version Variables**: `manifest.json:version` ✅
   - Automatically updates `manifest.json` version field during releases

4. **Changelog Configuration**:
   - ✅ File: `CHANGELOG.md`
   - ✅ Output format: `md` (Markdown)

5. **Branch Configuration**:
   - ✅ Main branch matching configured

6. **Remote Configuration**:
   - ✅ Uses `GH_TOKEN` environment variable for GitHub authentication

7. **Commit Message Template**: `chore: release {version} [skip ci]` ✅
   - Includes `[skip ci]` flag to prevent CI re-triggering

### Release Workflow Configuration Summary

1. **Trigger**: Workflow run completion of CI workflow on main branch ✅
2. **Condition**: Only runs if CI workflow succeeds ✅
3. **Chainguard Octo STS**: Configured with identity `main-semantic-release` ✅
4. **Git Author**: Configured as `octo-sts[bot]` ✅
5. **Python Setup**: Python 3.12 configured ✅
6. **Semantic Release**: Installs `python-semantic-release>=10.0.0,<11.0.0` ✅
7. **Commands**: Runs version, publish, and changelog commands ✅

### Chainguard STS Configuration Summary

1. **Identity Name**: `main-semantic-release` ✅
2. **Subject Pattern**: `repo:ryderstorm/dark-homepage-newtab:ref:refs/heads/main` ✅
   - Matches the repository path as specified

## Verification Checklist

- ✅ `.releaserc.toml` file exists with all required configuration
- ✅ `tag_format` configured as "v{version}"
- ✅ `allow_zero_version` set to true
- ✅ `version_variables` configured for `manifest.json:version`
- ✅ Changelog settings configured (file: CHANGELOG.md, format: md)
- ✅ Branches section configured for main branch
- ✅ Remote section configured to use GH_TOKEN
- ✅ Commit message template includes [skip ci] flag
- ✅ `.github/workflows/release.yml` workflow file exists
- ✅ Release workflow triggers on CI workflow completion
- ✅ Chainguard Octo STS authentication step configured
- ✅ Git author configured as octo-sts[bot]
- ✅ Python 3.12 setup configured
- ✅ python-semantic-release installation configured
- ✅ Semantic-release commands configured
- ✅ `.github/chainguard/` directory created
- ✅ `.github/chainguard/main-semantic-release.sts.yaml` file exists
- ✅ Subject pattern matches repository path (ryderstorm/dark-homepage-newtab)
- ✅ manifest.json version reset from "1.0.0" to "0.1.0"
- ✅ No existing git tags (clean start)
- ✅ CHANGELOG.md does not exist (will be generated by semantic-release)

## Note

The semantic release configuration is complete and ready to use. Once the CI workflow is active and Chainguard Octo STS is configured at the organization level, semantic-release will:

1. Analyze commit messages on the main branch
2. Determine version bumps based on Conventional Commits
3. Update `manifest.json` version automatically
4. Create git tags in format `v{version}`
5. Generate `CHANGELOG.md` with release notes
6. Create GitHub releases with changelog content

The workflow will trigger automatically after successful CI completion on the main branch.
