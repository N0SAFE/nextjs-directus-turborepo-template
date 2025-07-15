#!/bin/bash

# Test script to validate GitHub Copilot setup environment
# This script simulates what the Copilot agent will experience

set -e  # Exit on any error

echo "🧪 Testing GitHub Copilot Development Environment Setup"
echo "======================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Test 1: Check required tools
echo "🔍 Checking required tools..."
echo "================================"

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found"
    exit 1
fi

# Check Bun
if command -v bun >/dev/null 2>&1; then
    BUN_VERSION=$(bun --version)
    print_success "Bun: v$BUN_VERSION"
else
    print_error "Bun not found - install from https://bun.sh/"
    exit 1
fi

# Check Docker
if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    print_success "Docker: v$DOCKER_VERSION"
else
    print_warning "Docker not found - Docker functionality will be limited"
fi

# Check Turbo
if bun x turbo --version >/dev/null 2>&1; then
    TURBO_VERSION=$(bun x turbo --version)
    print_success "Turbo: v$TURBO_VERSION"
else
    print_warning "Turbo not found globally - will be installed locally"
fi

echo ""

# Test 2: Check project structure
echo "📁 Validating project structure..."
echo "==================================="

required_files=(
    "package.json"
    "turbo.json"
    "docker-compose.yml"
    "apps/web/package.json"
    "apps/api/package.json"
    ".github/workflows/copilot-setup-steps.yml"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_success "$file exists"
    else
        print_error "$file missing"
        exit 1
    fi
done

required_dirs=(
    "apps/web"
    "apps/api"
    "packages"
    "docs"
    ".github/workflows"
)

for dir in "${required_dirs[@]}"; do
    if [[ -d "$dir" ]]; then
        print_success "$dir/ directory exists"
    else
        print_error "$dir/ directory missing"
        exit 1
    fi
done

echo ""

# Test 3: Check environment variables in workflow
echo "⚙️ Validating workflow environment variables..."
echo "==============================================="

workflow_file=".github/workflows/copilot-setup-steps.yml"
required_env_vars=(
    "NEXT_PUBLIC_API_URL"
    "NEXT_PUBLIC_API_PORT"
    "API_PING_PATH"
    "API_ADMIN_TOKEN"
    "NEXT_PUBLIC_APP_URL"
    "NEXT_PUBLIC_APP_PORT"
    "AUTH_SECRET"
    "DB_DATABASE"
    "DB_ROOT_PASSWORD"
    "BUN_VERSION"
)

for var in "${required_env_vars[@]}"; do
    if grep -q "$var:" "$workflow_file"; then
        print_success "$var configured in workflow"
    else
        print_error "$var missing from workflow"
        exit 1
    fi
done

echo ""

# Test 4: Validate workflow syntax
echo "📝 Validating workflow YAML syntax..."
echo "====================================="

if command -v python3 >/dev/null 2>&1; then
    if python3 -c "import yaml; yaml.safe_load(open('$workflow_file'))" 2>/dev/null; then
        print_success "Workflow YAML syntax is valid"
    else
        print_error "Workflow YAML syntax is invalid"
        exit 1
    fi
else
    print_warning "Python3 not found - skipping YAML syntax validation"
fi

echo ""

# Test 5: Test dependency installation
echo "📦 Testing dependency installation..."
echo "====================================="

if [[ -f "bun.lock" ]]; then
    print_info "Installing dependencies with bun..."
    if bun install --frozen-lockfile >/dev/null 2>&1; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_warning "bun.lock not found - running bun install without frozen lockfile"
    if bun install >/dev/null 2>&1; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
fi

echo ""

# Test 6: Test package building
echo "🏗️ Testing package building..."
echo "==============================="

print_info "Building declarative routes..."
if bun run --cwd apps/web dr:build >/dev/null 2>&1; then
    print_success "Declarative routes built successfully"
else
    print_warning "Failed to build declarative routes - may need API connection"
fi

print_info "Building shared packages..."
if bun x turbo run build --filter="!web" --filter="!api" >/dev/null 2>&1; then
    print_success "Shared packages built successfully"
else
    print_warning "Some shared packages failed to build - may need API connection"
fi

echo ""

# Test 7: Check available scripts
echo "🎯 Checking available scripts..."
echo "================================"

required_scripts=(
    "dev"
    "build"
    "test"
    "lint"
    "clean"
)

for script in "${required_scripts[@]}"; do
    if bun run --silent "$script" --help >/dev/null 2>&1 || grep -q "\"$script\":" package.json; then
        print_success "Script '$script' available"
    else
        print_warning "Script '$script' may not be properly configured"
    fi
done

echo ""

# Test 8: Final summary
echo "📊 Test Summary"
echo "==============="

print_success "✅ All critical tests passed!"
print_info "The GitHub Copilot development environment is ready to use."
echo ""
print_info "Next steps:"
echo "  1. Commit the setup files to your repository"
echo "  2. Push to trigger the workflow"
echo "  3. Check the Actions tab to verify the workflow runs successfully"
echo "  4. The Copilot coding agent will now have a fully configured environment!"
echo ""

echo "🎉 GitHub Copilot Development Environment Test Completed Successfully!"
