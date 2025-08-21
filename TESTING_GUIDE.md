# 🧪 Testing Guide for Chatty Web Architect

This guide provides comprehensive testing instructions for the Chatty Web Architect application, covering both frontend and backend functionality.

## 🚀 Quick Start Testing

### 1. **Prerequisites**
```bash
# Make sure you have Node.js and npm installed
node --version
npm --version

# Make sure PostgreSQL is running
# (Install PostgreSQL if not already installed)
```

### 2. **Setup Environment**
```bash
# Clone and navigate to project
cd chatty-web-architect-main

# Setup backend environment
cd backend
cp env.example .env
# Edit .env with your database and API credentials

# Setup frontend environment
cd ..
cp env.local.example .env.local
# Edit .env.local if needed
```

### 3. **Install Dependencies**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ..
npm install
```

### 4. **Setup Database**
```bash
cd backend
npm run setup-db
```

### 5. **Start the Application**
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd ..
npm run dev
```

## 🔍 Manual Testing Checklist

### ✅ **Backend Health Check**
- **URL**: `http://localhost:3001/health`
- **Expected**: JSON response with server status
- **Test**: Should show uptime, environment, and version info

### ✅ **Frontend Loading**
- **URL**: `http://localhost:8080`
- **Expected**: Application loads without errors
- **Test**: Check browser console for any errors

### ✅ **Backend Status Component**
- **Location**: Frontend status bar
- **Expected**: Shows "Backend connected" with uptime
- **Test**: Should display green status when backend is running

### ✅ **WebSocket Status**
- **Location**: Next to backend status
- **Expected**: Shows "Live" with online users count
- **Test**: Should display real-time connection status

## 🔐 Authentication Testing

### **Registration Flow**
1. **Navigate to**: Registration page
2. **Test Data**:
   ```
   Email: test@example.com
   Password: test123456
   Full Name: Test User
   ```
3. **Expected**: User created successfully, redirected to login
4. **Verify**: Check database for new user record

### **Login Flow**
1. **Navigate to**: Login page
2. **Test Data**:
   ```
   Email: test@example.com
   Password: test123456
   ```
3. **Expected**: Login successful, JWT token stored
4. **Verify**: Check localStorage for auth session

### **Logout Flow**
1. **Click**: Logout button
2. **Expected**: Session cleared, redirected to login
3. **Verify**: localStorage cleared, backend session invalidated

## 💬 Chat Functionality Testing

### **Basic Chat**
1. **Login** with test account
2. **Navigate to**: Chat interface
3. **Test Message**: "Hello, how are you?"
4. **Expected**: AI response generated
5. **Verify**: Message saved to database

### **Personality Selection**
1. **Test Each Personality**:
   - Mentor
   - Hacker
   - CEO
   - Therapist
   - Comedian
2. **Expected**: Different response styles for each
3. **Verify**: Personality saved with message

### **Conversation Management**
1. **Create Multiple Conversations**:
   - Send different messages
   - Switch between conversations
2. **Test Features**:
   - Rename conversation
   - Delete conversation
   - Load conversation history
3. **Expected**: All CRUD operations work correctly

### **Daily Limits (Free Plan)**
1. **Send 15 messages** in one day
2. **Expected**: 16th message should be blocked
3. **Error Message**: "Daily message limit reached"

## 🛠️ Tools Testing

### **Script Generator (Premium+)**
1. **Upgrade to Premium** (or use test account)
2. **Navigate to**: Script Generator
3. **Test Input**:
   ```
   Prompt: Create a simple calculator function
   Language: JavaScript
   Framework: None
   ```
4. **Expected**: Generated JavaScript code
5. **Verify**: Code is valid and well-documented

### **Payload Generator (Elite+)**
1. **Upgrade to Elite** (or use test account)
2. **Navigate to**: Payload Generator
3. **Test Input**:
   ```
   Type: xss
   Target: input field
   ```
4. **Expected**: Educational payload examples
5. **Verify**: Marked as "FOR EDUCATIONAL PURPOSES ONLY"

### **Business Planner (Elite+)**
1. **Navigate to**: Business Planner
2. **Test Input**:
   ```
   Business Type: E-commerce
   Budget: 50000
   Timeline: 6 months
   Goals: ["Increase sales", "Improve UX"]
   ```
3. **Expected**: Comprehensive business plan
4. **Verify**: Plan includes all requested elements

### **PDF Generator (Premium+)**
1. **Navigate to**: PDF Generator
2. **Test Input**:
   ```
   Content: Test document content
   Title: Test Document
   Format: A4
   ```
3. **Expected**: PDF file generated and downloaded
4. **Verify**: PDF contains correct content

## 💳 Subscription Testing

### **Plan Features**
1. **Test Each Plan**:
   - **Free**: 15 messages/day, basic features
   - **Premium**: Unlimited messages, script generator, PDF export
   - **Elite**: All Premium + payload generator, business planner
   - **Lifetime**: All features, one-time payment

### **Plan Restrictions**
1. **Free Plan**:
   - Try to access premium tools
   - Expected: Access denied message
2. **Premium Plan**:
   - Try to access elite tools
   - Expected: Upgrade prompt

### **Subscription Management**
1. **View Plans**: Check available plans
2. **Check Status**: Verify current subscription
3. **Cancel Subscription**: Test cancellation flow

## 🔌 API Testing

### **Health Endpoint**
```bash
curl http://localhost:3001/health
```

### **Authentication Endpoints**
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### **Chat Endpoints**
```bash
# Send message (requires auth token)
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"Hello","personality":"mentor"}'
```

## 🌐 WebSocket Testing

### **Connection Test**
1. **Open Browser DevTools**
2. **Check Console** for WebSocket connection logs
3. **Expected**: "WebSocket connected" message
4. **Verify**: Online users count updates

### **Real-time Features**
1. **Open Multiple Tabs** with different users
2. **Expected**: Online users count increases
3. **Close Tabs**: Count should decrease
4. **Test Reconnection**: Disconnect network, reconnect

## 🐛 Error Testing

### **Invalid Inputs**
1. **Registration**:
   - Invalid email format
   - Short password
   - Empty fields
2. **Expected**: Validation errors displayed

### **Authentication Errors**
1. **Login** with wrong credentials
2. **Expected**: "Invalid credentials" error
3. **Test expired tokens**
4. **Expected**: Redirect to login

### **Rate Limiting**
1. **Send rapid requests**
2. **Expected**: Rate limit error
3. **Test daily message limits**
4. **Expected**: Limit exceeded error

### **Network Errors**
1. **Disconnect backend**
2. **Expected**: Frontend shows disconnected status
3. **Reconnect backend**
4. **Expected**: Automatic reconnection

## 📊 Performance Testing

### **Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Test API endpoints
artillery quick --count 100 --num 10 http://localhost:3001/health
```

### **Database Performance**
1. **Create many conversations**
2. **Test pagination**
3. **Expected**: Fast response times
4. **Monitor**: Database query performance

### **Memory Usage**
1. **Monitor backend memory**
2. **Expected**: Stable memory usage
3. **Test**: Long-running sessions

## 🔒 Security Testing

### **Input Validation**
1. **SQL Injection Attempts**:
   ```
   '; DROP TABLE users; --
   ```
2. **XSS Attempts**:
   ```
   <script>alert('xss')</script>
   ```
3. **Expected**: Input sanitized/rejected

### **Authentication Security**
1. **Test JWT token tampering**
2. **Expected**: Invalid token error
3. **Test session hijacking**
4. **Expected**: Session validation fails

### **CORS Testing**
1. **Test from different origins**
2. **Expected**: CORS errors for unauthorized origins
3. **Verify**: Only localhost:8080 allowed

## 🧪 Automated Testing

### **Backend Tests**
```bash
cd backend
npm test
```

### **Frontend Tests**
```bash
npm test
```

### **E2E Tests**
```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

## 📱 Cross-Browser Testing

### **Supported Browsers**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### **Mobile Testing**
- Test responsive design
- Check touch interactions
- Verify mobile navigation

## 🚨 Common Issues & Solutions

### **Backend Won't Start**
```bash
# Check if port 3001 is available
netstat -an | grep 3001

# Check database connection
cd backend
npm run setup-db
```

### **Frontend Won't Load**
```bash
# Check if port 8080 is available
netstat -an | grep 8080

# Clear cache and restart
npm run dev
```

### **WebSocket Connection Fails**
```bash
# Check backend WebSocket logs
# Verify CORS configuration
# Check authentication token
```

### **Database Connection Issues**
```bash
# Verify PostgreSQL is running
# Check connection credentials
# Test connection manually
```

## 📈 Monitoring & Logs

### **Backend Logs**
```bash
cd backend
npm run dev
# Watch console for errors and WebSocket events
```

### **Frontend Logs**
- Open browser DevTools
- Check Console tab for errors
- Monitor Network tab for API calls

### **Database Logs**
```bash
# PostgreSQL logs (location varies by OS)
tail -f /var/log/postgresql/postgresql-*.log
```

## ✅ Testing Checklist Summary

- [ ] Backend starts without errors
- [ ] Frontend loads correctly
- [ ] Database connection works
- [ ] User registration works
- [ ] User login works
- [ ] Chat functionality works
- [ ] Tools work (with proper subscription)
- [ ] WebSocket connection works
- [ ] Real-time features work
- [ ] Error handling works
- [ ] Security features work
- [ ] Performance is acceptable
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

## 🎯 Next Steps

1. **Run all tests** in this guide
2. **Document any issues** found
3. **Fix critical bugs** before deployment
4. **Set up monitoring** for production
5. **Create automated test suite**

---

**Happy Testing! 🚀**

For issues or questions, check the `FIXES_APPLIED.md` and `FRONTEND_BACKEND_LINKING_ANALYSIS.md` files for known solutions. 