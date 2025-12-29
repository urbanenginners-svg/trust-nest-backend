# 🚀 Complete Setup & Usage Guide

This guide walks you through every step from zero to a running application.

---

## 📋 Part 1: Prerequisites Installation

### Windows Setup

#### 1. Install Node.js

```powershell
# Download and install from https://nodejs.org/
# Or use Chocolatey
choco install nodejs-lts

# Verify installation
node --version  # Should show v18.x or higher
npm --version   # Should show v9.x or higher
```

#### 2. Install PostgreSQL

```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql

# Verify installation
psql --version
```

#### 3. Install Git (Optional)

```powershell
# Download from https://git-scm.com/
# Or use Chocolatey
choco install git

# Verify installation
git --version
```

---

## 📦 Part 2: Project Setup

### Step 1: Navigate to Project Directory

```powershell
cd d:\test\nest_postgress
```

### Step 2: Install Dependencies

```powershell
# This will install all packages from package.json
npm install

# Wait for installation to complete (may take 2-3 minutes)
```

**Expected Output:**

```
added 847 packages in 2m
```

### Step 3: Verify Installation

```powershell
# Run the verification script
.\verify-setup.ps1
```

This will check:

- ✅ Node.js version
- ✅ npm version
- ✅ PostgreSQL installation
- ✅ Dependencies installed
- ✅ Environment configuration

---

## 🗄️ Part 3: Database Setup

### Step 1: Start PostgreSQL Service

```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-14  # Adjust version number if different
```

### Step 2: Create Database

```powershell
# Open PostgreSQL command line
psql -U postgres

# You'll be prompted for the postgres password
# Enter the password you set during PostgreSQL installation
```

In the PostgreSQL prompt (`postgres=#`):

```sql
-- Create the database
CREATE DATABASE nestjs_app;

-- Verify it was created
\l

-- Exit PostgreSQL
\q
```

### Step 3: Test Database Connection

```powershell
# Connect to the new database
psql -U postgres -d nestjs_app

# Should connect successfully
# Type \q to exit
```

---

## ⚙️ Part 4: Environment Configuration

### Step 1: Review Environment File

The `.env.development` file is already created with default values:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_app
```

### Step 2: Update If Needed

If you used different credentials during PostgreSQL setup, edit `.env.development`:

```powershell
# Open in notepad
notepad .env.development

# Or use VS Code
code .env.development
```

**Update these values if different:**

- `DB_PASSWORD` - Your PostgreSQL password
- `DB_USERNAME` - Your PostgreSQL username (default: postgres)
- `DB_NAME` - Your database name (default: nestjs_app)

---

## 🔄 Part 5: Migration Setup

### Step 1: Generate Initial Migration

```powershell
# Generate migration from User entity
npm run migration:generate -- src/database/migrations/InitialSchema
```

**Expected Output:**

```
Migration src/database/migrations/1234567890-InitialSchema.ts has been generated successfully.
```

### Step 2: Review Generated Migration

```powershell
# List migration files
Get-ChildItem src\database\migrations\

# View the migration
code src\database\migrations\*-InitialSchema.ts
```

The migration should create the `users` table with all columns.

### Step 3: Run Migration

```powershell
npm run migration:run
```

**Expected Output:**

```
query: SELECT * FROM current_schema()
query: SHOW server_version;
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'migrations_history'
query: CREATE TABLE "migrations_history" ...
query: SELECT * FROM "migrations_history" "migrations_history" ORDER BY "id" DESC
query: START TRANSACTION
query: CREATE TABLE "users" ...
query: COMMIT
Migration InitialSchema has been executed successfully.
```

### Step 4: Verify Database Schema

```powershell
# Connect to database
psql -U postgres -d nestjs_app

# View tables
\dt

# Describe users table
\d users

# Should show:
# - id (uuid)
# - name (varchar)
# - email (varchar)
# - password (varchar)
# - createdAt (timestamp)
# - updatedAt (timestamp)

# Exit
\q
```

---

## 🚀 Part 6: Start Application

### Step 1: Start in Development Mode

```powershell
npm run start:dev
```

**Expected Output:**

```
[Nest] 12345  - 12/26/2025, 3:45:23 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/26/2025, 3:45:23 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 12/26/2025, 3:45:23 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 12/26/2025, 3:45:23 PM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 12345  - 12/26/2025, 3:45:23 PM     LOG [InstanceLoader] UserModule dependencies initialized
[Nest] 12345  - 12/26/2025, 3:45:23 PM     LOG [NestApplication] Nest application successfully started
🚀 Application is running on: http://localhost:3000/api/v1
📚 Environment: development
💾 Database: nestjs_app
```

**The application is now running!** ✅

### Step 2: Verify Application is Running

Open a new PowerShell window (keep the app running in the first):

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/health"
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-12-26T15:45:23.456Z",
  "uptime": 123.456
}
```

---

## 🧪 Part 7: Test API Endpoints

### Using PowerShell

#### Create a User

```powershell
$body = @{
    name = "John Doe"
    email = "john.doe@example.com"
    password = "SecurePassword123"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/v1/users" `
    -ContentType "application/json" `
    -Body $body
```

**Expected Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2025-12-26T15:45:23.456Z",
  "updatedAt": "2025-12-26T15:45:23.456Z"
}
```

#### Get All Users

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users"
```

#### Get User by ID

```powershell
$userId = "550e8400-e29b-41d4-a716-446655440000"  # Replace with actual ID
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users/$userId"
```

#### Update User

```powershell
$userId = "550e8400-e29b-41d4-a716-446655440000"  # Replace with actual ID
$body = @{
    name = "John Doe Updated"
} | ConvertTo-Json

Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/api/v1/users/$userId" `
    -ContentType "application/json" `
    -Body $body
```

#### Delete User

```powershell
$userId = "550e8400-e29b-41d4-a716-446655440000"  # Replace with actual ID
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/api/v1/users/$userId"
```

### Using REST Client (VS Code Extension)

1. Install REST Client extension in VS Code
2. Open `api-tests.http`
3. Click "Send Request" above each request

---

## 📊 Part 8: View Data in Database

### Using psql

```powershell
# Connect to database
psql -U postgres -d nestjs_app

# View all users
SELECT * FROM users;

# Count users
SELECT COUNT(*) FROM users;

# View migration history
SELECT * FROM migrations_history;

# Exit
\q
```

### Using pgAdmin (Optional)

1. Open pgAdmin (if installed)
2. Connect to localhost
3. Navigate to: Servers → PostgreSQL 14 → Databases → nestjs_app → Schemas → public → Tables
4. Right-click on `users` → View/Edit Data → All Rows

---

## 🔧 Part 9: Development Workflow

### Making Changes to User Entity

1. **Edit the Entity**

```powershell
code src\modules\user\user.entity.ts
```

Add a new field:

```typescript
@Column({ nullable: true })
phoneNumber: string;
```

2. **Generate Migration**

```powershell
npm run migration:generate -- src/database/migrations/AddPhoneNumberToUser
```

3. **Review Migration**

```powershell
code src\database\migrations\*-AddPhoneNumberToUser.ts
```

4. **Run Migration**

```powershell
npm run migration:run
```

5. **Verify in Database**

```powershell
psql -U postgres -d nestjs_app -c "\d users"
```

The application will automatically reload (hot-reload is enabled).

### Adding a New Entity (e.g., Post)

1. **Generate Resource**

```powershell
nest g resource modules/post
```

Choose:

- Transport layer: REST API
- CRUD entry points: Yes

2. **Edit Entity**

```powershell
code src\modules\post\post.entity.ts
```

3. **Generate Migration**

```powershell
npm run migration:generate -- src/database/migrations/CreatePostTable
```

4. **Run Migration**

```powershell
npm run migration:run
```

---

## 🛑 Part 10: Stopping the Application

### Stop Development Server

In the terminal where `npm run start:dev` is running:

- Press `Ctrl + C`
- Confirm with `Y` if prompted

### Stop PostgreSQL Service

```powershell
Stop-Service postgresql-x64-14
```

---

## 🔄 Part 11: Restarting Everything

### Quick Start

```powershell
# Start PostgreSQL
Start-Service postgresql-x64-14

# Navigate to project
cd d:\test\nest_postgress

# Start application
npm run start:dev
```

---

## ❌ Part 12: Troubleshooting

### Issue: Port 3000 Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution 1: Kill Process**

```powershell
# Find process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill it
Stop-Process -Id <ProcessID>
```

**Solution 2: Change Port**

```powershell
# Edit .env.development
notepad .env.development

# Change: PORT=3001
```

### Issue: Cannot Connect to Database

**Error:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Start if stopped
Start-Service postgresql-x64-14

# Verify connection
psql -U postgres -d nestjs_app
```

### Issue: Migration Fails

**Error:**

```
QueryFailedError: relation "users" already exists
```

**Solution:**

```powershell
# Check migration status
npm run migration:show

# If already run, skip
# If you want fresh start (DEVELOPMENT ONLY):
npm run schema:drop
npm run migration:run
```

### Issue: Wrong Password

**Error:**

```
password authentication failed for user "postgres"
```

**Solution:**

```powershell
# Update .env.development with correct password
notepad .env.development

# Update DB_PASSWORD=your_actual_password
```

---

## 📚 Part 13: Next Steps

### Learn More

- Read `README.md` for comprehensive documentation
- Check `COMMANDS.md` for all available commands
- Review `STRUCTURE.md` to understand the project layout
- See `CONTRIBUTING.md` for team guidelines

### Enhance the Application

- Add authentication (JWT)
- Add authorization (roles/permissions)
- Add more entities (posts, comments, etc.)
- Add unit tests
- Add e2e tests
- Set up CI/CD
- Add API documentation (Swagger)

### Production Deployment

- Set up production database
- Configure production environment
- Set up monitoring
- Configure backups
- Test migration rollbacks
- Set up SSL certificates

---

## ✅ Success Checklist

- [ ] Node.js and npm installed
- [ ] PostgreSQL installed and running
- [ ] Project dependencies installed
- [ ] Database created
- [ ] Environment configured
- [ ] Initial migration generated and run
- [ ] Application starts without errors
- [ ] Health check endpoint responds
- [ ] Can create a user via API
- [ ] Can view users in database

**If all items are checked, you're ready to develop! 🎉**

---

## 🆘 Getting Help

1. Check the troubleshooting section above
2. Review error messages carefully
3. Consult the README.md
4. Search for similar issues online
5. Check NestJS/TypeORM documentation

---

**You're all set! Happy coding! 🚀**
