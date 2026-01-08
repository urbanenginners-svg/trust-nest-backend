# Donation Module - Setup and Usage Guide

## Overview

The Donation module enables users to donate to pools using Razorpay payment gateway. Both logged-in and anonymous users can make donations. Once a pool reaches its target amount (`poolPrice`), its status automatically changes to `TARGET_REACHED`.

## Features

- ✅ Support for both authenticated and anonymous donations
- ✅ Razorpay payment gateway integration
- ✅ Automatic pool status update when target is reached
- ✅ Multiple donations per user/donor
- ✅ Donation tracking and statistics
- ✅ Payment verification with signature validation

## Setup Instructions

### 1. Install Razorpay Package

```bash
npm install razorpay
```

### 2. Configure Environment Variables

Add the following to your `.env.development` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

**Important:**

- Get your Razorpay credentials from: https://dashboard.razorpay.com/app/keys
- For testing, use test mode credentials (starts with `rzp_test_`)
- For production, use live mode credentials (starts with `rzp_live_`)

### 3. Run Database Migration

Generate and run the migration:

```bash
# Generate migration (if not already created)
npm run migration:generate -- src/database/migrations/CreateDonationEntity

# Run migration
npm run migration:run
```

### 4. Verify Installation

Check that the donation module is properly loaded:

```bash
npm run start:dev
```

Navigate to: http://localhost:3000/api/docs

You should see the "Donations" endpoints in the Swagger documentation.

## Database Schema

The `donations` table includes:

- **id**: UUID primary key
- **amount**: Donation amount (decimal)
- **message**: Optional message from donor
- **status**: Pending | Success | Failed
- **razorpay_order_id**: Razorpay order reference
- **razorpay_payment_id**: Razorpay payment reference
- **razorpay_signature**: Payment verification signature
- **anonymous_donor_name**: Name for anonymous donors
- **anonymous_donor_email**: Email for anonymous donors
- **anonymous_donor_phone**: Phone for anonymous donors
- **pool_id**: Reference to pool (foreign key)
- **user_id**: Reference to user (nullable for anonymous donations)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## API Endpoints

### Public Endpoints (No Authentication Required)

1. **Create Donation Order**
   - `POST /api/donations/create-order`
   - Creates a Razorpay order for donation
   - For anonymous users: requires `anonymousDonorName` and `anonymousDonorEmail`

2. **Verify Payment**
   - `POST /api/donations/verify-payment`
   - Verifies payment signature and updates donation status
   - Automatically updates pool's `amountReceived`

3. **Get Donations by Pool**
   - `GET /api/donations/pool/:poolId`
   - Returns all successful donations for a pool

4. **Get Pool Statistics**
   - `GET /api/donations/pool/:poolId/stats`
   - Returns donation statistics for a pool

5. **Get Donation by ID**
   - `GET /api/donations/:id`
   - Returns a specific donation

### Authenticated Endpoints (Requires JWT Token)

1. **Get All Donations** (Admin)
   - `GET /api/donations`
   - Query params: `poolId`, `userId`, `status`

2. **Get My Donations**
   - `GET /api/donations/user/my-donations`
   - Returns all donations by the authenticated user

## Usage Examples

### 1. Anonymous User Donation

```javascript
// Step 1: Create donation order
const orderResponse = await fetch(
  'http://localhost:3000/api/donations/create-order',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 50.0,
      poolId: 'pool-uuid-here',
      message: 'Hope this helps!',
      anonymousDonorName: 'John Doe',
      anonymousDonorEmail: 'john@example.com',
      anonymousDonorPhone: '+919876543210',
    }),
  },
);

const order = await orderResponse.json();
// Returns: { donationId, orderId, amount, currency, keyId }

// Step 2: Open Razorpay checkout (Frontend)
const options = {
  key: order.keyId,
  amount: order.amount,
  currency: order.currency,
  order_id: order.orderId,
  name: 'Your App Name',
  description: 'Pool Donation',
  handler: async function (response) {
    // Step 3: Verify payment
    await fetch('http://localhost:3000/api/donations/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      }),
    });
  },
};

const rzp = new Razorpay(options);
rzp.open();
```

### 2. Logged-in User Donation

```javascript
// Same as above, but include Authorization header in create-order request
const orderResponse = await fetch(
  'http://localhost:3000/api/donations/create-order',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_JWT_TOKEN',
    },
    body: JSON.stringify({
      amount: 100.0,
      poolId: 'pool-uuid-here',
      message: 'Supporting your cause!',
      // No need for anonymous donor fields
    }),
  },
);
```

### 3. Get Pool Statistics

```javascript
const statsResponse = await fetch(
  'http://localhost:3000/api/donations/pool/pool-uuid/stats',
);
const stats = await statsResponse.json();

console.log(stats);
// {
//   poolId: 'uuid',
//   poolName: 'Premium Whey Protein Sample',
//   poolPrice: 1000,
//   amountReceived: 750,
//   remainingAmount: 250,
//   percentageReached: 75,
//   totalDonations: 15,
//   donations: [...]
// }
```

## Donation Flow

1. **User initiates donation**
   - Calls `POST /donations/create-order` with amount and poolId
   - System validates pool is active and hasn't reached target
   - Creates Razorpay order and donation record with PENDING status

2. **Payment processing**
   - User completes payment on Razorpay
   - Frontend receives payment details (orderId, paymentId, signature)

3. **Payment verification**
   - Frontend calls `POST /donations/verify-payment`
   - Backend verifies signature using Razorpay secret
   - Updates donation status to SUCCESS
   - Updates pool's `amountReceived`
   - If pool target reached, changes pool status to TARGET_REACHED

## Business Rules

1. **Donation Amount Validation**
   - Amount must be positive
   - Amount cannot exceed remaining pool amount
   - Minimum donation: 1 unit of currency

2. **Pool Validation**
   - Pool must exist and be active
   - Pool must be approved
   - Pool price must be set
   - Pool status must not be TARGET_REACHED

3. **Anonymous Donations**
   - Requires name and email
   - Phone is optional
   - user_id is null

4. **Authenticated Donations**
   - Uses logged-in user's details
   - user_id is set
   - Anonymous fields are null

5. **Target Reached**
   - When `amountReceived >= poolPrice`
   - Pool status changes to TARGET_REACHED
   - Further donations are blocked

## Testing

Use the provided `donation-api-tests.http` file with REST Client extension in VS Code.

### Test Scenarios

1. ✅ Anonymous user donation
2. ✅ Logged-in user donation
3. ✅ Multiple donations to same pool
4. ✅ Donation exceeding remaining amount (should fail)
5. ✅ Donation to inactive/unapproved pool (should fail)
6. ✅ Invalid payment signature (should fail)
7. ✅ Pool reaches target (status changes)

## Frontend Integration (Razorpay)

### Install Razorpay Checkout

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### React Example

```jsx
import { useState } from 'react';

const DonationForm = ({ poolId }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDonate = async () => {
    try {
      // Create order
      const response = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, poolId, message }),
      });

      const order = await response.json();

      // Open Razorpay
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Pool Donation',
        description: 'Support this pool',
        handler: async (response) => {
          // Verify payment
          await fetch('/api/donations/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          alert('Donation successful!');
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Donation failed:', error);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Optional message"
      />
      <button onClick={handleDonate}>Donate Now</button>
    </div>
  );
};
```

## Security Considerations

1. **Signature Verification**: Always verify Razorpay signature on backend
2. **Environment Variables**: Never expose Razorpay secret key to frontend
3. **Amount Validation**: Validate donation amounts on both frontend and backend
4. **Pool Status Check**: Verify pool is accepting donations before creating order
5. **Rate Limiting**: Consider implementing rate limiting for donation endpoints

## Troubleshooting

### Issue: "Failed to create payment order"

- Check if Razorpay credentials are set in .env file
- Verify credentials are correct (test vs live mode)
- Check Razorpay dashboard for API errors

### Issue: "Invalid payment signature"

- Ensure RAZORPAY_KEY_SECRET matches the key used for order creation
- Verify signature format is correct

### Issue: "Pool has already reached its target"

- Check pool's current `amountReceived` and `poolPrice`
- Verify pool status is not already TARGET_REACHED

### Issue: "Email is required for anonymous donations"

- For non-authenticated requests, include `anonymousDonorEmail` and `anonymousDonorName`

## Related Entities

- **Pool Entity**: Target of donations
- **User Entity**: Logged-in donors (optional)
- **PoolStatus Enum**: Includes TARGET_REACHED status

## Future Enhancements

- [ ] Refund functionality
- [ ] Recurring donations
- [ ] Donation rewards/badges
- [ ] Email notifications
- [ ] Donation receipts/invoices
- [ ] Support for multiple payment gateways
- [ ] Webhook handling for async payment updates

## Support

For issues or questions:

1. Check Razorpay documentation: https://razorpay.com/docs/
2. Review API test file: `donation-api-tests.http`
3. Check application logs for error details
