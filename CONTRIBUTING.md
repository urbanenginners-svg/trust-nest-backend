# 🤝 Contributing Guide

Guidelines for contributing to this NestJS PostgreSQL project.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Database Changes](#database-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Common Patterns](#common-patterns)

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone <your-fork-url>
cd nest_postgress

# Add upstream remote
git remote add upstream <original-repo-url>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
# Copy and configure environment file
cp .env.example .env.development

# Edit .env.development with your database credentials
```

### 4. Setup Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE nestjs_app;"

# Run migrations
npm run migration:run
```

### 5. Start Development Server

```bash
npm run start:dev
```

---

## 💻 Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:

- `feature/add-authentication`
- `fix/user-validation-error`
- `refactor/database-service`
- `docs/update-readme`

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
style:    # Code style (formatting, no logic change)
refactor: # Code refactoring
test:     # Adding tests
chore:    # Maintenance

# Examples
git commit -m "feat(user): add email verification"
git commit -m "fix(auth): resolve token expiration bug"
git commit -m "docs(readme): update setup instructions"
git commit -m "refactor(database): optimize query performance"
```

---

## 📏 Code Standards

### TypeScript Style

```typescript
// ✅ DO: Use explicit types
function createUser(name: string, email: string): Promise<User> {
  // implementation
}

// ❌ DON'T: Avoid 'any' type
function createUser(data: any) {
  // implementation
}

// ✅ DO: Use interfaces for objects
interface CreateUserDto {
  name: string;
  email: string;
}

// ✅ DO: Use async/await
async function getUsers(): Promise<User[]> {
  return await this.userRepository.find();
}

// ❌ DON'T: Use .then() chains
function getUsers() {
  return this.userRepository.find().then((users) => users);
}
```

### NestJS Patterns

```typescript
// ✅ DO: Use dependency injection
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}

// ✅ DO: Use DTOs for validation
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

// ✅ DO: Handle errors properly
async findOne(id: string): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  return user;
}
```

### Code Organization

```typescript
// File: user.service.ts
// Order: Imports → Decorators → Constructor → Public Methods → Private Methods

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  // 1. Constructor
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 2. Public methods
  async create(createUserDto: CreateUserDto): Promise<User> {
    // implementation
  }

  async findAll(): Promise<User[]> {
    // implementation
  }

  // 3. Private methods
  private async validateEmail(email: string): Promise<void> {
    // implementation
  }
}
```

### Documentation

```typescript
// ✅ DO: Add JSDoc comments for public methods
/**
 * Creates a new user in the database
 * @param createUserDto - User creation data
 * @returns Created user entity
 * @throws ConflictException if email already exists
 */
async create(createUserDto: CreateUserDto): Promise<User> {
  // implementation
}

// ✅ DO: Add inline comments for complex logic
// Calculate user's age based on birthdate
const age = differenceInYears(new Date(), user.birthdate);
```

---

## 🗄️ Database Changes

### Adding a New Entity

1. **Create Entity File**

```typescript
// src/modules/post/post.entity.ts
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

2. **Generate Module**

```bash
nest g module modules/post
nest g service modules/post
nest g controller modules/post
```

3. **Generate Migration**

```bash
npm run migration:generate -- src/database/migrations/CreatePostTable
```

4. **Review Migration**

- Check both `up()` and `down()` methods
- Verify SQL is correct
- Ensure indexes are created

5. **Run Migration**

```bash
npm run migration:run
```

6. **Commit Changes**

```bash
git add .
git commit -m "feat(post): add post entity and module with migration"
```

### Modifying Existing Entity

1. **Update Entity**

```typescript
// Add new column
@Column({ nullable: true })
phoneNumber: string;
```

2. **Generate Migration**

```bash
npm run migration:generate -- src/database/migrations/AddPhoneNumberToUser
```

3. **Test Migration**

```bash
# Run migration
npm run migration:run

# Verify in database
psql -U postgres -d nestjs_app -c "\d users"

# Test rollback
npm run migration:revert

# Re-run
npm run migration:run
```

4. **Commit**

```bash
git add .
git commit -m "feat(user): add phone number field"
```

### Migration Best Practices

✅ **DO:**

- Always generate migrations for schema changes
- Review generated SQL before running
- Test migrations locally first
- Implement both `up()` and `down()` methods
- Use descriptive migration names
- Commit migrations with code changes

❌ **DON'T:**

- Modify migrations after they're deployed
- Use `synchronize: true` in production
- Make manual database changes
- Skip testing migrations
- Delete deployed migrations

---

## 🧪 Testing

### Unit Tests

```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should return all users', async () => {
    const users = [{ id: '1', name: 'John' }];
    jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);

    expect(await service.findAll()).toBe(users);
  });
});
```

### Run Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch
```

---

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation updated
- [ ] Migrations generated and tested
- [ ] No merge conflicts with main

### Creating Pull Request

1. **Push to Your Fork**

```bash
git push origin feature/your-feature-name
```

2. **Create PR on GitHub**

- Use descriptive title
- Fill out PR template
- Link related issues
- Add screenshots if UI changes

3. **PR Template**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How was this tested?

## Database Changes

- [ ] Migration included
- [ ] Migration tested
- [ ] Rollback tested

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Code Review

- Respond to feedback promptly
- Make requested changes
- Update PR description if scope changes
- Be respectful and professional

---

## 🎯 Common Patterns

### Creating a CRUD Module

```bash
# Generate resource (auto-creates everything)
nest g resource modules/product

# Follow prompts:
# ? What transport layer do you use? REST API
# ? Would you like to generate CRUD entry points? Yes
```

### Adding Relationships

```typescript
// One-to-Many
@Entity('posts')
export class Post {
  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}

@Entity('users')
export class User {
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```

### Custom Validators

```typescript
// dto/create-user.dto.ts
import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
```

### Error Handling

```typescript
// Use built-in exceptions
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid email');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Access denied');

// Custom exceptions
export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}
```

---

## 📞 Getting Help

- Check existing documentation (README.md, COMMANDS.md, etc.)
- Search existing issues on GitHub
- Ask in team chat/Slack
- Create a new issue with details

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

**Thank you for contributing! 🎉**
