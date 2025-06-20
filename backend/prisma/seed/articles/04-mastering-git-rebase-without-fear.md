`git rebase` rewrites commit history so your feature branch sits on top of its upstream branch as if it were created from there. While it can seem intimidating, understanding when and how to use it will make your Git workflow much cleaner.

## Interactive Rebase Workflow

1. `git fetch origin`
2. `git rebase -i origin/main`
3. Choose actions: **pick**, **squash**, **fixup**, **edit**.

```bash
pick 1e2d3c4 Add API client
squash 5a6b7c8 Fix typo
fixup 9f0a1b2 Linting
```

## Rebase Actions Explained

### Pick
- Keep the commit as-is
- Default action for most commits

### Squash
- Combine with the previous commit
- Opens editor to modify commit message

### Fixup
- Combine with the previous commit
- Discards the commit message

### Edit
- Pause rebase to modify the commit
- Useful for splitting commits or fixing issues

### Drop
- Remove the commit entirely
- Use with caution!

## Advanced Rebase Techniques

### Splitting Commits
```bash
# During interactive rebase, mark commit as 'edit'
# Then use:
git reset HEAD~1
git add file1.txt
git commit -m "Add feature A"
git add file2.txt
git commit -m "Add feature B"
git rebase --continue
```

### Reordering Commits
```bash
# In interactive rebase, simply reorder the lines
pick 1e2d3c4 First commit
pick 5a6b7c8 Second commit
pick 9f0a1b2 Third commit
```

### Fixing Upstream Commits
```bash
# Fix a commit that's already been pushed
git rebase -i HEAD~3
# Mark the commit as 'edit'
# Make your changes
git add .
git commit --amend
git rebase --continue
```

## When *Not* to Rebase

- Shared branches with colleagues
- Commits already deployed to production
- Public repositories where others might have based work on your commits

## Best Practices

### Before Rebase
```bash
# Always ensure you have a clean working directory
git status
git stash  # if needed

# Fetch latest changes
git fetch origin
```

### During Rebase
```bash
# If conflicts occur
git status  # see conflicted files
# Resolve conflicts manually
git add resolved-file.txt
git rebase --continue

# If you need to abort
git rebase --abort
```

### After Rebase
```bash
# Force push if you've rewritten history
git push --force-with-lease origin feature-branch
```

## Common Scenarios

### Keeping Feature Branch Updated
```bash
# Instead of merge commits
git checkout feature-branch
git rebase main
```

### Cleaning Up Before PR
```bash
# Squash related commits
git rebase -i main
# Choose squash for related commits
```

### Fixing Commit Messages
```bash
# Edit the last commit
git commit --amend -m "Better commit message"

# Edit older commits
git rebase -i HEAD~3
# Mark commit as 'reword'
```

> Use `git pull --rebase` to keep feature branches linear without merge commits.

## Troubleshooting

### Lost Commits
```bash
# Find lost commits
git reflog
git reset --hard HEAD@{n}  # where n is the reflog entry
```

### Complex Conflicts
```bash
# Use merge tools
git mergetool

# Or abort and try a different approach
git rebase --abort
```

---

_Last updated: 2025‑06‑19_
