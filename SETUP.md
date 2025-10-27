# Setup Guide

## Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Stripe Account
- Claude/OpenAI API Keys

## Environment Variables

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/creative-freelance-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# AI APIs
CLAUDE_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
COMMISSION_RATE=0.15

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Installation

### 1. Install Dependencies
```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (recommended)
# Update MONGODB_URI in backend/.env
```

### 3. Start Development Servers

#### Option A: Run both (from root)
```bash
npm run dev
```

#### Option B: Run separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Gigs
- GET /api/gigs - Get all gigs (with filters)
- GET /api/gigs/:id - Get single gig
- POST /api/gigs - Create gig (auth required)
- PUT /api/gigs/:id - Update gig
- POST /api/gigs/:id/bid - Place bid

### Projects
- GET /api/projects - Get user's projects
- GET /api/projects/:id - Get project details
- POST /api/projects - Create project
- POST /api/projects/:id/complete - Mark as complete
- POST /api/projects/:id/review - Submit review

### AI
- POST /api/ai/generate-gig-ideas - Generate gig ideas
- POST /api/ai/generate-proposal - Generate proposal
- POST /api/ai/generate-content - Generate content
- GET /api/ai/usage - Get AI usage stats

### Payments
- POST /api/payments/create-payment-intent - Create payment
- POST /api/payments/subscribe - Subscribe to premium
- POST /api/payments/cancel-subscription - Cancel subscription

## Testing

### Manual Testing
1. Register as client and freelancer (use different browsers/incognito)
2. Client: Post a gig
3. Freelancer: Browse and bid on gig
4. Client: Accept bid and create project
5. Test AI features in AI Assistant page

### API Testing with curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"freelancer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get gigs
curl http://localhost:5000/api/gigs
```

## Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy: `git push heroku main`

### Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/dist`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- For Atlas: Whitelist your IP

### CORS Error
- Verify FRONTEND_URL in backend .env
- Check proxy settings in frontend vite.config.js

### AI API Errors
- Verify API keys are correct
- Check API quota/billing

## Next Steps
1. Configure MongoDB (local or Atlas)
2. Get API keys (Stripe, Claude, OpenAI)
3. Set up environment variables
4. Run `npm install` in root, backend, and frontend
5. Start development servers
6. Begin testing!
