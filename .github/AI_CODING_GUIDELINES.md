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
  async findAll() {
    return await this.moduleNameService.findAll();
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
  @ApiOperation({ summary: 'Delete an item by ID' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  @ApiResponse({ status: 204, description: 'Item successfully deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async remove(@Param('id') id: string) {
    await this.moduleNameService.remove(id);
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

  async findAll(): Promise<ModuleName[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<ModuleName> {
    const entity = await this.repository.findOne({ where: { id } });
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
    await this.repository.delete(id);
  }
}
```

## Important Rules

### 1. Imports and Dependencies

- Use `@nestjs/swagger` for `PartialType`, not `@nestjs/mapped-types`
- Always import required validation decorators from `class-validator`
- Import `ApiProperty` from `@nestjs/swagger` for all DTO properties

### 2. Swagger Documentation

- Every controller must have `@ApiTags()` decorator
- Every endpoint must have `@ApiOperation()`, `@ApiResponse()` decorators
- Every DTO property must have `@ApiProperty()` with description and example
- Use `@ApiParam()` for path parameters

### 3. Validation

- Always use validation decorators on DTOs
- Use `@IsNotEmpty()`, `@IsString()`, `@IsEmail()`, etc. as appropriate
- Include `@MinLength()`, `@MaxLength()` when relevant

### 4. Database

- Use UUID primary keys: `@PrimaryGeneratedColumn('uuid')`
- Always include `createdAt` and `updatedAt` timestamp columns
- Use descriptive table names in `@Entity('table_name')`
- Use appropriate column types and constraints

### 5. Error Handling

- Use appropriate NestJS exceptions (`NotFoundException`, `BadRequestException`, etc.)
- Always validate entity existence before update/delete operations
- Provide meaningful error messages

### 6. Naming Conventions

- Use PascalCase for classes
- Use camelCase for methods and properties
- Use kebab-case for URLs and file names
- Use snake_case for database table names

### 7. Module Registration

- Always register new modules in `app.module.ts`
- Export services if they need to be used by other modules
- Import `TypeOrmModule.forFeature([Entity])` for database entities

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
5. Add comprehensive Swagger documentation
6. Include validation on all input DTOs
7. Use repository pattern for database operations
8. Export services when they need to be shared

When generating new code, ensure it follows these patterns and integrates seamlessly with the existing codebase.
