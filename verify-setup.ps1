# NestJS PostgreSQL Setup Verification Script
# Run this script to verify your environment is correctly configured

Write-Host "`n🔍 NestJS PostgreSQL Setup Verification`n" -ForegroundColor Cyan

$errors = 0
$warnings = 0

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $nodeMajorVersion = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
    
    if ($nodeMajorVersion -ge 18) {
        Write-Host "  ✅ Node.js $nodeVersion (OK)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Node.js $nodeVersion (Recommended: v18+)" -ForegroundColor Yellow
        $warnings++
    }
} catch {
    Write-Host "  ❌ Node.js not found" -ForegroundColor Red
    $errors++
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm $npmVersion (OK)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm not found" -ForegroundColor Red
    $errors++
}

# Check PostgreSQL
Write-Host "`nChecking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "  ✅ PostgreSQL installed: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ PostgreSQL not found (psql command not available)" -ForegroundColor Red
    Write-Host "     Install from: https://www.postgresql.org/download/" -ForegroundColor Gray
    $errors++
}

# Check PostgreSQL Service
Write-Host "`nChecking PostgreSQL Service..." -ForegroundColor Yellow
try {
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($pgService) {
        if ($pgService.Status -eq "Running") {
            Write-Host "  ✅ PostgreSQL service is running" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  PostgreSQL service exists but is not running" -ForegroundColor Yellow
            Write-Host "     Start it with: Start-Service $($pgService.Name)" -ForegroundColor Gray
            $warnings++
        }
    } else {
        Write-Host "  ⚠️  PostgreSQL service not found" -ForegroundColor Yellow
        $warnings++
    }
} catch {
    Write-Host "  ⚠️  Could not check PostgreSQL service status" -ForegroundColor Yellow
    $warnings++
}

# Check if node_modules exists
Write-Host "`nChecking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✅ node_modules folder exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  node_modules not found. Run: npm install" -ForegroundColor Yellow
    $warnings++
}

# Check if .env.development exists
Write-Host "`nChecking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.development") {
    Write-Host "  ✅ .env.development exists" -ForegroundColor Green
    
    # Check if environment variables are set
    $envContent = Get-Content ".env.development" -Raw
    $requiredVars = @("NODE_ENV", "PORT", "DB_HOST", "DB_PORT", "DB_USERNAME", "DB_PASSWORD", "DB_NAME")
    
    foreach ($var in $requiredVars) {
        if ($envContent -match "$var=") {
            Write-Host "    ✅ $var is set" -ForegroundColor Green
        } else {
            Write-Host "    ❌ $var is missing" -ForegroundColor Red
            $errors++
        }
    }
} else {
    Write-Host "  ❌ .env.development not found" -ForegroundColor Red
    Write-Host "     Copy .env.example to .env.development and configure it" -ForegroundColor Gray
    $errors++
}

# Check TypeScript
Write-Host "`nChecking TypeScript..." -ForegroundColor Yellow
try {
    $tscVersion = npx tsc --version
    Write-Host "  ✅ TypeScript: $tscVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  TypeScript not found (will be installed with npm install)" -ForegroundColor Yellow
    $warnings++
}

# Check NestJS CLI
Write-Host "`nChecking NestJS CLI..." -ForegroundColor Yellow
try {
    $nestVersion = npx nest --version
    Write-Host "  ✅ NestJS CLI: $nestVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  NestJS CLI not found (will be installed with npm install)" -ForegroundColor Yellow
    $warnings++
}

# Check Git
Write-Host "`nChecking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "  ✅ $gitVersion (OK)" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Git not found (optional but recommended)" -ForegroundColor Yellow
    $warnings++
}

# Check Docker (optional)
Write-Host "`nChecking Docker (optional)..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "  ✅ $dockerVersion (OK)" -ForegroundColor Green
} catch {
    Write-Host "  ℹ️  Docker not found (optional - for containerized PostgreSQL)" -ForegroundColor Cyan
}

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ Everything looks good! You're ready to start." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. npm install" -ForegroundColor White
    Write-Host "  2. Create database: psql -U postgres -c `"CREATE DATABASE nestjs_app;`"" -ForegroundColor White
    Write-Host "  3. npm run migration:generate -- src/database/migrations/InitialSchema" -ForegroundColor White
    Write-Host "  4. npm run migration:run" -ForegroundColor White
    Write-Host "  5. npm run start:dev" -ForegroundColor White
} elseif ($errors -eq 0) {
    Write-Host "⚠️  $warnings warning(s) found. You can proceed but may encounter issues." -ForegroundColor Yellow
} else {
    Write-Host "❌ $errors error(s) and $warnings warning(s) found. Please fix the errors before proceeding." -ForegroundColor Red
}

Write-Host "`nFor detailed setup instructions, see README.md" -ForegroundColor Gray
Write-Host ""
