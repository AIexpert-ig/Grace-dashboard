# GRACE Dashboard - Quick Start Guide

## Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure backend URL
cp .env.example .env
# Edit .env and set your FastAPI backend URL

# 3. Start development server
npm run dev
```

Dashboard will be available at `http://localhost:3000`

## Production Deployment

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Option 2: Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Docker
```bash
docker build -t grace-dashboard .
docker run -p 3000:3000 grace-dashboard
```

## Backend Requirements

Your FastAPI backend must expose these endpoints:

```
GET  /api/escalations
GET  /api/metrics
GET  /api/staff/leaderboard
POST /api/escalations/{id}/claim
PATCH /api/escalations/{id}/status
```

## Key Features

✓ **Live Escalations** - Real-time monitoring with 5s polling
✓ **Performance Metrics** - Time to claim/resolve, active counts
✓ **Staff Leaderboard** - Claims ranking with average times
✓ **Dark/Light Mode** - Luxury hospitality aesthetic
✓ **Urgency Indicators** - Pulsing alerts for critical issues
✓ **Interactive Actions** - One-click claim and resolution

## File Structure

```
├── GraceLiveControlCenter.jsx  → Main dashboard (production)
├── api-client.js               → Backend integration
├── main.jsx                    → App entry point
├── index.html                  → HTML template
├── package.json                → Dependencies
└── vite.config.js              → Build configuration
```

## Customization

**Change polling interval:**
```javascript
// In GraceLiveControlCenter.jsx
apiClient.subscribe(callback, 10000); // 10 seconds
```

**Update brand colors:**
```javascript
// In tailwind.config.js
colors: {
  grace: {
    gold: '#YOUR_COLOR',
    charcoal: '#YOUR_COLOR',
  }
}
```

## Troubleshooting

**CORS errors:**
Add to FastAPI backend:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
)
```

**Connection issues:**
Check backend URL in `.env`:
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

---

**Built for GRACE AI** | Luxury Hospitality Operations