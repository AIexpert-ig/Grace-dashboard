import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Bell, CheckCircle, Clock, AlertTriangle, TrendingUp, 
  Users, Activity, Shield, MapPin, Search, Calendar
} from 'lucide-react';

const ExecutiveDashboard = () => {
  const [stats, setStats] = useState({
    totalAlerts: 0,
    avgResponseTime: "4.2m",
    resolvedCount: 0,
    alerts: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://grace-ai.up.railway.app/staff/dashboard-stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard Feed Error:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            GRACE AI
          </h1>
          <p className="text-slate-400">Executive Command Center | Real-time Operations</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Activity className="text-emerald-400 w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">System Live</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-500/10 p-3 rounded-xl"><Bell className="text-blue-400" /></div>
            <span className="text-emerald-400 text-sm font-bold">+12%</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Total Active Alerts</h3>
          <p className="text-3xl font-bold mt-1">{stats.totalAlerts}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-500/10 p-3 rounded-xl"><Clock className="text-amber-400" /></div>
            <span className="text-emerald-400 text-sm font-bold">-0.8m</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Avg Response Time</h3>
          <p className="text-3xl font-bold mt-1">{stats.avgResponseTime}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl"><CheckCircle className="text-emerald-400" /></div>
            <span className="text-emerald-400 text-sm font-bold">+24</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Resolved Today</h3>
          <p className="text-3xl font-bold mt-1">{stats.resolvedCount}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <AlertTriangle className="text-amber-400 w-5 h-5" />
            Live Escalation Feed
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-sm">
                <th className="p-4">Room</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Incident</th>
                <th className="p-4">Status</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stats.alerts.map((alert, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-blue-400">{alert.room}</td>
                  <td className="p-4">{alert.guest}</td>
                  <td className="p-4">{alert.issue}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      alert.status === 'PENDING' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">Just now</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
