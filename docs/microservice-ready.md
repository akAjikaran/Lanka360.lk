# Microservice-Ready Structure

This app still runs as one Next.js application, but browser API calls now go through a small service client:

- `src/services/lanka360Api.ts`

UI components should not call `/api/listings` or `/api/otp` directly. Add or update methods in the service client first, then call those methods from pages/components.

## Current Service Boundary

- Listing creation
- Owner listing lookup
- Listing update
- Listing deletion
- WhatsApp OTP send
- WhatsApp OTP verify

## Future Split

When the listings/OTP backend moves to a separate service, keep the same API shape and set:

```bash
NEXT_PUBLIC_LANKA360_API_BASE_URL=https://your-api-host.example
```

The frontend will call `https://your-api-host.example/api/...` instead of the local Next.js API routes.
