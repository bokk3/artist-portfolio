#!/bin/bash

# Docker Hub Deployment Script
# This script helps you build, tag, and push the image to Docker Hub

set -e

# Configuration
DOCKER_USERNAME="bokk3"  # Change this to your Docker Hub username
IMAGE_NAME="artist-portfolio"
VERSION=$(node -p "require('./package.json').version")

echo "🐳 Building and pushing Docker image to Docker Hub"
echo "=================================================="
echo "Username: $DOCKER_USERNAME"
echo "Image: $IMAGE_NAME"
echo "Version: $VERSION"
echo ""

# Build the image
echo "📦 Building Docker image..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION .
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:latest .

echo "✅ Image built successfully!"
echo ""

# Login to Docker Hub (if not already logged in)
echo "🔐 Logging in to Docker Hub..."
docker login

echo ""
echo "📤 Pushing images to Docker Hub..."

# Push versioned tag
docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION
echo "✅ Pushed $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"

# Push latest tag
docker push $DOCKER_USERNAME/$IMAGE_NAME:latest
echo "✅ Pushed $DOCKER_USERNAME/$IMAGE_NAME:latest"

echo ""
echo "🎉 Successfully pushed to Docker Hub!"
echo ""
echo "You can now pull the image with:"
echo "  docker pull $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo "  docker pull $DOCKER_USERNAME/$IMAGE_NAME:latest"
echo ""
echo "Or use docker-compose.prod.yml to deploy"
