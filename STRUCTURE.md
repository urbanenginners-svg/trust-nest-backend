# 🏗️ Project Structure

Complete folder structure with descriptions.

```
nest_postgress/
│
├── 📁 src/                                    # Source code directory
│   │
│   ├── 📄 main.ts                            # Application entry point
│   │                                          # - Bootstraps NestJS app
│   │                                          # - Configures global pipes, filters
│   │                                          # - Sets up CORS
│   │
│   ├── 📄 app.module.ts                      # Root application module
│   │                                          # - Imports all feature modules
│   │                                          # - Configures TypeORM
│   │                                          # - Sets up ConfigModule
│   │
│   ├── 📄 app.controller.ts                  # Root controller
│   │                                          # - Health check endpoint
│   │                                          # - Welcome message
│   │
│   ├── 📄 app.service.ts                     # Root service
│   │                                          # - Basic app-level logic
│   │
│   ├── 📁 config/                            # Configuration files
│   │   ├── 📄 database.config.ts             # Database configuration factory
│   │   │                                      # - Environment-based DB config
│   │   │                                      # - Connection pool settings
│   │   │                                      # - SSL configuration
│   │   │
│   │   └── 📄 env.validation.ts              # Environment variable validation
│   │                                          # - Validates all env vars on startup
│   │                                          # - Uses class-validator
│   │
│   ├── 📁 database/                          # Database-related files
│   │   ├── 📄 data-source.ts                 # TypeORM DataSource for CLI
│   │   │                                      # - Used by migration commands
│   │   │                                      # - Separate from app config
│   │   │
│   │   └── 📁 migrations/                    # Migration files (auto-generated)
│   │       ├── 📄 1234567890-InitialSchema.ts
│   │       └── 📄 ...                        # New migrations appear here
│   │
│   ├── 📁 common/                            # Shared utilities
│   │   │
│   │   ├── 📁 decorators/                    # Custom decorators
│   │   │   ├── 📄 public.decorator.ts        # Mark routes as public
│   │   │   └── 📄 current-user.decorator.ts  # Extract user from request
│   │   │
│   │   ├── 📁 filters/                       # Exception filters
│   │   │   └── 📄 http-exception.filter.ts   # Standardizes error responses
│   │   │
│   │   ├── 📁 interceptors/                  # Request/Response interceptors
│   │   │   ├── 📄 transform.interceptor.ts   # Wraps responses
│   │   │   └── 📄 logging.interceptor.ts     # Logs all requests
│   │   │
│   │   └── 📁 pipes/                         # Validation pipes
│   │       └── 📄 validation.pipe.ts         # Custom validation logic
│   │
│   └── 📁 modules/                           # Feature modules
│       │
│       └── 📁 user/                          # User module (example)
│           ├── 📄 user.module.ts             # Module definition
│           ├── 📄 user.controller.ts         # HTTP endpoints
│           ├── 📄 user.service.ts            # Business logic
│           ├── 📄 user.entity.ts             # Database entity
│           │
│           └── 📁 dto/                       # Data Transfer Objects
│               ├── 📄 create-user.dto.ts     # For POST requests
│               └── 📄 update-user.dto.ts     # For PATCH requests
│
├── 📁 test/                                   # Test files
│   └── (test files go here)
│
├── 📁 node_modules/                          # Dependencies (auto-generated)
│
├── 📁 dist/                                  # Compiled output (auto-generated)
│
├── 📄 .env.development                       # Development environment vars
├── 📄 .env.example                          # Environment template
│
├── 📄 .gitignore                            # Git ignore rules
├── 📄 .prettierrc                           # Prettier configuration
├── 📄 .eslintrc.js                          # ESLint configuration
│
├── 📄 package.json                          # Dependencies & scripts
├── 📄 package-lock.json                     # Locked dependency versions
│
├── 📄 tsconfig.json                         # TypeScript configuration
├── 📄 nest-cli.json                         # NestJS CLI configuration
│
├── 📄 README.md                             # Main documentation
├── 📄 QUICKSTART.md                         # Quick start guide
├── 📄 COMMANDS.md                           # Command reference
└── 📄 STRUCTURE.md                          # This file
```

---

## 🎯 Key Directories Explained

### `/src` - Source Code

All application source code lives here.

### `/src/config` - Configuration

- Database settings
- Environment validation
- Any app-wide configuration

### `/src/database` - Database Layer

- **data-source.ts**: Used by TypeORM CLI for migrations
- **migrations/**: Auto-generated migration files

### `/src/common` - Shared Code

Reusable code across all modules:

- **decorators/**: Custom parameter decorators
- **filters/**: Exception handling
- **interceptors/**: Request/response transformation
- **pipes/**: Validation and transformation

### `/src/modules` - Feature Modules

Each feature gets its own module:

```
user/
  ├── user.module.ts      # Declares providers, controllers
  ├── user.controller.ts  # HTTP routes
  ├── user.service.ts     # Business logic
  ├── user.entity.ts      # Database schema
  └── dto/                # Request/response schemas
```

---

## 📝 Important Files

### Root Configuration Files

| File            | Purpose                      |
| --------------- | ---------------------------- |
| `package.json`  | Dependencies and NPM scripts |
| `tsconfig.json` | TypeScript compiler settings |
| `nest-cli.json` | NestJS CLI configuration     |
| `.eslintrc.js`  | Code linting rules           |
| `.prettierrc`   | Code formatting rules        |
| `.gitignore`    | Files to exclude from Git    |

### Environment Files

| File               | Purpose                             |
| ------------------ | ----------------------------------- |
| `.env.development` | Local development settings          |
| `.env.staging`     | Staging environment settings        |
| `.env.production`  | Production settings (never commit!) |
| `.env.example`     | Template for team members           |

### Documentation Files

| File            | Purpose                        |
| --------------- | ------------------------------ |
| `README.md`     | Complete project documentation |
| `QUICKSTART.md` | Get started in 5 minutes       |
| `COMMANDS.md`   | All CLI commands reference     |
| `STRUCTURE.md`  | This file - project structure  |

---

## 🔄 File Relationships

### Migration Flow

```
1. Edit Entity → user.entity.ts
2. Generate Migration → npm run migration:generate
3. Migration Created → database/migrations/XXXXX-Name.ts
4. Run Migration → npm run migration:run
5. Database Updated → PostgreSQL tables modified
```

### Request Flow

```
1. HTTP Request → main.ts (global interceptors/pipes)
2. Route Matching → user.controller.ts
3. Validation → DTOs + ValidationPipe
4. Business Logic → user.service.ts
5. Database Query → TypeORM + user.entity.ts
6. Response → Transformed by interceptors
```

### Configuration Flow

```
1. App Starts → main.ts
2. Load Config → app.module.ts → ConfigModule
3. Validate Env → env.validation.ts
4. Configure DB → database.config.ts
5. Connect → TypeORM establishes connection
```

---

## 🏗️ Module Architecture Pattern

Each module follows this pattern:

```typescript
// 1. Entity (Database Schema)
@Entity('users')
class User { ... }

// 2. DTOs (Validation)
class CreateUserDto { ... }
class UpdateUserDto { ... }

// 3. Service (Business Logic)
@Injectable()
class UserService {
  constructor(@InjectRepository(User) private repo) {}
  create() { ... }
  findAll() { ... }
}

// 4. Controller (HTTP Layer)
@Controller('users')
class UserController {
  constructor(private service: UserService) {}
  @Post() create(@Body() dto: CreateUserDto) { ... }
}

// 5. Module (Wiring)
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
class UserModule {}
```

---

## 📦 Adding New Modules

### Quick Generation

```bash
# Generates all files at once
nest g resource modules/product
```

Creates:

```
modules/product/
├── product.module.ts
├── product.controller.ts
├── product.service.ts
├── product.entity.ts
└── dto/
    ├── create-product.dto.ts
    └── update-product.dto.ts
```

### Manual Creation

1. Create folder: `modules/product/`
2. Create entity: `product.entity.ts`
3. Create DTOs: `dto/create-product.dto.ts`
4. Create service: `product.service.ts`
5. Create controller: `product.controller.ts`
6. Create module: `product.module.ts`
7. Import in `app.module.ts`
8. Generate migration
9. Run migration

---

## 🎨 Code Organization Principles

### 1. Separation of Concerns

- **Entities**: Database schema only
- **DTOs**: Validation rules only
- **Services**: Business logic only
- **Controllers**: HTTP handling only

### 2. Dependency Injection

- Inject dependencies via constructor
- Use interfaces for loose coupling
- Export services for cross-module use

### 3. Modularity

- Each feature is self-contained
- Modules can be easily tested
- Modules can be easily removed

### 4. Configuration

- All config comes from environment
- No hardcoded values
- Validated on startup

---

## 🔍 Where to Find Things

| Looking for...               | Check...                                     |
| ---------------------------- | -------------------------------------------- |
| Database connection settings | `config/database.config.ts`                  |
| Environment validation       | `config/env.validation.ts`                   |
| Migration CLI config         | `database/data-source.ts`                    |
| Migration files              | `database/migrations/`                       |
| Error handling               | `common/filters/`                            |
| Request logging              | `common/interceptors/logging.interceptor.ts` |
| Custom decorators            | `common/decorators/`                         |
| User CRUD operations         | `modules/user/`                              |
| App entry point              | `main.ts`                                    |
| Module registration          | `app.module.ts`                              |

---

## 🚀 Scaling This Structure

### Adding More Features

```
modules/
├── user/
├── auth/           # Authentication
├── product/        # Product management
├── order/          # Order processing
├── payment/        # Payment handling
└── notification/   # Email/SMS notifications
```

### Adding Shared Services

```
common/
├── services/
│   ├── email.service.ts
│   ├── logger.service.ts
│   └── cache.service.ts
```

### Adding Guards

```
common/
├── guards/
│   ├── auth.guard.ts
│   └── roles.guard.ts
```

---

**This structure is designed for scalability and maintainability!**
