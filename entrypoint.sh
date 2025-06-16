#!/bin/sh

echo "⏳ Waiting for database..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "✅ Database is up. Running Prisma migrations..."
npx prisma migrate deploy

echo "🚀 Starting NestJS app..."
npm run  start:dev