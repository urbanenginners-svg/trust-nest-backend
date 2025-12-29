# 🎯 Quick Start Guide

Get your NestJS PostgreSQL application running in 5 minutes!

---

## ⚡ Prerequisites Check

```bash
# Verify you have these installed:
node --version   # Should be v18+
npm --version    # Should be v9+
psql --version   # Should be v14+
```

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies (1 min)

```bash
npm install
```

### Step 2: Setup PostgreSQL Database (1 min)

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE nestjs_app;

# Exit (type \q and press enter)
```

### Step 3: Configure Environment (30 seconds)

```bash
# The .env.development file is already created with defaults
# If you used different credentials, edit it:
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
```

### Step 4: Run Initial Migration (30 seconds)

```bash
# Generate migration from User entity
npm run migration:generate -- src/database/migrations/InitialSchema

# Apply migration
npm run migration:run
```

### Step 5: Start Application (10 seconds)

```bash
npm run start:dev
```

---

## ✅ Verify It Works

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Test User API

```bash
# Create a user (PowerShell)
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/v1/users" `
  -ContentType "application/json" `
  -Body '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get all users
curl http://localhost:3000/api/v1/users
```

---

## 📚 What's Next?

1. ✅ **Read README.md** - Comprehensive documentation
2. ✅ **Read COMMANDS.md** - All CLI commands reference
3. ✅ **Explore the code** - Well-commented and production-ready
4. ✅ **Add your own entities** - Follow the workflow in README.md

---

## 🎓 Common Tasks

### Add a New Entity (e.g., Product)

```bash
# 1. Generate resource
nest g resource modules/product

# 2. Edit src/modules/product/product.entity.ts

# 3. Generate migration
npm run migration:generate -- src/database/migrations/CreateProductTable

# 4. Run migration
npm run migration:run
```

### Make Changes to Existing Entity

```bash
# 1. Edit the entity file (e.g., add a column)

# 2. Generate migration
npm run migration:generate -- src/database/migrations/DescribeYourChange

# 3. Run migration
npm run migration:run
```

### Undo Last Migration

```bash
npm run migration:revert
```

---

## 🆘 Troubleshooting

### Can't connect to database?

```bash
# Check if PostgreSQL is running (Windows)
Get-Service postgresql*

# Start it if stopped
Start-Service postgresql-x64-14
```

### Port 3000 already in use?

```bash
# Change PORT in .env.development
PORT=3001
```

### Migration errors?

```bash
# Check status
npm run migration:show

# Drop and recreate (DEV ONLY)
npm run schema:drop
npm run migration:run
```

---

## 📖 Documentation

- **README.md** - Full documentation
- **COMMANDS.md** - All CLI commands
- **This file** - Quick start guide

---

## 🎯 Project Structure Overview

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── config/                    # Configuration files
├── database/                  # Migrations and data-source
├── common/                    # Shared utilities
└── modules/                   # Feature modules
    └── user/                  # User module (example)
```

---

## ✨ Features Included

- ✅ PostgreSQL with TypeORM
- ✅ Migration system (CLI ready)
- ✅ Environment validation
- ✅ Global validation pipes
- ✅ Error handling
- ✅ Logging interceptor
- ✅ User module (example)
- ✅ Production-ready configuration
- ✅ Code quality tools (ESLint, Prettier)

---

**Happy Coding! 🚀**

For detailed information, see README.md
