# 📘 Command Reference Guide

Complete guide for all CLI commands used in this NestJS PostgreSQL project.

---

## 🚀 Initial Setup Commands

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Windows - Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE nestjs_app;"

# macOS/Linux
sudo -u postgres psql -c "CREATE DATABASE nestjs_app;"
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env.development

# Edit .env.development with your credentials
# Update: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
```

---

## 🔄 Migration Commands (MOST IMPORTANT)

### Generate Migration from Entity Changes

```bash
# Generates a migration file based on entity changes
npm run migration:generate -- src/database/migrations/YourMigrationName

# Example: After creating User entity
npm run migration:generate -- src/database/migrations/CreateUserTable
```

### Create Empty Migration File

```bash
# Creates an empty migration template for custom SQL
npm run migration:create -- src/database/migrations/YourMigrationName

# Example: For custom data migration
npm run migration:create -- src/database/migrations/SeedInitialData
```

### Run Pending Migrations

```bash
# Executes all pending migrations
npm run migration:run

# This will apply all migrations that haven't been run yet
```

### Revert Last Migration

```bash
# Reverts the most recently executed migration
npm run migration:revert

# Can be run multiple times to revert further back
```

### Check Migration Status

```bash
# Shows which migrations have been run
npm run migration:show

# Output shows:
# [X] MigrationName1 - executed
# [ ] MigrationName2 - pending
```

### Drop Database Schema (DANGER - Development Only)

```bash
# Drops all tables - USE WITH EXTREME CAUTION
npm run schema:drop

# Confirm before running - this deletes all data
```

### Sync Schema Without Migrations (NOT RECOMMENDED)

```bash
# Synchronizes schema - AVOID IN PRODUCTION
npm run schema:sync

# Only use in early development stages
```

---

## 🏃 Running the Application

### Development Mode (Hot Reload)

```bash
# Starts app with automatic reload on file changes
npm run start:dev

# Application runs on: http://localhost:3000/api/v1
```

### Production Build

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

### Debug Mode

```bash
# Runs with debugger attached
npm run start:debug

# Attach debugger in VS Code on port 9229
```

### Standard Start

```bash
# Basic start without watch mode
npm run start
```

---

## 🧪 Testing Commands

### Run All Tests

```bash
npm run test
```

### Watch Mode for Tests

```bash
# Re-runs tests on file changes
npm run test:watch
```

### Test Coverage

```bash
# Generates coverage report
npm run test:cov

# View report in coverage/lcov-report/index.html
```

### Debug Tests

```bash
npm run test:debug
```

### End-to-End Tests

```bash
npm run test:e2e
```

---

## 📝 Code Quality Commands

### Lint Code

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint -- --fix
```

### Format Code

```bash
# Format all files with Prettier
npm run format
```

---

## 🗄️ Database Management Commands

### Direct TypeORM CLI

```bash
# Access TypeORM CLI directly
npm run typeorm -- --help

# Show all available TypeORM commands
```

### Check Database Connection

```bash
# Using psql
psql -U postgres -d nestjs_app -c "SELECT version();"
```

### Backup Database (Development)

```bash
# Windows PowerShell
pg_dump -U postgres -d nestjs_app > backup.sql

# Restore
psql -U postgres -d nestjs_app < backup.sql
```

---

## 📦 NestJS CLI Commands

### Generate Module

```bash
nest g module modules/product
```

### Generate Controller

```bash
nest g controller modules/product
```

### Generate Service

```bash
nest g service modules/product
```

### Generate Complete Resource

```bash
# Creates module, controller, service, entity, DTOs
nest g resource modules/product

# Follow prompts:
# - REST API
# - Generate CRUD entry points? Yes
```

### Generate Guard

```bash
nest g guard common/guards/auth
```

### Generate Interceptor

```bash
nest g interceptor common/interceptors/timeout
```

### Generate Middleware

```bash
nest g middleware common/middleware/logger
```

---

## 🔧 Complete Workflow Examples

### Example 1: Create New Module with Database Table

```bash
# 1. Generate resource
nest g resource modules/product

# 2. Edit product.entity.ts with your schema

# 3. Generate migration
npm run migration:generate -- src/database/migrations/CreateProductTable

# 4. Review migration file in src/database/migrations/

# 5. Run migration
npm run migration:run

# 6. Test
npm run start:dev
```

### Example 2: Add Field to Existing Entity

```bash
# 1. Edit entity file (e.g., user.entity.ts)
# Add: @Column() phoneNumber: string;

# 2. Generate migration
npm run migration:generate -- src/database/migrations/AddPhoneNumberToUser

# 3. Run migration
npm run migration:run

# 4. Test
npm run start:dev
```

### Example 3: Rollback and Fix Migration

```bash
# 1. Revert problematic migration
npm run migration:revert

# 2. Delete migration file
rm src/database/migrations/XXXXX-BadMigration.ts

# 3. Fix entity

# 4. Generate new migration
npm run migration:generate -- src/database/migrations/FixedMigration

# 5. Run migration
npm run migration:run
```

### Example 4: Fresh Database Setup

```bash
# 1. Drop all tables (if needed)
npm run schema:drop

# 2. Run all migrations
npm run migration:run

# 3. Start application
npm run start:dev
```

### Example 5: Production Deployment

```bash
# 1. Build application
npm run build

# 2. Run migrations (on production database)
NODE_ENV=production npm run migration:run

# 3. Start application
NODE_ENV=production npm run start:prod
```

---

## 🐛 Troubleshooting Commands

### Clear Build Cache

```bash
# Remove build artifacts
rm -rf dist

# Rebuild
npm run build
```

### Reinstall Dependencies

```bash
# Remove node_modules
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

### Check PostgreSQL Service

```bash
# Windows PowerShell
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-14

# macOS
brew services list
brew services start postgresql@14

# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Find Process on Port

```bash
# Windows PowerShell - Find process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill process
Stop-Process -Id <ProcessID>
```

### Verify Environment Variables

```bash
# Windows PowerShell
Get-Content .env.development

# Verify they're loaded (in Node.js console)
node -e "require('dotenv').config({path:'.env.development'}); console.log(process.env.DB_NAME)"
```

---

## 📊 Useful Database Queries

### Connect to Database

```bash
psql -U postgres -d nestjs_app
```

### Common SQL Queries (Run in psql)

```sql
-- List all tables
\dt

-- Describe table structure
\d users

-- Check migration history
SELECT * FROM migrations_history;

-- Count records
SELECT COUNT(*) FROM users;

-- View all users
SELECT * FROM users;

-- Exit psql
\q
```

---

## 🎯 Quick Reference

```bash
# Most used commands:
npm install                          # Install dependencies
npm run start:dev                    # Start development server
npm run migration:generate -- src/database/migrations/Name  # Create migration
npm run migration:run                # Apply migrations
npm run migration:revert             # Undo last migration
npm run build                        # Build for production
npm run lint                         # Check code quality
npm run test                         # Run tests

# Database:
psql -U postgres -d nestjs_app       # Connect to database
npm run migration:show               # Check migration status
npm run schema:drop                  # Drop all tables (DEV ONLY)

# Generate code:
nest g resource modules/name         # Generate complete module
nest g service modules/name          # Generate service only
nest g controller modules/name       # Generate controller only
```

---

## 🔐 Environment-Specific Commands

### Development

```bash
NODE_ENV=development npm run start:dev
NODE_ENV=development npm run migration:run
```

### Staging

```bash
NODE_ENV=staging npm run build
NODE_ENV=staging npm run migration:run
NODE_ENV=staging npm run start:prod
```

### Production

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm run migration:run
NODE_ENV=production npm run start:prod
```

---

## 📌 Important Notes

1. **Always** run migrations before starting the application
2. **Never** use `schema:drop` in production
3. **Always** review generated migrations before running
4. **Backup** your database before running migrations in production
5. **Test** migrations in development/staging first
6. **Commit** migration files to version control
7. **Communicate** with team before running shared database migrations

---

**Save this file for quick reference!**
