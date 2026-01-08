# Donation Module Setup Script
# This script installs required dependencies for the donation module

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Donation Module Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Razorpay package
Write-Host "Step 1: Installing Razorpay package..." -ForegroundColor Yellow
npm install razorpay

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Razorpay package installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install Razorpay package" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Install Razorpay types (optional)
Write-Host "Step 2: Installing Razorpay TypeScript types..." -ForegroundColor Yellow
npm install --save-dev @types/razorpay

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Razorpay types installed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Razorpay types installation failed (optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get your Razorpay credentials:" -ForegroundColor White
Write-Host "   - Sign up at: https://dashboard.razorpay.com/" -ForegroundColor Gray
Write-Host "   - Go to Settings > API Keys" -ForegroundColor Gray
Write-Host "   - Copy Key ID and Key Secret" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update your .env.development file:" -ForegroundColor White
Write-Host "   RAZORPAY_KEY_ID=rzp_test_your_key_id" -ForegroundColor Gray
Write-Host "   RAZORPAY_KEY_SECRET=your_secret_key" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Run database migration:" -ForegroundColor White
Write-Host "   npm run migration:run" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the development server:" -ForegroundColor White
Write-Host "   npm run start:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Test the API:" -ForegroundColor White
Write-Host "   - Open donation-api-tests.http" -ForegroundColor Gray
Write-Host "   - Or visit http://localhost:3000/api/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "For detailed documentation, see:" -ForegroundColor White
Write-Host "DONATION_MODULE_GUIDE.md" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
