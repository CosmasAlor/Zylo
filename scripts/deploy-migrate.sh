#!/bin/bash

# Production Database Migration Script
# This script handles database migrations for production deployment

set -e

echo "🚀 Starting production database migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

# Check if PRISMA_SCHEMA is set
if [ -z "$PRISMA_SCHEMA" ]; then
    export PRISMA_SCHEMA="prisma/schema.prisma"
fi

echo "📋 Database URL detected"
echo "📋 Prisma schema: $PRISMA_SCHEMA"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check database connection
echo "🔍 Checking database connection..."
npx prisma db pull --force || {
    echo "❌ ERROR: Failed to connect to database"
    exit 1
}

# Apply migrations
echo "🔄 Applying database migrations..."
npx prisma migrate deploy || {
    echo "❌ ERROR: Failed to apply migrations"
    exit 1
}

# Generate Prisma client again after migration
echo "🔧 Regenerating Prisma client after migration..."
npx prisma generate

# Verify database schema
echo "✅ Verifying database schema..."
npx prisma db pull --force --schema $PRISMA_SCHEMA

echo "✅ Database migration completed successfully!"

# Optional: Seed data if SEED_DB is set to true
if [ "$SEED_DB" = "true" ]; then
    echo "🌱 Seeding database with initial data..."
    npm run db:seed
    echo "✅ Database seeding completed!"
fi

echo "🎉 Production database setup complete!"
