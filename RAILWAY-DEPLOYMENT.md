# GRACE AI Executive Dashboard - Railway Edition

**Marketing-Grade Operations Control Center** with live Railway backend integration.

## 🎯 Features Delivered

### KPI Cards
- **Total Alerts Today** - Real-time count with blue bell icon
- **Average Response Time** - Minutes with amber clock indicator
- **Resolution Rate** - Percentage with emerald checkmark

### Live Alert Feed
- Scrolling list of active escalations
- Room number, guest name, issue type
- Live timer showing elapsed time since creation
- Urgency indicators:
  - 🚨 **Critical** (30+ minutes pending) - Pulsing red border
  - ⚠️ **High** (15+ minutes pending) - Amber border
  - 📋 **Normal** (< 15 minutes) - Standard display
- Issue-specific icons and colors:
  - 🚨 Medical/Emergency (red)
  - 💧 Water/Leak (blue)
  - ❄️ AC/Temperature (cyan)
  - 🔊 Noise/Complaint (amber)

### Analytics Graph
- Horizontal bar chart showing alerts by hour
- Last 12 hours with activity displayed
- Emerald gradient bars with count labels
- Dynamic scaling based on peak volume

### Staff Spotlight
- Top 5 responders ranked by total claims
- 🥇 Gold medal for #1
- 🥈 Silver medal for #2
- 🥉 Bronze medal for #3
- Emerald badges showing claim counts

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard runs at `http://localhost:3000` and connects to:
```
https://grace-ai.up.railway.app/staff/dashboard-stats
```

## 📊 Expected API Response Format

Your Railway backend should return:

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
    },
    {
      "room": "308",
      "guest": "Sarah Chen",
      "issue": "Water Leak",
      "status": "IN_PROGRESS",
      "created_at": "2025-01-27T09:15:00Z",
      "claimed_by": "Marcus Rivera"
    }
  ],
  "topResponders": [
    {
      "name": "Marcus Rivera",
      "claims": 23
    },
    {
      "name": "Sofia Delgado",
      "claims": 19
    }
  ]
}
```

### Alternative: Minimal Response

If your backend only returns alerts, the dashboard will calculate metrics automatically:

```json
{
  "alerts": [
    {
      "room": "101",
      "guest": "Alex Knight",
      "issue": "Medical Alert",
      "status": "PENDING",
      "created_at": "2025-01-27T10:30:00Z",
      "claimed_by": null
    }
  ]
}
```

The dashboard will:
- Count total alerts from array length
- Calculate resolution rate from status distribution
- Generate top responders from `claimed_by` field
- Build hourly chart from `created_at` timestamps

## 🎨 Design System

### Colors
- **Background**: Dark slate gradient (900/800)
- **Cards**: Slate 800 with 50% opacity + glassmorphism
- **Borders**: Slate 700 with 50% opacity
- **Emerald**: Success states, resolved items
- **Amber**: Warnings, medium urgency
- **Red**: Critical alerts, medical emergencies
- **Blue**: Information, in-progress status

### Typography
- **Primary**: Inter font family
- **Headers**: Light weight (300)
- **Body**: Regular weight (400)
- **Numbers**: Light weight for elegance

### Animations
- Pulse effect on critical alerts
- Smooth hover transitions on all cards
- Auto-refresh every 5 seconds
- Fade-in on data updates

## 🏗️ File Structure

```
src/
├── main.jsx                          # React entry point
├── App.jsx                           # Root component
├── App.css                           # Global styles
├── index.css                         # Tailwind directives
└── components/
    └── ExecutiveDashboard.jsx        # Main dashboard component
```

## ⚙️ Configuration

### Change Refresh Interval

In `ExecutiveDashboard.jsx`:
```javascript
const interval = setInterval(fetchDashboardData, 5000); // 5 seconds
```

### Update API Endpoint

```javascript
const API_BASE = 'https://grace-ai.up.railway.app';
```

### Customize Urgency Thresholds

```javascript
const getUrgencyLevel = (timestamp, status) => {
  const diffMins = Math.floor((now - created) / 60000);
  
  if (diffMins > 30) return 'critical';  // Change to 45
  if (diffMins > 15) return 'high';      // Change to 20
  if (diffMins > 5) return 'medium';     // Change to 10
  return 'normal';
};
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

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

## 🔍 Troubleshooting

### No Data Showing

1. Check browser console for errors
2. Verify Railway backend is running: `https://grace-ai.up.railway.app/staff/dashboard-stats`
3. Check CORS settings on backend
4. Verify API response format matches expected structure

### CORS Issues

Add to your FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Loading Forever

- Dashboard shows loading screen for 10+ seconds
- Check Network tab in browser DevTools
- Verify endpoint returns valid JSON
- Check for network connectivity issues

## 📈 Performance Optimization

### Implemented Optimizations
- React.StrictMode for development checks
- Component memoization candidates identified
- 5-second polling (configurable)
- Efficient array filtering and mapping
- CSS-in-JS for custom scrollbar styles

### Future Enhancements
- WebSocket integration for true real-time updates
- Virtual scrolling for large alert lists
- Service worker for offline capability
- Progressive Web App (PWA) features

## 🎯 Marketing Features

### Executive-Ready Aesthetics
- Glassmorphism cards with backdrop blur
- Smooth transitions and hover states
- High-contrast urgency indicators
- Professional color palette
- Clean, spacious layout

### Operational Intelligence
- At-a-glance KPIs
- Live alert feed with smart sorting
- Historical trending (hourly chart)
- Staff performance spotlight
- Real-time connection status

### Hospitality-First Design
- Issue-specific iconography
- Guest-centric language
- Clear urgency hierarchy
- Responsive to all screen sizes
- Accessibility-compliant

## 📝 Sample Backend Implementation

### FastAPI Endpoint

```python
from fastapi import FastAPI
from datetime import datetime

@app.get("/staff/dashboard-stats")
async def get_dashboard_stats():
    alerts = db.query(Escalation).filter(
        Escalation.created_at >= datetime.now().date()
    ).all()
    
    resolved = [a for a in alerts if a.status == "RESOLVED"]
    
    # Calculate avg response time
    response_times = [
        (a.claimed_at - a.created_at).total_seconds() / 60
        for a in alerts if a.claimed_at
    ]
    avg_response = sum(response_times) / len(response_times) if response_times else 0
    
    # Get top responders
    responder_counts = {}
    for alert in alerts:
        if alert.claimed_by:
            responder_counts[alert.claimed_by] = responder_counts.get(alert.claimed_by, 0) + 1
    
    top_responders = [
        {"name": name, "claims": count}
        for name, count in sorted(responder_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    ]
    
    return {
        "totalAlerts": len(alerts),
        "avgResponseTime": round(avg_response, 1),
        "resolvedCount": len(resolved),
        "alerts": [
            {
                "room": a.room_number,
                "guest": a.guest_name,
                "issue": a.issue,
                "status": a.status,
                "created_at": a.created_at.isoformat(),
                "claimed_by": a.claimed_by
            }
            for a in alerts
        ],
        "topResponders": top_responders
    }
```

## 🎓 Key Technical Decisions

### Why 5-Second Polling?
- Balance between real-time feel and server load
- Railway free tier friendly
- Sufficient for hospitality use case
- Easy to adjust based on needs

### Why Horizontal Bar Chart?
- More space-efficient than vertical
- Easier to read hour labels
- Better for sidebar layout
- Scales well with varying data

### Why Client-Side Calculations?
- Reduces backend complexity
- Allows dashboard to work with minimal API
- Provides graceful degradation
- Frontend can evolve independently

## 🏆 Production Readiness

✅ Error handling with user-friendly messages  
✅ Loading states with animations  
✅ Responsive design (mobile to 4K)  
✅ Connection status indicator  
✅ Auto-refresh with configurable interval  
✅ Optimized bundle size  
✅ Accessibility features  
✅ Browser compatibility (modern browsers)  

---

**Built for GRACE AI** | Luxury Hospitality Operations | Railway Edition