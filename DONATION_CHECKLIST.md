# Donation Module - Quick Setup Checklist

## Prerequisites

- [ ] Node.js and npm installed
- [ ] PostgreSQL database running
- [ ] NestJS application set up

## Installation Steps

### 1. Install Dependencies

```bash
npm install razorpay
npm install --save-dev @types/razorpay
```

Or run the setup script:

```bash
.\setup-donation-module.ps1
```

### 2. Configure Razorpay

- [ ] Sign up at https://dashboard.razorpay.com/
- [ ] Navigate to Settings > API Keys
- [ ] Copy your Key ID (starts with `rzp_test_` for test mode)
- [ ] Copy your Key Secret
- [ ] Add to `.env.development`:
  ```env
  RAZORPAY_KEY_ID=rzp_test_your_key_id
  RAZORPAY_KEY_SECRET=your_secret_key
  ```

### 3. Run Database Migration

```bash
npm run migration:run
```

### 4. Verify Setup

- [ ] Start the server: `npm run start:dev`
- [ ] Open Swagger docs: http://localhost:3000/api/docs
- [ ] Check for "Donations" endpoints
- [ ] Test with `donation-api-tests.http`

## File Structure Created

```
src/modules/donation/
├── donation.entity.ts              # Donation entity with all fields
├── donation.service.ts             # Service with Razorpay integration
├── donation.controller.ts          # Controller with all endpoints
├── donation.module.ts              # Module configuration
├── dto/
│   ├── create-donation.dto.ts      # DTO for creating donations
│   ├── verify-payment.dto.ts       # DTO for payment verification
│   └── filter-donations.dto.ts     # DTO for filtering donations
├── decorators/
│   └── donation.swagger.decorator.ts  # Swagger documentation
└── enums/
    └── donation-status.enum.ts     # Donation status enum

src/database/migrations/
└── 1767300000000-CreateDonationEntity.ts  # Database migration

Root files:
├── donation-api-tests.http         # API test cases
├── DONATION_MODULE_GUIDE.md        # Comprehensive guide
└── setup-donation-module.ps1       # Setup script
```

## API Endpoints Overview

### Public Endpoints (No Auth)

- `POST /api/donations/create-order` - Create donation order
- `POST /api/donations/verify-payment` - Verify payment
- `GET /api/donations/pool/:poolId` - Get pool donations
- `GET /api/donations/pool/:poolId/stats` - Get pool statistics
- `GET /api/donations/:id` - Get donation by ID

### Authenticated Endpoints

- `GET /api/donations` - Get all donations (Admin)
- `GET /api/donations/user/my-donations` - Get my donations

## Testing Checklist

### Anonymous User Flow

- [ ] Create donation order without auth token
- [ ] Include `anonymousDonorName` and `anonymousDonorEmail`
- [ ] Complete Razorpay payment
- [ ] Verify payment
- [ ] Check donation status is SUCCESS
- [ ] Verify pool `amountReceived` updated

### Logged-in User Flow

- [ ] Login and get JWT token
- [ ] Create donation order with auth token
- [ ] Complete Razorpay payment
- [ ] Verify payment
- [ ] Check donation linked to user
- [ ] Retrieve donations via `/user/my-donations`

### Target Reached Flow

- [ ] Create pool with `poolPrice` = 100
- [ ] Make donation of 100
- [ ] Verify pool status changes to TARGET_REACHED
- [ ] Try to donate again (should fail)

### Edge Cases

- [ ] Donation amount exceeds remaining amount (should fail)
- [ ] Donation to inactive pool (should fail)
- [ ] Donation to unapproved pool (should fail)
- [ ] Invalid payment signature (should fail)
- [ ] Anonymous donation without email (should fail)

## Key Features Implemented

✅ **Dual User Support**

- Logged-in users: Links donation to user account
- Anonymous users: Stores donor details in donation entity

✅ **Razorpay Integration**

- Order creation
- Payment verification with signature
- Secure payment handling

✅ **Automatic Pool Updates**

- Updates `amountReceived` on successful payment
- Changes status to TARGET_REACHED when target met
- Blocks donations after target reached

✅ **Validation & Security**

- Amount validation (cannot exceed remaining)
- Pool status validation
- Payment signature verification
- Anonymous donor info required

✅ **Comprehensive API**

- Create orders
- Verify payments
- Get donations by pool/user
- Statistics endpoint

## Common Issues & Solutions

**Issue**: Module not loading

- **Solution**: Check that DonationModule is imported in app.module.ts

**Issue**: Migration fails

- **Solution**: Ensure pool and user tables exist first

**Issue**: Razorpay order creation fails

- **Solution**: Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env

**Issue**: Payment verification fails

- **Solution**: Check that signature is correctly passed from frontend

**Issue**: Pool not updating

- **Solution**: Ensure donation status is SUCCESS before updating pool

## Documentation Files

📄 **DONATION_MODULE_GUIDE.md** - Complete documentation with:

- Setup instructions
- API examples
- Frontend integration
- Security considerations
- Troubleshooting

📄 **donation-api-tests.http** - Ready-to-use API tests

📄 **setup-donation-module.ps1** - Automated setup script

## Next Steps After Setup

1. **Test the API** using the provided test file
2. **Integrate with Frontend** using the React example in the guide
3. **Configure Production** Razorpay credentials when ready
4. **Add Email Notifications** for successful donations (future enhancement)
5. **Implement Webhooks** for async payment updates (future enhancement)

## Support & Resources

- Razorpay Docs: https://razorpay.com/docs/
- NestJS Docs: https://docs.nestjs.com/
- TypeORM Docs: https://typeorm.io/

---

**Status**: ✅ Module fully implemented and ready to use
**Version**: 1.0.0
**Last Updated**: January 2026
