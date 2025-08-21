# Chatty Web Architect Backend

A comprehensive Node.js/Express backend server for the Chatty Web Architect AI chatbot application.

## Features

- **Authentication**: JWT-based authentication with PostgreSQL
- **AI Chat**: OpenAI GPT-4 integration with multiple personalities
- **Subscription Management**: Tiered subscription plans with Stripe integration
- **Advanced Tools**: 
  - Script Generator (Premium+)
  - Payload Generator (Elite+)
  - Business Planner (Elite+)
  - PDF Generator (Premium+)
- **Real-time**: WebSocket support for live updates
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: PostgreSQL with direct connection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication
- **AI**: OpenAI GPT-4
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Getting Started

### Prerequisites

- Node.js 16+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chatty-web-architect/backend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3001
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=false
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
# SMTP configuration for password reset emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user@example.com
SMTP_PASS=your_smtp_password
# URL of your frontend for password reset link
FRONTEND_URL=http://localhost:8080
```

4. Run database migrations
```bash
# Run the migrations using the provided script
npm run migrate
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Reset password

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/conversations/:id` - Get specific conversation
- `DELETE /api/chat/conversations/:id` - Delete conversation
- `PATCH /api/chat/conversations/:id` - Update conversation
- `GET /api/chat/stats` - Get chat statistics

### User Management
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete account
- `GET /api/users/activity` - Get user activity
- `GET /api/users/usage` - Get usage statistics

### Subscriptions
- `GET /api/subscriptions/status` - Get subscription status
- `GET /api/subscriptions/plans` - Get available plans
- `POST /api/subscriptions/checkout` - Create checkout session
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/history` - Get subscription history
- `GET /api/subscriptions/usage` - Get usage analytics

### Tools
- `POST /api/tools/script-generator` - Generate code scripts
- `POST /api/tools/payload-generator` - Generate security payloads
- `POST /api/tools/business-planner` - Generate business plans
- `POST /api/tools/generate-pdf` - Generate PDF documents
- `GET /api/tools/usage-history` - Get tools usage history
- `GET /api/tools/available` - Get available tools

## Subscription Tiers

### Free
- 15 messages per day
- Basic AI responses
- Voice-to-text
- Basic personalities

### Premium ($9.99/month)
- Unlimited messages
- GPT-4 responses
- All personalities
- Script generator
- PDF export

### Elite ($19.99/month)
- Everything in Premium
- Payload generator
- Advanced tools
- Stealth mode
- API access

### Lifetime ($299.99)
- Everything in Elite
- Lifetime access
- Future updates
- VIP support

## WebSocket Events

The server supports real-time communication via Socket.io:

- `onlineUsers` - Broadcast online user count
- `customEvent` - Handle custom client events

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes by default
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Input Validation**: Request validation with express-validator
- **Authentication**: JWT token verification for protected routes
- **Access Control**: Application-level access control

## Database Schema

### Core Tables
- `conversations` - Chat conversations
- `messages` - Individual chat messages
- `subscribers` - User subscription information
- `tool_usage` - Tool usage tracking

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route handlers
│   ├── websocket/       # WebSocket handlers
│   └── server.js        # Main server file
├── migrations/          # Database migrations
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run build` - Build project

## Production Deployment & Monitoring

### Process Management
- Use [PM2](https://pm2.keymetrics.io/) for zero-downtime restarts and monitoring:
  ```bash
  npm install -g pm2
  pm2 start ecosystem.config.js
  pm2 status
  pm2 logs
  ```

### Logging
- All logs are output to stdout/stderr (use PM2 or Docker logging drivers to collect).
- For advanced logging, integrate with services like Datadog, Loggly, or ELK stack.

### Monitoring
- Use PM2 monitoring, or integrate with external tools (Datadog, New Relic, etc.).

### SSL/Reverse Proxy
- Recommended: Use Nginx or Caddy as a reverse proxy for SSL termination.
- Example Nginx config:
  ```nginx
  server {
    listen 443 ssl;
    server_name yourdomain.com;
    ssl_certificate /etc/ssl/certs/your.crt;
    ssl_certificate_key /etc/ssl/private/your.key;

    location / {
      proxy_pass http://localhost:3001;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
  ```

## Deployment

### Environment Variables
Ensure all required environment variables are set:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - PostgreSQL database host
- `DB_PORT` - PostgreSQL database port (default: 5432)
- `DB_NAME` - PostgreSQL database name
- `DB_USER` - PostgreSQL database user
- `DB_PASSWORD` - PostgreSQL database password
- `DB_SSL` - PostgreSQL SSL mode (true/false)
- `OPENAI_API_KEY` - OpenAI API key
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Allowed CORS origins

### Production Considerations
- Use PM2 or similar process manager
- Set up SSL/TLS certificates
- Configure reverse proxy (nginx)
- Set up monitoring and logging
- Use environment-specific configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
