# Task 5.0 Proof Artifacts - Repository Configuration and Branch Protection

## File Verification

### `.github/ruleset-config.json` Exists

The branch protection ruleset configuration file has been created:

```json
{
  "name": "main branch protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"]
    }
  },
  "rules": [
    {
      "type": "deletion",
      "parameters": {}
    },
    {
      "type": "non_fast_forward",
      "parameters": {}
    },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "require_last_push_approval": true,
        "required_review_thread_resolution": true,
        "allowed_merge_methods": ["squash"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          {
            "context": "Run Tests",
            "integration_id": null
          },
          {
            "context": "Run Linting",
            "integration_id": null
          }
        ]
      }
    },
    {
      "type": "required_linear_history",
      "parameters": {}
    }
  ],
  "bypass_actors": [
    {
      "actor_id": 1,
      "actor_type": "RepositoryRole",
      "bypass_mode": "always"
    }
  ]
}
```

### `.github/CODEOWNERS` Exists

The code ownership file has been created:

```text
# Code owners for this repository
# See https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

* @ryderstorm
```

## CLI Output

### JSON Validation

```bash
$ cat .github/ruleset-config.json | python3 -m json.tool > /dev/null && echo "✓ ruleset-config.json is valid JSON"
✓ ruleset-config.json is valid JSON
```

### GitHub API Commands (Requires Authentication)

The following commands are ready to be executed once GitHub CLI authentication is configured:

```bash
# Configure repository settings
gh api -X PATCH repos/ryderstorm/dark-homepage-newtab \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=false \
  -f delete_branch_on_merge=true

# Apply branch protection ruleset
gh api -X POST repos/ryderstorm/dark-homepage-newtab/rulesets \
  --input .github/ruleset-config.json

# Verify repository settings
gh api repos/ryderstorm/dark-homepage-newtab

# Verify branch protection ruleset
gh api repos/ryderstorm/dark-homepage-newtab/rulesets
```

**Note**: These commands require GitHub CLI authentication. The configuration files are ready and can be applied once authentication is configured.

## Configuration Verification

### Ruleset Configuration Summary

1. **Name**: "main branch protection" ✅
2. **Target**: "branch" ✅
3. **Enforcement**: "active" ✅
4. **Conditions**: Includes `refs/heads/main` ✅
5. **Rules**:
   - ✅ Deletion rule (prevents branch deletion)
   - ✅ Non-fast-forward rule (prevents force pushes)
   - ✅ Pull request rule:
     - Required approving review count: 1
     - Require last push approval: true
     - Required review thread resolution: true
     - Allowed merge methods: ["squash"]
   - ✅ Required status checks:
     - Strict policy: true
     - Required checks: "Run Tests", "Run Linting"
   - ✅ Required linear history (enforces linear history)
6. **Bypass Actors**: RepositoryRole (for admins and maintainers) ✅

### CODEOWNERS Configuration Summary

- ✅ All files (`*`) assigned to `@ryderstorm`
- ✅ Follows GitHub CODEOWNERS format

## Repository Settings Configuration

The following repository settings should be configured via GitHub API:

- ✅ `allow_squash_merge`: true
- ✅ `allow_merge_commit`: false
- ✅ `allow_rebase_merge`: false
- ✅ `delete_branch_on_merge`: true

## Verification Checklist

- ✅ `.github/ruleset-config.json` file exists with branch protection configuration
- ✅ Ruleset name configured as "main branch protection"
- ✅ Target set to "branch" and enforcement set to "active"
- ✅ Conditions configured to include `refs/heads/main` in ref_name
- ✅ Deletion rule added to prevent branch deletion
- ✅ Non-fast-forward rule added to prevent force pushes
- ✅ Pull request rule configured with:
  - required_approving_review_count: 1
  - require_last_push_approval: true
  - required_review_thread_resolution: true
  - allowed_merge_methods: ["squash"]
- ✅ Required status checks rule configured with strict policy and required checks: "Run Tests" and "Run Linting"
- ✅ Required linear history rule added to enforce linear history
- ✅ Bypass actors configured with RepositoryRole actor_type
- ✅ `.github/CODEOWNERS` file created with `* @ryderstorm`
- ✅ ruleset-config.json validated as valid JSON
- ✅ GitHub API commands prepared for repository settings configuration
- ✅ GitHub API commands prepared for ruleset application

## Note

The configuration files are complete and ready to be applied. The GitHub API commands require authentication via GitHub CLI (`gh auth login`). Once authenticated, the commands can be executed to:

1. Configure repository settings (squash merge only, auto-delete branches)
2. Apply branch protection ruleset
3. Verify settings and ruleset are active

The ruleset will enforce:

- Pull request reviews before merging
- CI status checks must pass
- Linear history (no merge commits)
- Branch deletion prevention
- Force push prevention
- Squash merge only
