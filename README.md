# NestJS PostgreSQL Application

A production-ready NestJS application with PostgreSQL database, TypeORM migrations, and comprehensive validation.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Migration Guide](#migration-guide)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher (LTS recommended)
- **npm**: v9.x or higher (comes with Node.js)
- **PostgreSQL**: v14.x or higher
- **Git**: Latest version

### Check Your Versions

```bash
node --version
npm --version
psql --version
```

---

## 🚀 Project Setup

### 1. Clone or Create the Project

If cloning:

```bash
git clone <repository-url>
cd nest_postgress
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- NestJS core modules
- TypeORM and PostgreSQL driver
- Validation libraries (class-validator, class-transformer)
- Configuration modules

### 3. NestJS Version

This project uses:

- **NestJS**: ^10.3.0
- **TypeORM**: ^0.3.19
- **Node.js**: ^18.0.0

---

## 💾 Database Setup

### 1. Install PostgreSQL

**Windows:**

```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**macOS:**

```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nestjs_app;

# Create user (optional)
CREATE USER nestjs_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nestjs_app TO nestjs_user;

# Exit
\q
```

### 3. Verify Connection

```bash
psql -U postgres -d nestjs_app -c "SELECT version();"
```

---

## ⚙️ Environment Configuration

### 1. Create Environment Files

Create `.env.development` for local development:

```bash
# .env.development
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=nestjs_app
```

Create `.env.staging` for staging:

```bash
# .env.staging
NODE_ENV=staging
PORT=3000

DB_HOST=your_staging_host
DB_PORT=5432
DB_USERNAME=your_staging_user
DB_PASSWORD=your_staging_password
DB_NAME=nestjs_app_staging
```

Create `.env.production` for production:

```bash
# .env.production
NODE_ENV=production
PORT=3000

DB_HOST=your_production_host
DB_PORT=5432
DB_USERNAME=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=nestjs_app_production
```

### 2. Important Notes

- ✅ **NEVER** commit `.env` files to Git
- ✅ Use `.env.example` as a template
- ✅ Store production secrets in a secure vault (AWS Secrets Manager, Azure Key Vault, etc.)
- ✅ Validate all environment variables on startup (already configured)

---

## 🔄 Migration Guide

TypeORM migrations allow you to version control your database schema changes. This project is configured to use migrations exclusively (synchronize is disabled).

### Migration Scripts

```bash
# Generate a new migration based on entity changes
npm run migration:generate -- src/database/migrations/MigrationName

# Create an empty migration file
npm run migration:create -- src/database/migrations/MigrationName

# Run all pending migrations
npm run migration:run

# Revert the last executed migration
npm run migration:revert

# Show migration status
npm run migration:show

# Drop all tables (DEVELOPMENT ONLY - DESTRUCTIVE)
npm run schema:drop

# Sync schema without migrations (NOT RECOMMENDED)
npm run schema:sync
```

### Step-by-Step Migration Workflow

#### 1️⃣ Initial Migration (First Time Setup)

After setting up your database, generate the initial migration:

```bash
# Generate migration from User entity
npm run migration:generate -- src/database/migrations/InitialSchema

# Run the migration
npm run migration:run
```

This creates the `users` table with all columns defined in the User entity.

#### 2️⃣ Adding a New Entity

**Example: Adding a Post entity**

1. Create the entity file:

```typescript
// src/modules/post/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  author: User;
}
```

2. Generate migration:

```bash
npm run migration:generate -- src/database/migrations/CreatePostTable
```

3. Review the generated migration file in `src/database/migrations/`

4. Run the migration:

```bash
npm run migration:run
```

#### 3️⃣ Modifying an Existing Entity

**Example: Adding a field to User**

1. Update the entity:

```typescript
// src/modules/user/user.entity.ts
@Column({ nullable: true })
phoneNumber: string;
```

2. Generate migration:

```bash
npm run migration:generate -- src/database/migrations/AddPhoneNumberToUser
```

3. Run migration:

```bash
npm run migration:run
```

#### 4️⃣ Reverting a Migration

If you need to undo the last migration:

```bash
npm run migration:revert
```

This will execute the `down` method of the most recent migration.

#### 5️⃣ Removing a Migration Safely

**Before running the migration:**

- Simply delete the migration file from `src/database/migrations/`

**After running the migration:**

```bash
# Revert it first
npm run migration:revert

# Then delete the file
rm src/database/migrations/1234567890-MigrationName.ts
```

### Migration Best Practices

✅ **DO:**

- Always generate migrations for schema changes
- Review generated migrations before running them
- Test migrations in development/staging before production
- Keep migrations small and focused
- Add descriptive names to migrations
- Commit migrations to version control

❌ **DON'T:**

- Modify migrations after they've been run in production
- Use `synchronize: true` in production
- Delete migrations that have been deployed
- Make manual database schema changes
- Skip migration testing

### Common Migration Mistakes & Fixes

#### ❌ Mistake 1: Modified entity but migration fails to generate

**Problem:** No changes detected

```bash
No changes in database schema were found
```

**Solution:**

- Ensure entity is imported in a module
- Check DataSource entity paths in `data-source.ts`
- Rebuild the project: `npm run build`

#### ❌ Mistake 2: Migration runs on wrong database

**Problem:** Migration ran on production instead of development

**Solution:**

- Always check your `NODE_ENV` environment variable
- Use separate `.env` files per environment
- Add confirmation prompts for production deployments

#### ❌ Mistake 3: Migration conflicts

**Problem:** Multiple developers created migrations simultaneously

**Solution:**

- Communicate with your team
- Revert local migration, pull latest, regenerate
- Use migration timestamps to resolve conflicts

#### ❌ Mistake 4: Database out of sync

**Problem:** Schema doesn't match entities

**Solution (Development Only):**

```bash
# Drop and recreate
npm run schema:drop
npm run migration:run
```

**Solution (Production):**

- Never drop schemas in production
- Create a new migration to fix inconsistencies
- Test thoroughly in staging first

---

## 👨‍💻 Development Workflow

### Running the Application

```bash
# Development mode (with hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:cov
```

### Team Development Workflow

#### Adding a New Feature with Database Changes

1. **Create a new branch**

```bash
git checkout -b feature/add-comments
```

2. **Create entity and module**

```bash
# Create module
nest g module modules/comment
nest g service modules/comment
nest g controller modules/comment

# Add entity in src/modules/comment/comment.entity.ts
```

3. **Generate migration**

```bash
npm run migration:generate -- src/database/migrations/CreateCommentTable
```

4. **Test migration**

```bash
npm run migration:run
npm run start:dev
```

5. **Commit changes**

```bash
git add .
git commit -m "feat: add comment module with database migration"
```

6. **Push and create PR**

```bash
git push origin feature/add-comments
```

### When to Generate Migrations

Generate a migration when you:

- ✅ Add a new entity
- ✅ Add/remove/modify columns
- ✅ Add/remove/modify indexes
- ✅ Change column types
- ✅ Add/remove constraints (unique, foreign key, etc.)
- ✅ Rename tables or columns

### Best Practices for Teams

1. **Communication**
   - Announce database changes in team chat
   - Document migration purpose in PR description
   - Notify team before running migrations in shared environments

2. **Migration Naming**
   - Use descriptive names: `AddEmailIndexToUser` instead of `Update1`
   - Include ticket/issue number: `JIRA-123-AddUserRoles`

3. **Code Review**
   - Always review generated migrations
   - Check both `up` and `down` methods
   - Verify data migration logic

4. **Deployment**
   - Run migrations before deploying new code
   - Have a rollback plan
   - Monitor migration execution in production

---

## 📚 API Documentation

### Base URL

```
Local: http://localhost:3000/api/v1
```

### Available Endpoints

#### Health Check

```http
GET /api/v1/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

#### User Endpoints

**Create User**

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Get All Users**

```http
GET /api/v1/users
```

**Get User by ID**

```http
GET /api/v1/users/:id
```

**Update User**

```http
PATCH /api/v1/users/:id
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

**Delete User**

```http
DELETE /api/v1/users/:id
```

### Error Response Format

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Validation failed",
  "errors": [
    {
      "property": "email",
      "constraints": {
        "isEmail": "email must be an email"
      }
    }
  ]
}
```

---

## 🎯 Best Practices

### Configuration

- ✅ Use `ConfigModule` for all configuration
- ✅ Validate environment variables on startup
- ✅ Never hardcode credentials
- ✅ Use different configs for each environment

### Validation

- ✅ Always use DTOs with validation decorators
- ✅ Use `class-validator` and `class-transformer`
- ✅ Enable global validation pipe
- ✅ Provide clear error messages

### Database

- ✅ Use migrations for schema changes
- ✅ Never use `synchronize` in production
- ✅ Use connection pooling
- ✅ Index frequently queried columns

### Code Organization

- ✅ Follow modular architecture
- ✅ One entity per module
- ✅ Keep services focused and testable
- ✅ Use dependency injection

### Security

- ✅ Hash passwords (add bcrypt in production)
- ✅ Use environment variables for secrets
- ✅ Enable CORS with specific origins
- ✅ Implement rate limiting (add @nestjs/throttler)
- ✅ Sanitize user inputs

### Error Handling

- ✅ Use custom exception filters
- ✅ Log errors properly
- ✅ Return consistent error formats
- ✅ Don't expose sensitive information

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. Check if PostgreSQL is running:

```bash
# Windows
Get-Service postgresql*

# macOS/Linux
sudo systemctl status postgresql
```

2. Verify credentials in `.env` file
3. Check PostgreSQL port (default: 5432)
4. Ensure database exists

### Migration Issues

**Problem:** Migration already exists

```
QueryFailedError: relation "users" already exists
```

**Solution:**

```bash
# Check migration status
npm run migration:show

# If needed, revert and re-run
npm run migration:revert
npm run migration:run
```

**Problem:** Entity changes not detected

```
No changes in database schema were found
```

**Solution:**

```bash
# Rebuild the project
npm run build

# Try generating again
npm run migration:generate -- src/database/migrations/MigrationName
```

### Port Already in Use

**Problem:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```powershell
# Windows - find and kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change PORT in .env file
PORT=3001
```

### Module Not Found

**Problem:**

```
Error: Cannot find module '@/config/database.config'
```

**Solution:**

```bash
# Rebuild project
npm run build

# Clear cache
rm -rf dist node_modules
npm install
```

---

## 📦 Folder Structure

```
nest_postgress/
├── src/
│   ├── app.module.ts              # Root module
│   ├── main.ts                    # Application entry point
│   ├── config/
│   │   ├── database.config.ts     # Database configuration factory
│   │   └── env.validation.ts      # Environment variable validation
│   ├── database/
│   │   ├── data-source.ts         # TypeORM DataSource for migrations
│   │   └── migrations/            # Migration files (auto-generated)
│   ├── common/
│   │   ├── decorators/            # Custom decorators
│   │   ├── filters/               # Exception filters
│   │   ├── interceptors/          # Request/response interceptors
│   │   └── pipes/                 # Validation pipes
│   ├── modules/
│   │   └── user/                  # User module
│   │       ├── user.entity.ts     # User entity
│   │       ├── user.service.ts    # Business logic
│   │       ├── user.controller.ts # HTTP endpoints
│   │       ├── user.module.ts     # Module definition
│   │       └── dto/               # Data Transfer Objects
│   ├── app.controller.ts          # Root controller
│   └── app.service.ts             # Root service
├── .env.development               # Development environment variables
├── .env.example                   # Environment template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Generate migrations if needed
5. Submit a pull request

---

## 📄 License

MIT

---

## 🆘 Support

For issues and questions:

- Check this README first
- Review the [NestJS Documentation](https://docs.nestjs.com)
- Review the [TypeORM Documentation](https://typeorm.io)
- Open an issue in the repository

---

**Built with ❤️ using NestJS and TypeORM**
