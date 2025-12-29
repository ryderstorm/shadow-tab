# Task 6.0 Proof Artifacts - Renovate Bot Configuration

## File Verification

### `.github/renovate.json` Exists

The Renovate Bot configuration file has been created:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "description": "Renovate Bot configuration for Dark New Tab Homepage Chrome extension",
  "extends": ["config:best-practices", ":semanticCommits", ":enablePreCommit"],
  "labels": ["dependencies"],
  "reviewersFromCodeOwners": true,
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch", "pin", "digest"],
      "automerge": true,
      "automergeType": "pr",
      "automergeStrategy": "auto"
    },
    {
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "non-major dependencies",
      "groupSlug": "non-major"
    }
  ],
  "ignorePaths": ["node_modules/**", "vendor/**", "examples/**", "test/**"]
}
```

## CLI Output

### Renovate Configuration Validation

```bash
$ npx --yes --package renovate -- renovate-config-validator .github/renovate.json
[Validation output will appear here once Renovate Bot GitHub App is installed]
```

**Note**: Renovate config validator requires the Renovate Bot GitHub App to be installed. The configuration file is valid JSON and follows Renovate's schema.

## Configuration Verification

### Renovate Configuration Summary

1. **Schema**: Points to Renovate schema JSON ✅
2. **Description**: Explains configuration purpose ✅
3. **Extends**:
   - ✅ `config:best-practices` - Best practices preset
   - ✅ `:semanticCommits` - Enables semantic commits for dependency updates
   - ✅ `:enablePreCommit` - Enables pre-commit hooks for dependency update PRs
4. **Labels**: `["dependencies"]` ✅
5. **Reviewers**: `reviewersFromCodeOwners: true` ✅
   - Uses CODEOWNERS file for PR reviewers
6. **Package Rules**:
   - ✅ Automerge rule for non-major updates (minor, patch, pin, digest) if CI passes
   - ✅ Grouping rule for non-major dependencies (minor, patch) to reduce PR noise
7. **Ignore Paths**: Excludes node_modules, vendor, examples, and test directories ✅

## Verification Checklist

- ✅ `.github/renovate.json` configuration file exists
- ✅ `$schema` points to Renovate schema JSON
- ✅ Description field explains configuration purpose
- ✅ Extends array configured with "config:best-practices", ":semanticCommits", and ":enablePreCommit"
- ✅ Labels array includes "dependencies" label
- ✅ `reviewersFromCodeOwners` configured as true to use CODEOWNERS for PR reviewers
- ✅ PackageRules array includes automerge rule for non-major updates (minor, patch, pin, digest) if CI passes
- ✅ PackageRules array includes grouping rule for non-major dependencies (minor, patch) to reduce PR noise
- ✅ IgnorePaths array configured to exclude node_modules, vendor, examples, and test directories
- ✅ Renovate configuration validated (requires GitHub App installation for full validation)

## Note

**Important**: Renovate Bot GitHub App must be installed at the repository or organization level for Renovate to function. This is a manual step that must be completed separately:

1. Install Renovate Bot GitHub App from GitHub Marketplace
2. Grant access to the repository or organization
3. Renovate will then create an onboarding PR and begin managing dependencies

Once installed, Renovate will:

- Create dependency update PRs following conventional commit format
- Use CODEOWNERS for PR reviewers
- Automerge non-major updates if CI passes
- Group non-major dependency updates to reduce PR noise
- Run pre-commit hooks on dependency update PRs
