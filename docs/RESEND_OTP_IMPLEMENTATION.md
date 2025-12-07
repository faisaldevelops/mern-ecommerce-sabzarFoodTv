# Resend OTP Implementation

## Overview

This document describes the implementation of resend OTP functionality with throttling to prevent misuse across all OTP authentication flows in the application.

## Changes Summary

### Backend Changes

#### 1. OTP Controller (`backend/controllers/otp.controller.js`)

**New Features:**
- Added throttling configuration constants:
  - `RESEND_COOLDOWN_SECONDS = 60`: Minimum time between OTP requests
  - `MAX_RESENDS_PER_WINDOW = 3`: Maximum resends allowed per window
  - `THROTTLE_WINDOW_MINUTES = 15`: Time window for tracking resends

**New Functions:**
- `checkThrottle(phoneNumber)`: Validates if a phone number is allowed to request OTP
- `updateThrottle(phoneNumber)`: Updates throttle data after sending OTP
- `sendOTPMessage(phoneNumber, otp)`: Refactored function to send OTP via Twilio

**New Endpoint:**
- `resendOTP`: POST `/api/otp/resend` - Resends OTP to a phone number with throttling

**Modified Functions:**
- `sendOTP`: Now includes throttling checks before sending OTP
- `verifyOTP`: Clears throttle data on successful verification

#### 2. OTP Routes (`backend/routes/otp.route.js`)

**New Route:**
```javascript
router.post("/resend", resendOTP);
```

### Frontend Changes

#### 1. Login Page (`frontend/src/pages/LoginPage.jsx`)

**New Features:**
- Added resend button on OTP verification screen
- Countdown timer showing remaining wait time (60 seconds)
- Graceful error handling for throttling

**New State:**
- `resendCooldown`: Tracks countdown timer
- `resendLoading`: Loading state for resend operation

**New Function:**
- `handleResendOTP`: Handles resend button click with error handling

#### 2. Signup Page (`frontend/src/pages/SignUpPage.jsx`)

**New Features:**
- Same as Login Page (resend button, timer, error handling)

#### 3. Phone Auth Modal (`frontend/src/components/PhoneAuthModal.jsx`)

**New Features:**
- Same as Login/Signup pages
- Used in checkout flow for guest users

### Test Coverage

#### New Test File (`tests/test_otp.py`)

**Test Classes:**
1. `TestOTPSendAndVerify`: Basic OTP send/verify functionality
2. `TestOTPResend`: Resend functionality tests
3. `TestOTPThrottling`: Throttling and rate limiting tests
4. `TestOTPVerification`: OTP verification tests
5. `TestOTPIntegration`: Integration tests for complete flows

**Test Scenarios:**
- Successful OTP send and resend
- Invalid phone number rejection
- Resend without initial send fails
- Cooldown period enforcement
- Maximum resends limit enforcement
- Complete signup flow with resend

#### Updated Test Data (`tests/test_data.py`)

**New Function:**
- `generate_phone_number()`: Generates random 10-digit phone numbers for testing

## Throttling Logic

### Flow Diagram

```
User requests OTP
    ↓
Check throttle data
    ↓
├─ No previous request → Allow, create throttle entry
├─ Previous request expired (>15 min) → Allow, reset throttle
├─ Within cooldown (<30 sec) → Reject with waitTime
└─ Max resends reached (≥3 in 15 min) → Reject with resetInMinutes
```

### Throttle Data Structure

```javascript
{
  phoneNumber: {
    count: number,      // Number of OTP requests in current window
    resetAt: timestamp, // When the 15-minute window expires
    lastSentAt: timestamp // Last OTP send time
  }
}
```

### HTTP Response Codes

- `200 OK`: OTP sent/resent successfully
- `400 Bad Request`: Invalid phone number or no initial OTP request
- `429 Too Many Requests`: Throttled due to cooldown or limit reached
- `500 Internal Server Error`: Server error

### Error Response Format

**Cooldown Error:**
```json
{
  "message": "Please wait 25 seconds before requesting another OTP",
  "reason": "cooldown",
  "waitTime": 25
}
```

**Limit Reached Error:**
```json
{
  "message": "Too many OTP requests. Please try again in 12 minute(s)",
  "reason": "limit_reached",
  "resetInMinutes": 12
}
```

## User Experience

### UI Components

1. **Resend Button**
   - Disabled during cooldown period
   - Shows countdown timer: "Resend in 60s", "Resend in 59s", etc.
   - Enabled after cooldown: "Resend Code"
   - Shows loading state: "Sending..."

2. **Error Messages**
   - Cooldown: "Please wait X seconds before resending"
   - Limit reached: "Too many attempts. Try again in X minute(s)"
   - General errors: "Failed to resend OTP"

3. **Success Messages**
   - "OTP sent successfully"
   - "OTP resent successfully"

## Security Considerations

### Implemented Security Measures

1. **Rate Limiting**: Prevents spam and brute-force attacks
2. **Cooldown Period**: 60-second minimum between requests
3. **Maximum Attempts**: 3 resends per 15-minute window
4. **Phone Validation**: 10-digit format required
5. **Throttle Cleanup**: Data cleared on successful verification

### CodeQL Security Scan

- **Status**: ✅ Passed
- **Vulnerabilities Found**: 0
- **Languages Scanned**: JavaScript, Python

## API Documentation

### POST /api/otp/resend

Resends an OTP to a phone number with throttling.

**Request Body:**
```json
{
  "phoneNumber": "9876543210"
}
```

**Success Response (200):**
```json
{
  "message": "OTP resent successfully"
}
```

**Error Response (400):**
```json
{
  "message": "No OTP request found. Please request a new OTP first."
}
```

**Error Response (429):**
```json
{
  "message": "Please wait 25 seconds before requesting another OTP",
  "reason": "cooldown",
  "waitTime": 25
}
```

## Testing

### Running Tests

```bash
# Install test dependencies
cd tests
pip install -r requirements.txt

# Run OTP-specific tests
pytest test_otp.py -v

# Run specific test class
pytest test_otp.py::TestOTPResend -v

# Run specific test
pytest test_otp.py::TestOTPThrottling::test_cooldown_period_enforcement -v
```

### Test Configuration

Constants are defined at the top of `test_otp.py`:
- `RESEND_COOLDOWN_SECONDS = 60`
- `MAX_RESENDS_PER_WINDOW = 3`
- `THROTTLE_WINDOW_MINUTES = 15`

### Note on Long-Running Tests

The test `test_throttle_reset_after_window` is skipped by default as it would take 15 minutes to complete.

## Deployment Considerations

### Environment Variables

No new environment variables required. The feature uses existing Twilio configuration:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

### Production Recommendations

1. **Redis for Throttling**: Currently uses in-memory Map. For production with multiple servers, migrate throttle data to Redis.

2. **Monitoring**: Set up alerts for:
   - High throttling rates (potential abuse)
   - Failed OTP send attempts
   - Unusual resend patterns

3. **Configuration**: Consider making throttling constants configurable via environment variables:
   ```env
   OTP_RESEND_COOLDOWN_SECONDS=60
   OTP_MAX_RESENDS_PER_WINDOW=3
   OTP_THROTTLE_WINDOW_MINUTES=15
   ```

4. **Logging**: Add detailed logging for throttling events for security auditing.

## Future Enhancements

1. **Redis Integration**: Migrate throttle data from in-memory Map to Redis for distributed systems
2. **IP-based Throttling**: Add IP-level rate limiting as an additional security layer
3. **Analytics Dashboard**: Track OTP send/resend patterns
4. **Configurable Limits**: Make throttling parameters configurable per environment
5. **Phone Number Verification**: Add additional phone number validation (carrier lookup, etc.)
6. **Alternative Channels**: Support OTP delivery via email or app notifications as fallback

## Files Modified

### Backend
- `backend/controllers/otp.controller.js` (186 lines changed)
- `backend/routes/otp.route.js` (3 lines changed)

### Frontend
- `frontend/src/pages/LoginPage.jsx` (85 lines changed)
- `frontend/src/pages/SignUpPage.jsx` (85 lines changed)
- `frontend/src/components/PhoneAuthModal.jsx` (95 lines changed)

### Tests
- `tests/test_otp.py` (247 lines added - new file)
- `tests/test_data.py` (6 lines changed)

### Total Changes
- **7 files modified**
- **645 lines added**
- **62 lines removed**

## Conclusion

The resend OTP functionality has been successfully implemented with comprehensive throttling to prevent misuse. All entry points (Login, Signup, Checkout Modal) now support OTP resend with a user-friendly countdown timer and clear error messages. The implementation includes extensive test coverage and has passed security scanning with zero vulnerabilities.
