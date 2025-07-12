#!/bin/bash

echo "Detecting changed packages..."

# Get list of changed files
if [ "$1" = "pr" ] && [ -n "$2" ]; then
    # For pull requests, compare against base branch
    CHANGED_FILES=$(git diff --name-only origin/$2...HEAD)
elif [ -n "$1" ]; then
    # Compare against specific commit
    CHANGED_FILES=$(git diff --name-only $1)
else
    # Compare against last commit
    CHANGED_FILES=$(git diff --name-only HEAD~1)
fi

echo "Changed files:"
echo "$CHANGED_FILES"

# Initialize arrays
PACKAGES=()

# Check if we have any changed files
if [ -z "$CHANGED_FILES" ]; then
    echo "No changed files detected"
    echo "Detected packages: []"
    exit 0
fi

# Check each changed file
while IFS= read -r file; do
    if [[ -n "$file" ]]; then  # Only process non-empty lines
        if [[ $file == packages/* ]]; then
            # Extract package name
            PACKAGE=$(echo "$file" | cut -d'/' -f2)
            if [[ -n "$PACKAGE" && ! " ${PACKAGES[@]} " =~ " ${PACKAGE} " ]]; then
                PACKAGES+=("$PACKAGE")
            fi
        elif [[ $file == apps/* ]]; then
            # Extract app name
            APP=$(echo "$file" | cut -d'/' -f2)
            if [[ -n "$APP" && ! " ${PACKAGES[@]} " =~ " ${APP} " ]]; then
                PACKAGES+=("$APP")
            fi
        elif [[ $file == "package.json" || $file == "bun.lock" || $file == "turbo.json" ]]; then
            # Root changes affect all packages
            PACKAGES=("root" "web" "api" "eslint-config" "prettier-config" "tailwind-config" "tsconfig" "types" "ui" "vitest-config" "directus-sdk" "bin")
            break
        fi
    fi
done <<< "$CHANGED_FILES"

# Filter out empty strings and duplicates
FILTERED_PACKAGES=()
for package in "${PACKAGES[@]}"; do
    if [[ -n "$package" && ! " ${FILTERED_PACKAGES[@]} " =~ " ${package} " ]]; then
        FILTERED_PACKAGES+=("$package")
    fi
done

# Convert to JSON array safely
if [ ${#FILTERED_PACKAGES[@]} -eq 0 ]; then
    PACKAGES_JSON="[]"
else
    # Use a safer method to create JSON array
    PACKAGES_JSON="["
    for i in "${!FILTERED_PACKAGES[@]}"; do
        if [ $i -gt 0 ]; then
            PACKAGES_JSON+=","
        fi
        PACKAGES_JSON+="\"${FILTERED_PACKAGES[$i]}\""
    done
    PACKAGES_JSON+="]"
fi

echo "Detected packages: $PACKAGES_JSON"

# Also output individual packages for easier parsing
echo "Individual packages:"
for package in "${FILTERED_PACKAGES[@]}"; do
    echo "  - $package"
done
