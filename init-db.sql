-- Initialize database with proper settings for yt2gif
-- This script runs when the PostgreSQL container first starts

-- Ensure database exists (should already be created by POSTGRES_DB)
SELECT 'CREATE DATABASE yt2gif' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'yt2gif');

-- Set timezone
SET timezone = 'UTC';

-- Create extensions if needed (for future use)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- The actual tables will be created by Prisma migrations