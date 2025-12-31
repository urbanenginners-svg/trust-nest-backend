# AI Coding Guidelines

This document provides guidelines for AI assistants (GitHub Copilot, ChatGPT, Claude, etc.) when generating code for this NestJS PostgreSQL project.

## Project Overview

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL with TypeORM
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **Architecture**: Modular structure with separation of concerns

## Project Structure

```
src/
├── main.ts                 # Application entry point with Swagger setup
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── common/                # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Interceptors
│   └── pipes/             # Validation pipes
├── config/                # Configuration files
│   ├── database.config.ts # Database configuration
│   └── env.validation.ts  # Environment validation
├── database/              # Database related files
│   ├── data-source.ts     # TypeORM CLI data source
│   └── migrations/        # Database migrations
└── modules/               # Feature modules
    └── [module-name]/     # Individual modules
        ├── [module-name].module.ts
        ├── [module-name].controller.ts
        ├── [module-name].service.ts
        ├── [module-name].entity.ts
        ├── decorators/    # Swagger decorators (REQUIRED)
        │   └── [module-name].swagger.decorator.ts
        └── dto/
            ├── create-[module-name].dto.ts
            └── update-[module-name].dto.ts
```

## Coding Standards

### 1. Module Structure

When creating a new module, follow this structure:

```typescript
// [module-name].module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleNameController } from './module-name.controller';
import { ModuleNameService } from './module-name.service';
import { ModuleName } from './module-name.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleName])],
  controllers: [ModuleNameController],
  providers: [ModuleNameService],
  exports: [ModuleNameService], // Export if used by other modules
})
export class ModuleNameModule {}
```

### 2. Entity Structure

```typescript
// [module-name].entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('table_name')
export class ModuleName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
```

### 3. DTO Structure

```typescript
// create-[module-name].dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateModuleNameDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Example Name',
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}

// update-[module-name].dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateModuleNameDto } from './create-module-name.dto';

export class UpdateModuleNameDto extends PartialType(CreateModuleNameDto) {}
```

### 4. Controller Structure

```typescript
// [module-name].controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ModuleNameService } from './module-name.service';
import { CreateModuleNameDto } from './dto/create-module-name.dto';
import { UpdateModuleNameDto } from './dto/update-module-name.dto';

@ApiTags('module-names')
@Controller('module-names')
export class ModuleNameController {
  constructor(private readonly moduleNameService: ModuleNameService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(@Body() createDto: CreateModuleNameDto) {
    return await this.moduleNameService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List of all items' })
  async findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return await this.moduleNameService.findAll(includeDeleted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  @ApiResponse({ status: 200, description: 'Item found' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id') id: string) {
    return await this.moduleNameService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item by ID' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  @ApiResponse({ status: 200, description: 'Item successfully updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateModuleNameDto,
  ) {
    return await this.moduleNameService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an item by ID' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  @ApiResponse({ status: 204, description: 'Item successfully soft deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async remove(@Param('id') id: string) {
    await this.moduleNameService.remove(id);
  }

  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted item by ID' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  @ApiResponse({ status: 200, description: 'Item successfully restored' })
  @ApiResponse({ status: 404, description: 'Item not found or not deleted' })
  async restore(@Param('id') id: string) {
    await this.moduleNameService.restore(id);
    return { message: 'Item restored successfully' };
  }
}
```

### 5. Service Structure

```typescript
// [module-name].service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuleNameDto } from './dto/create-module-name.dto';
import { UpdateModuleNameDto } from './dto/update-module-name.dto';
import { ModuleName } from './module-name.entity';

@Injectable()
export class ModuleNameService {
  constructor(
    @InjectRepository(ModuleName)
    private readonly repository: Repository<ModuleName>,
  ) {}

  async create(createDto: CreateModuleNameDto): Promise<ModuleName> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findAll(includeDeleted: boolean = false): Promise<ModuleName[]> {
    return await this.repository.find({
      withDeleted: includeDeleted,
    });
  }

  async findOne(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<ModuleName> {
    const entity = await this.repository.findOne({
      where: { id },
      withDeleted: includeDeleted,
    });
    if (!entity) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return entity;
  }

  async update(
    id: string,
    updateDto: UpdateModuleNameDto,
  ): Promise<ModuleName> {
    await this.findOne(id); // Ensures entity exists
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensures entity exists
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.findOne(id, true); // Ensures entity exists (including soft-deleted)
    await this.repository.restore(id);
  }
}
```

## Important Rules

### 1. Imports and Dependencies

- Use `@nestjs/swagger` for `PartialType`, not `@nestjs/mapped-types`
- Always import required validation decorators from `class-validator`
- Import `ApiProperty` from `@nestjs/swagger` for all DTO properties

### 2. Swagger Documentation

#### Standard Rules

- Every controller must have `@ApiTags()` decorator
- Every DTO property must have `@ApiProperty()` with description and example

#### Decorator Pattern (REQUIRED)

**DO NOT** write inline Swagger decorators in controllers. Instead, create dedicated decorator files:

**Structure:**

```
src/modules/[module-name]/
├── decorators/
│   └── [module-name].swagger.decorator.ts
```

**Implementation Pattern:**

```typescript
// decorators/module-name.swagger.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

export function CreateModuleNameSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new item' }),
    ApiOkResponse({
      status: 201,
      description: 'Item created successfully',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Example Item',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Bad request - validation failed' }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
  );
}

export function FindAllModuleNameSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all items' }),
    ApiOkResponse({ description: 'List of all items' }),
    ApiForbiddenResponse({
      description: 'Forbidden - insufficient permissions',
    }),
  );
}

// ... other CRUD operations
```

**Controller Usage:**

```typescript
// module-name.controller.ts
import {
  CreateModuleNameSwagger,
  FindAllModuleNameSwagger,
} from './decorators/module-name.swagger.decorator';

@Controller('module-name')
export class ModuleNameController {
  @Post()
  @CreateModuleNameSwagger() // Single line decorator
  async create(@Body() createDto: CreateModuleNameDto) {
    return await this.moduleNameService.create(createDto);
  }

  @Get()
  @FindAllModuleNameSwagger() // Single line decorator
  async findAll() {
    return await this.moduleNameService.findAll();
  }
}
```

**Benefits:**

- Clean, maintainable controllers with single-line decorators
- Centralized API documentation configuration
- Reusable decorator components
- Consistent response schemas and error handling

### 3. Response Formatting (REQUIRED)

#### Entity-Based Response Schemas

**DO NOT** write explicit response schemas in Swagger decorators. Use entity types for automatic schema generation:

```typescript
// ❌ BAD - Explicit schema
ApiOkResponse({
  description: 'User created successfully',
  schema: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
});

// ✅ GOOD - Entity-based schema
ApiOkResponse({
  description: 'User created successfully',
  type: User,
});
```

#### Role-Based Field Visibility (REQUIRED)

Use class-transformer decorators on entities to control field visibility:

**Entity Setup:**

```typescript
// user.entity.ts
import { Exclude, Expose, Transform } from 'class-transformer';

export enum UserGroups {
  PUBLIC = 'public', // Basic info for public display
  PROFILE = 'profile', // User's own profile view
  ADMIN = 'admin', // Admin view with sensitive data
  LIST = 'list', // List view for collections
}

@Entity('users')
export class User {
  @Expose({ groups: [UserGroups.PUBLIC, UserGroups.PROFILE, UserGroups.ADMIN] })
  id: string;

  @Expose({ groups: [UserGroups.PUBLIC, UserGroups.PROFILE, UserGroups.ADMIN] })
  name: string;

  @Expose({ groups: [UserGroups.PROFILE, UserGroups.ADMIN] })
  email: string;

  @Exclude() // Never expose password
  password: string;

  @Expose({ groups: [UserGroups.ADMIN] })
  isActive: boolean;
}
```

**Controller Usage:**

```typescript
// user.controller.ts
import { SerializeResponse } from '../../common/decorators/serialize-response.decorator';
import { UserGroups } from './user.entity';

@Controller('users')
export class UserController {
  @Get()
  @SerializeResponse(UserGroups.LIST, UserGroups.PUBLIC) // Multiple groups for different roles
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @SerializeResponse(UserGroups.PROFILE, UserGroups.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
```

**Field Visibility Rules:**

- `PUBLIC`: Basic info visible to everyone
- `PROFILE`: User's own data view
- `ADMIN`: Administrative view with sensitive fields
- `LIST`: Optimized view for collections
- `@Exclude()`: Never expose sensitive fields like passwords

**Response Transformation:**
The system automatically determines user permissions and filters response fields accordingly:

- **Public users**: Only see `PUBLIC` group fields
- **Authenticated users**: See `PUBLIC` + `PROFILE` group fields
- **Admin users**: See all groups including `ADMIN` fields

### 4. Validation

- Always use validation decorators on DTOs
- Use `@IsNotEmpty()`, `@IsString()`, `@IsEmail()`, etc. as appropriate
- Include `@MinLength()`, `@MaxLength()` when relevant

### 5. Database

- Use UUID primary keys: `@PrimaryGeneratedColumn('uuid')`
- Always include `createdAt` and `updatedAt` timestamp columns
- Use descriptive table names in `@Entity('table_name')`
- Use appropriate column types and constraints

### 6. Error Handling

- Use appropriate NestJS exceptions (`NotFoundException`, `BadRequestException`, etc.)
- Always validate entity existence before update/delete operations
- Provide meaningful error messages

### 7. Naming Conventions

- Use PascalCase for classes
- Use camelCase for methods and properties
- Use kebab-case for URLs and file names
- Use snake_case for database table names

### 8. Module Registration

- Always register new modules in `app.module.ts`
- Export services if they need to be used by other modules
- Import `TypeOrmModule.forFeature([Entity])` for database entities

## Soft Delete Implementation Guidelines

This project uses TypeORM's built-in soft delete functionality instead of hard deletes. **ALL new modules MUST implement soft delete patterns.**

### 1. Entity Requirements

**MANDATORY:** Every entity must include `@DeleteDateColumn()`:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('table_name')
export class ModuleName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn() // REQUIRED for soft delete
  deletedAt?: Date;
}
```

**Key Points:**

- `deletedAt` should be optional (`?`)
- TypeORM automatically manages this field
- No need to manually set the timestamp

### 2. Service Implementation

**MANDATORY Patterns:**

```typescript
@Injectable()
export class ModuleNameService {
  constructor(
    @InjectRepository(ModuleName)
    private readonly repository: Repository<ModuleName>,
  ) {}

  // findAll MUST support includeDeleted parameter
  async findAll(includeDeleted: boolean = false): Promise<ModuleName[]> {
    return await this.repository.find({
      withDeleted: includeDeleted, // REQUIRED
    });
  }

  // findOne MUST support includeDeleted parameter
  async findOne(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<ModuleName> {
    const entity = await this.repository.findOne({
      where: { id },
      withDeleted: includeDeleted, // REQUIRED
    });
    if (!entity) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return entity;
  }

  // remove MUST use softDelete, NOT delete
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Validate existence
    await this.repository.softDelete(id); // REQUIRED: Use softDelete
  }

  // restore method MUST be implemented
  async restore(id: string): Promise<void> {
    await this.findOne(id, true); // Include deleted to find soft-deleted items
    await this.repository.restore(id); // REQUIRED: Restore functionality
  }
}
```

**Critical Rules:**

- **NEVER** use `repository.delete()` - always use `repository.softDelete()`
- **ALWAYS** add `withDeleted` option to find operations
- **ALWAYS** implement a `restore()` method
- Default behavior should exclude soft-deleted records (`includeDeleted = false`)

### 3. Controller Implementation

**MANDATORY Patterns:**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Put, // REQUIRED for restore endpoints
} from '@nestjs/common';

@Controller('module-names')
export class ModuleNameController {
  constructor(private readonly moduleNameService: ModuleNameService) {}

  // GET endpoints MUST support includeDeleted query parameter
  @Get()
  async findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return await this.moduleNameService.findAll(includeDeleted);
  }

  // DELETE endpoints perform soft delete
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an item by ID' }) // Update documentation
  async remove(@Param('id') id: string) {
    await this.moduleNameService.remove(id);
  }

  // MANDATORY: Restore endpoint for every module
  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted item by ID' })
  async restore(@Param('id') id: string) {
    await this.moduleNameService.restore(id);
    return { message: 'Item restored successfully' };
  }
}
```

**Required Endpoints:**

- `GET /items?includeDeleted=true` - Get all items including soft-deleted
- `DELETE /items/:id` - Soft delete an item
- `PUT /items/:id/restore` - Restore a soft-deleted item

### 4. Swagger Documentation

Update Swagger decorators to reflect soft delete functionality:

```typescript
// decorators/module-name.swagger.decorator.ts
export function FindAllModuleNameSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all items',
      description: 'Retrieves all items with optional filtering',
    }),
    ApiQuery({
      name: 'includeDeleted',
      required: false,
      type: Boolean,
      description: 'Whether to include soft-deleted items',
      example: false,
    }),
    ApiResponse({
      status: 200,
      description: 'List of all items',
      type: [ModuleName],
    }),
  );
}

export function RemoveModuleNameSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Soft delete an item',
      description: 'Soft deletes an item (sets deletedAt timestamp)',
    }),
    ApiResponse({ status: 204, description: 'Item soft deleted successfully' }),
    ApiResponse({ status: 404, description: 'Item not found' }),
  );
}

export function RestoreModuleNameSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Restore a soft-deleted item',
      description: 'Restores a previously soft-deleted item',
    }),
    ApiResponse({ status: 200, description: 'Item restored successfully' }),
    ApiResponse({ status: 404, description: 'Item not found or not deleted' }),
  );
}
```

### 5. Database Migration

When adding soft delete to existing entities:

```bash
# Generate migration for deletedAt column
npm run migration:generate src/database/migrations/AddSoftDeleteToModuleName

# Example migration content:
export class AddSoftDeleteToModuleName implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if column exists before adding
        const columnExists = await queryRunner.hasColumn('table_name', 'deletedAt');
        if (!columnExists) {
            await queryRunner.query(`ALTER TABLE "table_name" ADD "deletedAt" TIMESTAMP`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "table_name" DROP COLUMN "deletedAt"`);
    }
}
```

### 6. Relationship Handling

When entities have relationships, ensure soft delete behavior is consistent:

```typescript
// Child entity with foreign key
@Entity('comments')
export class Comment {
  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @DeleteDateColumn()
  deletedAt?: Date;
}

// Service method for related data
async findPostComments(postId: string, includeDeleted = false): Promise<Comment[]> {
  return await this.commentRepository.find({
    where: { post: { id: postId } },
    withDeleted: includeDeleted, // Respect soft delete in relationships
    relations: ['post'],
  });
}
```

### 7. Testing Soft Delete

Test scenarios for every soft delete implementation:

```typescript
// Test cases to verify:
describe('ModuleName Soft Delete', () => {
  it('should soft delete item (not remove from database)', async () => {
    // DELETE /items/:id should set deletedAt
    // GET /items should not return the item
    // GET /items?includeDeleted=true should return the item
  });

  it('should restore soft-deleted item', async () => {
    // PUT /items/:id/restore should clear deletedAt
    // GET /items should return the restored item
  });

  it('should handle includeDeleted parameter correctly', async () => {
    // Test both includeDeleted=true and includeDeleted=false
  });
});
```

### 8. Common Anti-Patterns

**❌ DON'T:**

```typescript
// Hard delete - FORBIDDEN
await this.repository.delete(id);

// Missing withDeleted option
await this.repository.find(); // Will miss soft-deleted items when includeDeleted=true

// No restore method
// Every service MUST have restore functionality

// Inline Swagger with hard delete references
@ApiOperation({ summary: 'Delete item permanently' }) // Wrong - we use soft delete
```

**✅ DO:**

```typescript
// Soft delete - REQUIRED
await this.repository.softDelete(id);

// Always use withDeleted option
await this.repository.find({ withDeleted: includeDeleted });

// Always implement restore
async restore(id: string): Promise<void> {
  await this.findOne(id, true);
  await this.repository.restore(id);
}

// Correct Swagger documentation
@ApiOperation({ summary: 'Soft delete item' }) // Correct - reflects actual behavior
```

### 9. Performance Considerations

- Soft-deleted records remain in database - consider periodic cleanup jobs for old data
- Ensure database indexes include `deletedAt` column for optimal query performance
- Use `withDeleted: false` (default) for better performance when soft-deleted data isn't needed

### 10. Soft Delete Checklist

Before marking a module complete, verify:

- [ ] `@DeleteDateColumn()` added to entity
- [ ] `findAll()` method supports `includeDeleted` parameter
- [ ] `findOne()` method supports `includeDeleted` parameter
- [ ] `remove()` method uses `repository.softDelete()`
- [ ] `restore()` method implemented using `repository.restore()`
- [ ] Controller has `?includeDeleted` query parameter support
- [ ] Controller has `PUT /:id/restore` endpoint
- [ ] Swagger decorators updated for soft delete terminology
- [ ] Migration created to add `deletedAt` column
- [ ] All relationship queries respect `withDeleted` option

**This soft delete pattern is MANDATORY for all new modules and should be retrofit to existing modules.**

## Migration Commands

After creating/modifying entities:

```bash
# Generate migration
npm run migration:generate src/database/migrations/YourMigrationName

# Run migrations
npm run migration:run

# Revert migration (if needed)
npm run migration:revert
```

## File Naming Conventions

- Modules: `module-name.module.ts`
- Controllers: `module-name.controller.ts`
- Services: `module-name.service.ts`
- Entities: `module-name.entity.ts`
- DTOs: `create-module-name.dto.ts`, `update-module-name.dto.ts`
- Swagger Decorators: `module-name.swagger.decorator.ts` (in `decorators/` folder)
- Migrations: `YYYYMMDDHHMMSS-description.ts`

## Environment Configuration

The project uses environment variables from `.env` file:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `NODE_ENV`, `PORT`

## Testing Endpoints

After implementation, test endpoints at:

- API: `http://localhost:3000/api/v1`
- Swagger docs: `http://localhost:3000/api/docs`

## Common Patterns to Follow

1. Always use async/await for database operations
2. Implement proper error handling
3. Use TypeScript types consistently
4. Follow the existing project structure
5. **MANDATORY**: Create Swagger decorators in separate files - never inline in controllers
6. Add comprehensive API documentation through dedicated decorator files
7. Include validation on all input DTOs
8. Use repository pattern for database operations
9. Export services when they need to be shared
10. Create single-line decorators for cleaner controller code

When generating new code, ensure it follows these patterns and integrates seamlessly with the existing codebase.
