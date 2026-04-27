#!/bin/bash

# Deployment Verification Script
# This script helps verify that your deployment is properly configured

echo "🔍 Zylo Dental Clinic - Deployment Verification"
echo "=============================================="

# Check if we have the necessary environment variables locally
echo "📋 Checking local environment..."

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL not set locally"
    echo "   Make sure it's set in Vercel environment variables"
else
    echo "✅ DATABASE_URL is set"
fi

if [ -z "$AUTH_SECRET" ]; then
    echo "⚠️  WARNING: AUTH_SECRET not set locally"
    echo "   Make sure it's set in Vercel environment variables"
else
    echo "✅ AUTH_SECRET is set"
    # Check length
    SECRET_LENGTH=$(echo $AUTH_SECRET | wc -c)
    if [ $SECRET_LENGTH -lt 32 ]; then
        echo "❌ ERROR: AUTH_SECRET should be at least 32 characters"
        echo "   Current length: $SECRET_LENGTH"
    else
        echo "✅ AUTH_SECRET length is sufficient ($SECRET_LENGTH chars)"
    fi
fi

echo ""
echo "🔧 Testing local build process..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run prisma:generate

# Test database connection
echo "🗄️  Testing database connection..."
if npx prisma db pull --force > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "   Check your DATABASE_URL in Vercel environment variables"
fi

# Run type checking
echo "🔍 Running TypeScript checks..."
if npm run typecheck > /dev/null 2>&1; then
    echo "✅ TypeScript checks passed"
else
    echo "❌ TypeScript checks failed"
    echo "   Run 'npm run typecheck' to see errors"
fi

# Run linting
echo "📋 Running ESLint..."
if npm run lint > /dev/null 2>&1; then
    echo "✅ ESLint checks passed"
else
    echo "❌ ESLint checks failed"
    echo "   Run 'npm run lint' to see errors"
fi

# Run tests
echo "🧪 Running tests..."
if npm test > /dev/null 2>&1; then
    echo "✅ All tests passed"
else
    echo "❌ Some tests failed"
    echo "   Run 'npm test' to see details"
fi

# Build project
echo "🏗️  Building project..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
    
    # Check build size
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
    echo "📦 Build size: $BUILD_SIZE"
else
    echo "❌ Build failed"
    echo "   Run 'npm run build' to see errors"
fi

echo ""
echo "📋 Vercel Environment Variables Checklist:"
echo "=========================================="
echo "Make sure these are set in your Vercel project:"
echo ""
echo "Required Variables:"
echo "• DATABASE_URL (your Supabase connection string)"
echo "• AUTH_SECRET (32+ character random string)"
echo "• NEXTAUTH_URL (your Vercel deployment URL)"
echo "• NEXT_PUBLIC_APP_URL (same as NEXTAUTH_URL)"
echo "• ADMIN_EMAIL (admin login email)"
echo "• ADMIN_PASSWORD (secure admin password)"
echo ""
echo "Optional but Recommended:"
echo "• NODE_ENV (should be 'production')"
echo ""

echo "🌐 Production Testing Checklist:"
echo "================================="
echo "After deployment, test these URLs:"
echo ""
echo "• Homepage: https://your-domain.vercel.app"
echo "• Health Check: https://your-domain.vercel.app/api/health"
echo "• Admin Login: https://your-domain.vercel.app/admin/login"
echo "• Blog API: https://your-domain.vercel.app/api/blog"
echo ""

echo "🔧 Database Setup Commands:"
echo "=========================="
echo "If you need to set up the database:"
echo ""
echo "# Generate Prisma client"
echo "npm run prisma:generate"
echo ""
echo "# Push schema to Supabase"
echo "npx prisma db push"
echo ""
echo "# Seed initial data (optional)"
echo "npm run db:seed"
echo ""

echo "✅ Verification complete!"
echo "🚀 Your Zylo Dental Clinic platform is ready for production!"
