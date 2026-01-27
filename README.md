# GRACE AI Executive Dashboard

**Marketing-Grade Operations Control Center** with live Railway backend integration.

![GRACE AI Dashboard](https://img.shields.io/badge/GRACE-AI-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge)

## 🎯 Overview

A sophisticated executive dashboard that transforms operational data into actionable intelligence. Built for luxury hospitality operations with real-time monitoring, performance analytics, and staff performance tracking.

### Key Features

✨ **Live KPI Monitoring**
- Total alerts today with trend indicators
- Average response time in minutes
- Resolution rate percentage

🚨 **Real-Time Alert Feed**
- Scrolling list with urgency-based sorting
- Visual indicators for critical situations
- Time-elapsed tracking for each alert
- Issue-specific icons and color coding

📊 **Performance Analytics**
- Hourly alert distribution chart
- Peak time identification
- Historical trending visualization

👥 **Staff Performance**
- Top responders leaderboard
- Medal system for top 3 performers
- Total claims per staff member

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

The dashboard automatically connects to your Railway backend:
```
https://grace-ai.up.railway.app/staff/dashboard-stats
```

## 📦 Project Structure

```
grace-executive-dashboard/
├── src/
│   ├── main.jsx                      # React entry point
│   ├── App.jsx                       # Root component
│   ├── App.css                       # Global styles
│   ├── index.css                     # Tailwind directives
│   └── components/
│       └── ExecutiveDashboard.jsx    # Main dashboard
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Build config
├── tailwind.config.js                # Tailwind config
└── postcss.config.js                 # PostCSS config
```

## 🎨 Design System

### Color Palette
```javascript
Background: slate-900/800 (dark gradient)
Cards: slate-800/50 (glassmorphism)
Emerald: Success, resolved states
Amber: Warnings, medium urgency
Red: Critical alerts, emergencies
Blue: Information, in-progress
```

### Typography
- **Font**: Inter (300, 400, 500, 600, 700)
- **Headers**: Light weight for elegance
- **Metrics**: Large numerals with subtle units

### Animations
- Critical alerts pulse effect
- Smooth card hover transitions
- Real-time data refresh
- Progress bar animations

## 📊 API Integration

### Expected Response Format

```json
{
  "totalAlerts": 47,
  "avgResponseTime": 5.2,
  "resolvedCount": 32,
  "alerts": [
    {
      "room": "101",
      "guest": "Alex Knight",
      "issue": "Medical Alert",
      "status": "PENDING",
      "created_at": "2025-01-27T10:30:00Z",
      "claimed_by": null
    }
  ],
  "topResponders": [
    {
      "name": "Marcus Rivera",
      "claims": 23
    }
  ]
}
```

### Minimal Format (Auto-Calculated)

If your backend only returns alerts, metrics are calculated client-side:

```json
{
  "alerts": [
    {
      "room": "101",
      "guest": "Alex Knight",
      "issue": "Medical Alert",
      "status": "PENDING",
      "created_at": "2025-01-27T10:30:00Z",
      "claimed_by": "Staff Name"
    }
  ]
}
```

## ⚙️ Configuration

### Update API Endpoint

Edit `src/components/ExecutiveDashboard.jsx`:
```javascript
const API_BASE = 'https://your-api.up.railway.app';
```

### Change Refresh Interval

```javascript
const interval = setInterval(fetchDashboardData, 5000); // 5 seconds
```

### Customize Urgency Thresholds

```javascript
if (diffMins > 30) return 'critical';  // Change threshold
if (diffMins > 15) return 'high';      // Change threshold
if (diffMins > 5) return 'medium';     // Change threshold
```

### Modify Color Scheme

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      grace: {
        gold: '#C6A661',
        charcoal: '#2B2B2B',
      },
    },
  },
}
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Environment variables are not needed as API URL is hardcoded.

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Railway Frontend

Create `railway.toml`:
```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm run preview"
restartPolicyType = "on_failure"
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Tech Stack

- **React 18.2** - UI library
- **Vite 5.0** - Build tool
- **Tailwind CSS 3.4** - Styling
- **Lucide React** - Icon system
- **PostCSS** - CSS processing

## 🐛 Troubleshooting

### Dashboard Shows Loading Forever

1. Check browser console for errors
2. Verify Railway backend is accessible
3. Test API endpoint directly in browser
4. Check CORS configuration

### CORS Errors

Add to your FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### No Data Displayed

- Verify API returns valid JSON
- Check data structure matches expected format
- Look for JavaScript errors in console
- Ensure alerts array is not empty

### Styling Issues

```bash
# Rebuild Tailwind classes
npm run build

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## 📈 Performance

### Optimization Features
- Component-level data fetching
- Efficient array operations
- 5-second polling (configurable)
- Dynamic chart rendering
- Smooth animations with CSS

### Bundle Size
- Main bundle: ~150KB (gzipped)
- Vendor bundle: ~140KB (gzipped)
- Total initial load: ~290KB

## 🎯 Urgency System

### Alert Levels

**Critical** (30+ minutes pending)
- Pulsing red border animation
- High-priority sorting
- "CRITICAL" badge

**High** (15-30 minutes pending)
- Amber border gradient
- Medium-priority sorting

**Medium** (5-15 minutes pending)
- Standard display
- Normal sorting

**Normal** (< 5 minutes)
- Clean card design
- Time-based sorting

### Issue Type Icons

- 🚨 Medical/Emergency (red)
- 💧 Water/Leak (blue)
- ❄️ AC/Temperature (cyan)
- 🔊 Noise/Complaint (amber)
- 📋 General (gray)

## 🏆 Production Checklist

✅ Error handling with user-friendly messages  
✅ Loading states with animations  
✅ Responsive design (320px to 4K)  
✅ Connection status indicator  
✅ Auto-refresh functionality  
✅ Optimized bundle size  
✅ Accessibility features  
✅ Browser compatibility  
✅ Mobile-optimized layout  
✅ Fast refresh in development  

## 📝 License

Private project for GRACE AI operations.

## 🤝 Support

For technical support or deployment assistance, refer to:
- `RAILWAY-DEPLOYMENT.md` - Detailed deployment guide
- Railway dashboard - Backend logs and metrics
- Browser DevTools - Frontend debugging

---

**Built for GRACE AI** | Luxury Hospitality Operations | The AI Concierge™