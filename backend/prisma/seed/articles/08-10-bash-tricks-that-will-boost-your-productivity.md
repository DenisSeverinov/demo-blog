Bash is more than just a command shell—it's a powerful scripting language with features that can dramatically speed up your daily workflow. Here are ten essential techniques that every developer should master.

## 1. Brace Expansion

Brace expansion is one of Bash's most powerful features for generating sequences and patterns.

```bash
# Create multiple files at once
touch file{1..5}.txt

# Move files with sequential numbering
mv image{001..100}.png archive/

# Generate directory structure
mkdir -p src/{components,pages,utils}/{css,js,ts}

# Combine with other expansions
echo {a,b,c}{1,2,3}
# Output: a1 a2 a3 b1 b2 b3 c1 c2 c3
```

## 2. Process Substitution

Process substitution allows you to treat command output as files, enabling powerful data processing workflows.

```bash
# Compare output of two commands
diff <(ls /path1) <(ls /path2)

# Filter and sort data
grep "error" <(tail -f log.txt) | sort

# Merge sorted files
paste <(sort file1.txt) <(sort file2.txt)

# Use with vim for quick editing
vim <(grep -n "TODO" src/**/*.js)
```

## 3. History Search and Expansion

Bash history is a goldmine of productivity. Master these shortcuts to navigate your command history efficiently.

```bash
# Interactive history search
Ctrl-R  # Search backward through history
Ctrl-S  # Search forward through history

# History expansion
!$      # Last argument of previous command
$_      # Same as !$
!*      # All arguments of previous command
!n      # Execute command number n from history
!!      # Repeat last command
```

**Pro tip**: Add `set -o vi` to your `.bashrc` for vi-style history navigation.

## 4. Parameter Expansion

Parameter expansion provides powerful string manipulation capabilities directly in the shell.

```bash
# Basic variable usage
name="john_doe"
echo ${name}           # john_doe

# String replacement
echo ${name//_/ }      # john doe
echo ${name/_/ }       # john doe (first occurrence only)

# Substring extraction
echo ${name:0:4}       # john
echo ${name:5}         # doe

# Default values
echo ${var:-default}   # Use 'default' if var is unset
echo ${var:=default}   # Set var to 'default' if unset

# Case conversion
echo ${name^^}         # JOHN_DOE (uppercase)
echo ${name,,}         # john_doe (lowercase)
```

## 5. Extended Globbing with globstar

Enable advanced pattern matching for recursive file operations.

```bash
# Enable extended globbing
shopt -s extglob globstar

# Recursive file operations
find . -name "*.js" -exec rm {} \;  # Old way
rm **/*.js                          # New way with globstar

# Complex patterns
ls **/node_modules/**/package.json  # Find all package.json in node_modules
cp **/*.{js,ts} backup/             # Copy all JS and TS files

# Exclude patterns
ls **/*.js~**/node_modules/**       # All JS files except in node_modules
```

## 6. Parallel Processing with xargs

Speed up operations by running commands in parallel.

```bash
# Process files in parallel
find . -name "*.jpg" | xargs -P 4 -I {} convert {} {}.png

# Download multiple URLs concurrently
cat urls.txt | xargs -P 8 -I {} wget {}

# Process with custom command
echo "file1 file2 file3" | xargs -n 1 -P 3 process_file.sh

# Combine with other tools
find . -name "*.log" | xargs -P 4 grep "ERROR"
```

## 7. Command Timing and Performance

Monitor and optimize your command performance.

```bash
# Basic timing
time long_running_command

# Built-in timing variable
SECONDS=0
# ... your commands ...
echo "Elapsed time: $SECONDS seconds"

# Profile script execution
bash -x script.sh 2>&1 | grep "real"

# Time multiple commands
{ time command1; time command2; } 2>&1
```

## 8. Directory Stack Navigation

Efficiently navigate between directories using a stack.

```bash
# Push current directory onto stack and change to new directory
pushd /path/to/project

# Push another directory
pushd /path/to/another/project

# View directory stack
dirs -v

# Pop and return to previous directory
popd

# Rotate stack
pushd +1  # Move to next directory in stack
```

**Pro tip**: Create aliases for common directory navigation:
```bash
alias ..='pushd ..'
alias -- -='popd'
```

## 9. Named Pipes (FIFOs)

Create temporary communication channels between processes.

```bash
# Create a named pipe
mkfifo mypipe

# Write to pipe in one terminal
echo "Hello from terminal 1" > mypipe

# Read from pipe in another terminal
cat mypipe

# Real-time data processing
mkfifo data_pipe
tail -f log.txt > data_pipe &
grep "ERROR" data_pipe | tee errors.log
```

## 10. Advanced Aliases and Functions

Combine aliases with functions for powerful custom commands.

```bash
# Git checkout with fuzzy finder
alias gco='git checkout "$(git branch | fzf)"'

# Function for quick directory creation and navigation
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Docker cleanup function
docker-cleanup() {
    docker system prune -f
    docker volume prune -f
    docker image prune -a -f
}

# Quick server with Python
serve() {
    python3 -m http.server ${1:-8000}
}

# Git status with colors
alias gs='git status --porcelain | awk '"'"'{print $2}'"'"' | xargs -I {} echo -e "\033[32m{}\033[0m"'
```

## Bonus: Custom Bash Functions

```bash
# Extract any archive
extract() {
    if [ -f $1 ]; then
        case $1 in
            *.tar.bz2)   tar xjf $1     ;;
            *.tar.gz)    tar xzf $1     ;;
            *.bz2)       bunzip2 $1     ;;
            *.rar)       unrar e $1     ;;
            *.gz)        gunzip $1      ;;
            *.tar)       tar xf $1      ;;
            *.tbz2)      tar xjf $1     ;;
            *.tgz)       tar xzf $1     ;;
            *.zip)       unzip $1       ;;
            *.Z)         uncompress $1  ;;
            *.7z)        7z x $1        ;;
            *)          echo "'$1' cannot be extracted via extract()" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}

# Create a backup of a file
bak() {
    cp "$1" "$1.bak.$(date +%Y%m%d_%H%M%S)"
}
```

## Pro Tips for Maximum Productivity

1. **Customize your prompt**: Show git branch, exit status, and current directory
2. **Use command-line fuzzy finders**: Install `fzf` for interactive file/command selection
3. **Leverage shell options**: `set -o vi`, `set -o ignoreeof`
4. **Create a comprehensive `.bashrc`**: Load it with useful aliases and functions
5. **Learn keyboard shortcuts**: `Ctrl+A`, `Ctrl+E`, `Ctrl+U`, `Ctrl+K`

---

_Last updated: 2025‑06‑19_
