# Auth Testing Playbook

## Step 1: Create Test User & Session
```bash
mongosh --eval "
use('ystore');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  full_name: 'Test User',
  role: 'customer',
  created_at: new Date().toISOString()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API
```bash
# Test auth endpoint with cookie
curl -X GET "https://checkout-premium.preview.emergentagent.com/api/v2/auth/me" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN"

# Test with Bearer token
curl -X GET "https://checkout-premium.preview.emergentagent.com/api/v2/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser Testing
```javascript
// Set cookie and navigate
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "85103503-32ed-4bf6-b49f-8ef028260ad4.preview.emergentagent.com",
    "path": "/",
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
}]);
await page.goto("https://checkout-premium.preview.emergentagent.com");
```

## Checklist
- [ ] User document has id field
- [ ] Session user_id matches user's id exactly
- [ ] All queries use `{"_id": 0}` projection
- [ ] /api/v2/auth/me returns user data
- [ ] Google login redirects properly
- [ ] Guest checkout works without auth
