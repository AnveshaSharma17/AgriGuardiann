# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. "GEMINI_API_KEY not found" Error

**Problem**: Backend shows warning about missing API key

**Solution**:

```bash
# Create or edit server/.env file
cd server
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "MONGODB_URI=your_mongodb_uri" >> .env
echo "JWT_SECRET=your_secret" >> .env
```

Get API key from: https://aistudio.google.com/app/apikey

---

### 2. Streaming Not Working

**Symptoms**: Messages appear all at once, no streaming effect

**Possible Causes & Fixes**:

#### A. Browser Doesn't Support SSE

- Use Chrome, Firefox, Edge, or Safari (all support SSE)
- Check browser console for "EventSource" errors

#### B. Backend Not Sending SSE Headers

```javascript
// Verify in server/controllers/aiController.js
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
```

#### C. Proxy/Nginx Buffering

If using nginx, disable buffering:

```nginx
proxy_buffering off;
proxy_cache off;
```

---

### 3. "Conversation not found" Error

**Problem**: Can't open old conversations

**Solutions**:

1. Check user is logged in: `localStorage.getItem('token')`
2. Verify conversation belongs to current user
3. Check MongoDB connection
4. Look at browser Network tab → Response

**Debug**:

```javascript
// In browser console
const token = localStorage.getItem("token");
console.log("Token:", token ? "Present" : "Missing");

// Check conversation ID
console.log("Current conversation:", currentConversationId);
```

---

### 4. Delete Not Working

**Problem**: Delete button doesn't remove conversation

**Possible Issues**:

#### A. Confirmation Dialog Cancelled

- Click "OK" on confirmation dialog

#### B. API Error

- Check browser console for 404 or 500 errors
- Verify JWT token is valid
- Check server logs

**Fix**:

```javascript
// In Chat.tsx, check handleDeleteConversation function
// Should call: await deleteConversation(id);
```

---

### 5. Rename Not Saving

**Problem**: Can't rename conversation

**Solutions**:

1. Type new title
2. Click checkmark (✓) button or press Enter
3. Don't click outside while editing

**Debug**:

```javascript
// Check if updateConversation is being called
// In browser console Network tab, look for PATCH request
```

---

### 6. Pin Not Working

**Problem**: Pinned conversations don't stay at top

**Fix**: Check sorting in backend

```javascript
// server/controllers/chatController.js
.sort({ pinned: -1, last_message_at: -1 })
```

---

### 7. Messages Not Loading

**Symptoms**: Old conversation loads but no messages shown

**Solutions**:

#### A. Check API Response

```bash
# Test with cURL
curl http://localhost:5000/api/chat/conversations/CONVERSATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### B. Check Message Model

- Verify ChatMessage schema has toJSON transform
- Check conversation_id matches

#### C. Frontend State

```javascript
// In Chat.tsx, check loadConversation function
console.log("Formatted messages:", formattedMessages);
```

---

### 8. Sidebar Not Showing

**Problem**: Conversation list is empty or hidden

**Solutions**:

1. Click hamburger menu (☰) to toggle sidebar
2. Create new conversation if none exist
3. Check if conversations are filtered (is_active: true)

**Debug**:

```javascript
// Check state
console.log("Conversations:", conversations);
console.log("Show sidebar:", showSidebar);
```

---

### 9. TypeScript Errors

**Problem**: Build fails with TypeScript errors

**Solutions**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check tsconfig.json
npm run build
```

---

### 10. MongoDB Connection Failed

**Symptoms**: Backend crashes with "MongoError"

**Solutions**:

#### A. Local MongoDB

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Or on Windows
net start MongoDB
```

#### B. MongoDB Atlas

- Check connection string in .env
- Verify IP whitelist (0.0.0.0/0 for testing)
- Check username/password

#### C. Connection String Format

```env
# Local
MONGODB_URI=mongodb://localhost:27017/agriguardian

# Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agriguardian
```

---

### 11. CORS Errors

**Problem**: Frontend can't reach backend

**Symptoms**: Console shows "CORS policy" error

**Fix**: Check backend CORS config

```javascript
// server/index.js
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);
```

---

### 12. Port Already in Use

**Problem**: "EADDRINUSE" error

**Solutions**:

#### Windows

```cmd
# Find process on port 5000
netstat -ano | findstr :5000
# Kill process
taskkill /PID <PID> /F
```

#### Linux/Mac

```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

---

### 13. Streaming Stops Mid-Response

**Problem**: Response cuts off before complete

**Possible Causes**:

1. API timeout (increase timeout)
2. Network interruption (retry)
3. API quota exceeded (check Gemini quota)

**Fix**:

```javascript
// Increase timeout if needed
const controller = new AbortController();
setTimeout(() => controller.abort(), 60000); // 60 seconds

fetch(url, {
  signal: controller.signal,
  // ...
});
```

---

### 14. Performance Issues

**Symptoms**: Slow response, laggy UI

**Solutions**:

1. Limit conversation history (last 10 messages)
2. Enable response caching
3. Use pagination for conversation list
4. Optimize MongoDB indexes

```javascript
// Add indexes
db.chat_messages.createIndex({ conversation_id: 1, created_at: 1 });
db.chat_conversations.createIndex({
  user_id: 1,
  is_active: 1,
  last_message_at: -1,
});
```

---

### 15. Authentication Issues

**Problem**: 401 Unauthorized errors

**Solutions**:

1. Check JWT token exists: `localStorage.getItem('token')`
2. Token might be expired (login again)
3. Verify JWT_SECRET matches between sessions

**Debug**:

```javascript
// Decode JWT token
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Token expires:", new Date(payload.exp * 1000));
```

---

## Still Having Issues?

### 1. Enable Debug Logging

```javascript
// In server/index.js
app.use(morgan("dev")); // Already enabled

// Add more logging
console.log("Request:", req.method, req.url, req.body);
```

### 2. Check Browser Console

Press F12 → Console tab → Look for errors

### 3. Check Network Tab

Press F12 → Network tab → Look for failed requests

### 4. Check Server Logs

Look at terminal where backend is running

### 5. Test with cURL

```bash
# Test conversation list
curl http://localhost:5000/api/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test send message
curl -N http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"test","context":{"language":"en"}}'
```

### 6. Reset Everything

```bash
# Stop all services
# Clear MongoDB data (if testing)
# Delete node_modules
rm -rf node_modules server/node_modules
# Reinstall
npm install
cd server && npm install
# Restart
```

---

## Getting Help

If you're still stuck:

1. Check `CHAT_IMPROVEMENTS.md` for implementation details
2. Review `QUICK_START.md` for setup steps
3. Look at error messages carefully
4. Search for similar issues online
5. Check Google Gemini AI status: https://status.cloud.google.com/

---

## Prevention Tips 🛡️

1. **Always check environment variables** before starting
2. **Use git** to track changes and revert if needed
3. **Test in development** before deploying
4. **Monitor logs** for unusual errors
5. **Keep backups** of your database
6. **Document custom changes** you make

---

Happy debugging! 🐛🔨
