#!/bin/bash

# Production startup script for NestJS API with database migrations

set -e

echo "🚀 Starting NestJS API in production mode..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please provide a valid PostgreSQL connection string"
    exit 1
fi

echo "📊 Database URL configured"

# Wait for database to be ready (optional, helps with Docker Compose)
echo "⏳ Waiting for database to be ready..."
timeout=30
counter=0

until pg_isready -d "$DATABASE_URL" -q 2>/dev/null || [ $counter -eq $timeout ]; do
    echo "⏱️  Waiting for database... ($counter/$timeout)"
    sleep 1
    ((counter++))
done

if [ $counter -eq $timeout ]; then
    echo "⚠️  Warning: Could not connect to database after ${timeout}s, but continuing..."
    echo "If migrations fail, please check your database connection"
else
    echo "✅ Database is ready"
fi

# Run database migrations
echo "🔄 Running database migrations..."
if bun run db:migrate; then
    echo "✅ Database migrations completed successfully"
else
    echo "❌ Database migrations failed!"
    echo "Please check your database connection and migration files"
    exit 1
fi

# Start the application
echo "🌟 Starting NestJS application..."
exec node dist/main.js
