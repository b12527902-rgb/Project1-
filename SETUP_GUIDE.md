# 🚀 Complete Setup Guide: Frontend + Backend Integration

## 📋 Overview

Your Chatty Web Architect project now has both a React frontend and a Node.js backend properly connected. Here's how to set up and run the complete application.

## 🏗️ Project Structure

```
chatty-web-architect-main/
├── src/                        # React frontend
│   ├── services/               # API integration layer
│   │   ├── api.ts              # Base API client
│   │   └── auth.ts             # Auth & chat services
│   ├── integrations/
│   │   └── auth/               # JWT authentication client
│   │       ├── client.ts       # Auth client implementation
│   │       └── types.ts        # Auth and database types
│   ├── components/
│   │   ├── BackendStatus.tsx   # Backend connection status
│   │   └── AuthProvider.tsx    # JWT authentication provider
│   └── pages/
│       └── ChatbotPage.tsx     # Uses backend API for chat
├── .env.local                  # Environment variables
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── middleware/        # Auth & error handling
│   │   ├── routes/            # API endpoints
│   │   ├── websocket/         # Real-time features
│   │   └── server.js          # Main server
│   ├── scripts/               # Production scripts
│   ├── migrations/            # Database migrations
│   ├── .env.example           # Environment template
│   └── package.json
```

## 🚀 Quick Start

### Step 1: Setup Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   npm run setup
   ```
   This will guide you through setting up:
   - PostgreSQL database connection parameters
   - OpenAI API Key
   - JWT Secret
   - Other configuration options

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

5. **Build and deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

6. **Start the backend server:**
   ```bash
   npm start
   ```
   Backend will run on `http://localhost:3001`

### Step 2: Setup Frontend

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install frontend dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:8080`

## 🔧 Configuration Details

### Backend Environment Variables

Required variables in `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=false

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Optional: Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# CORS Configuration
CORS_ORIGIN=http://localhost:8080,https://your-production-domain.com
```

### Frontend Environment Variables

In `.env.local`:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001

# JWT Authentication
VITE_JWT_EXPIRY=3600

# Development settings
VITE_APP_ENV=development
```

## 🔄 How It Works

### 1. **Authentication Flow**
- Frontend uses JWT-based authentication for login/logout
- Backend validates JWT tokens and manages sessions
- AuthProvider uses JWT client to handle authentication state
- User sessions are stored securely in localStorage

### 2. **Chat Integration**
- Frontend sends messages to backend `/api/chat/message`
- Backend processes with OpenAI GPT-4
- Messages stored in PostgreSQL database
- Real-time updates via WebSocket (optional)

### 3. **Subscription Management**
- Backend handles subscription logic
- Frontend queries backend for user plan status
- Existing Stripe integration preserved

### 4. **Advanced Features**
- Script Generator, Payload Generator, Business Planner
- All available via backend API with proper plan restrictions
- PDF generation handled server-side

## 📊 API Endpoints

The backend provides these key endpoints:

### Authentication
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/conversations` - Get chat history
- `GET /api/chat/stats` - Get usage statistics

### Subscriptions
- `GET /api/subscriptions/status` - Get subscription status
- `GET /api/subscriptions/plans` - Get available plans

### Tools (Premium Features)
- `POST /api/tools/script-generator` - Generate code
- `POST /api/tools/payload-generator` - Security payloads
- `POST /api/tools/business-planner` - Business plans
- `POST /api/tools/generate-pdf` - Create PDFs

### System
- `GET /health` - Backend health check
- `GET /info` - API information

## 🛠️ Development Workflow

### Running Both Services

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Backend Status Monitoring

The frontend includes a `BackendStatus` component that:
- Shows connection status to backend
- Displays backend version and uptime
- Alerts if backend is unavailable
- Auto-refreshes every 30 seconds

## 🚀 Production Deployment

### Option 1: Separate Deployment

**Backend (Railway/Render/Heroku):**
```bash
cd backend
# Set environment variables in platform
# Deploy using platform-specific method
```

**Frontend (Vercel/Netlify):**
```bash
# Set VITE_BACKEND_URL to your backend URL
# Deploy frontend normally
```

### Option 2: Docker Deployment

```bash
cd backend
docker-compose up -d
```

### Option 3: Single Platform (Railway/Render)

Deploy entire repository with:
- Backend running on port from ENV
- Frontend built and served statically

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Configured origins only
- **JWT Validation**: Token verification
- **Input Validation**: Request validation on all endpoints
- **Access Control**: Application-level access control
- **Error Handling**: Secure error responses

## 🧪 Testing the Integration

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Frontend Connection:**
   - Visit http://localhost:8080/chatbot
   - Check for green "Backend connected" status
   - Try sending a chat message

3. **API Testing:**
   ```bash
   # Test chat endpoint (requires auth token)
   curl -X POST http://localhost:3001/api/chat/message \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"message": "Hello", "personality": "mentor"}'
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Backend not connecting:**
   - Check if backend is running on port 3001
   - Verify environment variables are set
   - Check backend logs for errors

2. **CORS errors:**
   - Ensure CORS_ORIGIN includes your frontend URL
   - Check browser network tab for blocked requests

3. **Authentication errors:**
   - Verify JWT secret is correct
   - Check token expiration
   - Ensure user is logged in to frontend

4. **Database errors:**
   - Run migrations: `npm run migrate`
   - Check PostgreSQL connection parameters
   - Verify database permissions

### Debug Commands

```bash
# Check backend logs
cd backend && npm start

# Check frontend console
# Open browser dev tools on http://localhost:8080

# Test backend health
curl http://localhost:3001/health

# Check backend info
curl http://localhost:3001/info
```

## 📈 Next Steps

1. **Production Deployment**: Deploy both services to your preferred platforms
2. **Monitoring**: Set up error tracking and performance monitoring
3. **Scaling**: Add load balancing and database replicas as needed
4. **Features**: Extend API with additional endpoints as required
5. **Testing**: Add comprehensive test coverage

## 🎉 Success!

Your Chatty Web Architect application now has:
- ✅ Connected frontend and backend
- ✅ Real-time chat with GPT-4
- ✅ Subscription management
- ✅ Advanced AI tools
- ✅ Production-ready architecture
- ✅ Proper security measures
- ✅ Monitoring and health checks

The application is ready for production use! 🚀
