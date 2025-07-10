#!/bin/bash

# Render Deployment Preparation Script
echo "🚀 Preparing your app for Render deployment..."

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Found render.yaml configuration"

# Check if Dockerfiles exist
if [ ! -f "docker/Dockerfile.web.prod" ]; then
    echo "❌ Web Dockerfile not found at docker/Dockerfile.web.prod"
    exit 1
fi

if [ ! -f "docker/Dockerfile.api.prod" ]; then
    echo "❌ API Dockerfile not found at docker/Dockerfile.api.prod"
    exit 1
fi

echo "✅ Found required Dockerfiles"

# Test Docker builds locally (optional)
echo "🔧 Testing Docker builds locally..."
echo "This may take a few minutes..."

# Build API Docker image
echo "Building API Docker image..."
if docker build -f docker/Dockerfile.api.prod -t test-api .; then
    echo "✅ API Docker build successful"
    docker rmi test-api 2>/dev/null
else
    echo "❌ API Docker build failed"
    exit 1
fi

# Build Web Docker image  
echo "Building Web Docker image..."
if docker build -f docker/Dockerfile.web.prod -t test-web .; then
    echo "✅ Web Docker build successful"
    docker rmi test-web 2>/dev/null
else
    echo "❌ Web Docker build failed"
    exit 1
fi

echo ""
echo "🎉 Your app is ready for Render deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your changes to GitHub"
echo "2. Go to render.com and sign up"
echo "3. Click 'New' → 'Blueprint'"
echo "4. Connect your GitHub repository"
echo "5. Render will detect render.yaml automatically"
echo "6. Update service names in render.yaml if needed"
echo "7. Click 'Apply' to deploy"
echo ""
echo "📚 For detailed instructions, see: docs/RENDER-DEPLOYMENT.md"
echo ""
echo "🌐 Your services will be available at:"
echo "   API: https://your-api-service-name.onrender.com"
echo "   Web: https://your-web-service-name.onrender.com"
