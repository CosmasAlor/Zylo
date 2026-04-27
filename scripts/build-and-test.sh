#!/bin/bash

# Production Build and Test Script
# This script performs comprehensive testing and optimization before deployment

set -e

echo "🚀 Starting production build and test process..."

# Set production environment
export NODE_ENV=production

echo "🔧 Installing dependencies..."
npm ci

echo "🧪 Running tests..."
npm test

echo "🔍 Running type checking..."
npm run typecheck

echo "📋 Running ESLint..."
npm run lint

echo "🎨 Checking code formatting..."
npm run format:check

echo "🔧 Generating Prisma client..."
npm run prisma:generate

echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo "❌ ERROR: Build failed - .next directory not found"
    exit 1
fi

echo "📊 Analyzing bundle size..."
npx @next/bundle-analyzer .next

echo "🔍 Checking for security vulnerabilities..."
npm audit --audit-level=moderate

echo "📋 Build optimization checks..."

# Check for large files in build
echo "🔍 Checking for large files in build..."
find .next -type f -size +1M -exec ls -lh {} \; | head -10

# Check build size
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "📦 Build size: $BUILD_SIZE"

# Check for critical files
CRITICAL_FILES=(
    ".next/server/app/api/auth/[...nextauth]/route.js"
    ".next/server/app/api/blog/route.js"
    ".next/server/app/admin/page.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ ERROR: $file missing"
        exit 1
    fi
done

echo "🔍 Testing production build locally..."

# Start production server in background
echo "🚀 Starting production server..."
npm run start &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ ERROR: Health check failed"
    kill $SERVER_PID
    exit 1
fi

# Test critical endpoints
echo "🔍 Testing critical endpoints..."

# Test authentication endpoint
if curl -f http://localhost:3000/api/auth/session > /dev/null 2>&1; then
    echo "✅ Auth endpoint responding"
else
    echo "❌ ERROR: Auth endpoint not responding"
fi

# Test blog endpoint
if curl -f http://localhost:3000/api/blog > /dev/null 2>&1; then
    echo "✅ Blog endpoint responding"
else
    echo "❌ ERROR: Blog endpoint not responding"
fi

# Stop production server
echo "🛑 Stopping production server..."
kill $SERVER_PID

echo "✅ Production build and test completed successfully!"
echo "📦 Build size: $BUILD_SIZE"
echo "🎉 Ready for deployment!"
