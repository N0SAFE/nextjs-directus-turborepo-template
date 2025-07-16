@echo off
REM Test script to verify Docker Compose project naming works correctly
REM This script demonstrates how the COMPOSE_PROJECT_NAME variable affects resource naming

echo 🧪 Testing Docker Compose Project Naming
echo ========================================

REM Test 1: Default naming (when COMPOSE_PROJECT_NAME is not set)
echo 📋 Test 1: Default project naming
set "COMPOSE_PROJECT_NAME="
echo COMPOSE_PROJECT_NAME: %COMPOSE_PROJECT_NAME%
if "%COMPOSE_PROJECT_NAME%"=="" echo Expected container names: nextjs-directus-api-dev, nextjs-directus-web-dev
echo.

REM Test 2: Custom project naming
echo 📋 Test 2: Custom project naming
set "COMPOSE_PROJECT_NAME=my-blog"
echo COMPOSE_PROJECT_NAME: %COMPOSE_PROJECT_NAME%
echo Expected container names: my-blog-api-dev, my-blog-web-dev
echo.

REM Test 3: Another custom project
echo 📋 Test 3: Another custom project
set "COMPOSE_PROJECT_NAME=ecommerce-store"
echo COMPOSE_PROJECT_NAME: %COMPOSE_PROJECT_NAME%
echo Expected container names: ecommerce-store-api-dev, ecommerce-store-web-dev
echo.

echo 🔍 To test in practice:
echo 1. Set COMPOSE_PROJECT_NAME in your .env file
echo 2. Run: docker-compose config --services
echo 3. Run: docker-compose up -d
echo 4. Check with: docker ps --filter "name=%PROJECT_NAME%"
echo.

echo ✅ Test completed. Update your .env file with a unique COMPOSE_PROJECT_NAME value.
pause
