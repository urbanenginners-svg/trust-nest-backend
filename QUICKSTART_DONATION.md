# 🚀 Donation Module - Quick Start Guide

## What's Been Created

A complete donation module with Razorpay payment integration that allows:

- ✅ Both logged-in and anonymous users to donate to pools
- ✅ Automatic pool status updates when target is reached
- ✅ Secure payment processing with Razorpay
- ✅ Comprehensive API with 7 endpoints
- ✅ Full validation and error handling

## Immediate Next Steps

### 1️⃣ Get Razorpay Credentials (5 minutes)

1. Go to https://dashboard.razorpay.com/signup
2. Sign up for a free account
3. Navigate to: **Settings → API Keys**
4. Generate Test Keys
5. Copy your:
   - Key ID (starts with `rzp_test_`)
   - Key Secret

### 2️⃣ Update Environment Variables (1 minute)

Open `.env.development` and update:

```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

### 3️⃣ Run Database Migration (1 minute)

```bash
npm run migration:run
```

Expected output:

```
query: CREATE TABLE "donations" ...
Migration CreateDonationEntity1767300000000 has been executed successfully.
```

### 4️⃣ Start the Server (1 minute)

```bash
npm run start:dev
```

Wait for:

```
Nest application successfully started
Application is running on: http://localhost:3000
```

### 5️⃣ Verify Installation (2 minutes)

Open: **http://localhost:3000/api/docs**

You should see a new section: **"Donations"** with these endpoints:

- POST /api/donations/create-order
- POST /api/donations/verify-payment
- GET /api/donations
- GET /api/donations/:id
- GET /api/donations/pool/:poolId
- GET /api/donations/pool/:poolId/stats
- GET /api/donations/user/my-donations

## Test It Right Now

### Option A: Using Swagger UI (Easiest)

1. Go to http://localhost:3000/api/docs
2. Find "Donations" section
3. Click on **POST /api/donations/create-order**
4. Click **"Try it out"**
5. Use this test data:

```json
{
  "amount": 50,
  "poolId": "your-pool-uuid-here",
  "message": "Test donation",
  "anonymousDonorName": "Test User",
  "anonymousDonorEmail": "test@example.com"
}
```

6. Click **Execute**

### Option B: Using VS Code REST Client

1. Open `donation-api-tests.http`
2. Update variables at the top:
   ```
   @poolId = paste-your-pool-uuid-here
   ```
3. Click **"Send Request"** above any endpoint

### Option C: Using curl

```bash
curl -X POST http://localhost:3000/api/donations/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "poolId": "your-pool-uuid",
    "message": "Test donation",
    "anonymousDonorName": "Test User",
    "anonymousDonorEmail": "test@example.com"
  }'
```

## What to Expect

### Successful Response:

```json
{
  "donationId": "uuid-of-donation",
  "orderId": "order_xyz123",
  "amount": 5000,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

### Common Errors & Solutions:

❌ **"Pool not found"**

- Solution: Create a pool first or use a valid pool ID

❌ **"Pool price is not set"**

- Solution: Ensure the pool has `poolPrice` set

❌ **"Email is required for anonymous donations"**

- Solution: Include `anonymousDonorEmail` in request

❌ **"Failed to create payment order"**

- Solution: Check your Razorpay credentials in .env file

## Complete Flow Example

### 1. Create a Pool (if you don't have one)

```bash
# Use pool API to create a pool with poolPrice set
```

### 2. Create Donation Order

```bash
curl -X POST http://localhost:3000/api/donations/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "poolId": "your-pool-id",
    "anonymousDonorName": "John Doe",
    "anonymousDonorEmail": "john@example.com"
  }'
```

Response:

```json
{
  "donationId": "donation-uuid",
  "orderId": "order_abc123",
  "amount": 10000,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

### 3. Get Pool Statistics

```bash
curl http://localhost:3000/api/donations/pool/your-pool-id/stats
```

Response:

```json
{
  "poolId": "uuid",
  "poolName": "Sample Pool",
  "poolPrice": 1000,
  "amountReceived": 100,
  "remainingAmount": 900,
  "percentageReached": 10,
  "totalDonations": 1,
  "donations": [...]
}
```

## File Reference

📄 **Detailed Documentation**

- `DONATION_MODULE_GUIDE.md` - Complete guide with frontend integration
- `DONATION_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `DONATION_CHECKLIST.md` - Setup and testing checklist

📝 **API Testing**

- `donation-api-tests.http` - All API endpoints with examples

🔧 **Setup**

- `setup-donation-module.ps1` - Automated setup script
- `.env.development` - Environment configuration

## Troubleshooting

### Server won't start?

```bash
# Check if port 3000 is available
netstat -an | findstr 3000

# Try a different port
$env:PORT=3001
npm run start:dev
```

### Migration fails?

```bash
# Check migration status
npm run migration:show

# If already run, revert and re-run
npm run migration:revert
npm run migration:run
```

### TypeScript errors in VS Code?

```bash
# Reload VS Code window
# Press Ctrl+Shift+P → "Reload Window"

# Or restart TypeScript server
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## Frontend Integration Preview

Here's how easy it is to integrate in your frontend:

```javascript
// 1. Create order
const response = await fetch('/api/donations/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 50,
    poolId: 'pool-id',
    anonymousDonorName: 'John',
    anonymousDonorEmail: 'john@example.com',
  }),
});

const order = await response.json();

// 2. Open Razorpay (add script first)
const rzp = new Razorpay({
  key: order.keyId,
  amount: order.amount,
  order_id: order.orderId,
  handler: async (res) => {
    // 3. Verify payment
    await fetch('/api/donations/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpayOrderId: res.razorpay_order_id,
        razorpayPaymentId: res.razorpay_payment_id,
        razorpaySignature: res.razorpay_signature,
      }),
    });
  },
});

rzp.open();
```

## Need Help?

1. **Check the guides**: Start with `DONATION_MODULE_GUIDE.md`
2. **Review examples**: Use `donation-api-tests.http`
3. **Check logs**: Look at terminal output for errors
4. **Test endpoints**: Use Swagger UI at `/api/docs`

## Success Indicators

✅ Server starts without errors
✅ Swagger docs show Donations section
✅ Can create donation order
✅ Pool stats endpoint works
✅ Migration ran successfully

---

**🎉 You're all set!** The donation module is ready to accept payments.

Next: Integrate with your frontend and start testing with Razorpay test cards.

**Razorpay Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
