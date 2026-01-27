import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  User,
  Activity,
  Bell,
  BarChart3
} from 'lucide-react';

const ExecutiveDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const API_BASE = 'https://grace-ai.up.railway.app';

  // Fetch dashboard statistics
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/staff/dashboard-stats`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const data = await response.json();
      setDashboardData(data);

      // Extract alerts if they're in the response
      if (data.alerts) {
        setAlerts(data.alerts);
      }

      setLastUpdate(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time elapsed since creation
  const getTimeElapsed = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`;
    return `${Math.floor(diffHours / 24)}d ${diffHours % 24}h`;
  };

  // Determine urgency level based on time elapsed
  const getUrgencyLevel = (timestamp, status) => {
    if (status !== 'PENDING') return 'normal';

    const now = new Date();
    const created = new Date(timestamp);
    const diffMins = Math.floor((now - created) / 60000);

    if (diffMins > 30) return 'critical';
    if (diffMins > 15) return 'high';
    if (diffMins > 5) return 'medium';
    return 'normal';
  };

  // Get issue type color and icon
  const getIssueStyle = (issue) => {
    const issueLower = issue?.toLowerCase() || '';

    if (issueLower.includes('medical') || issueLower.includes('emergency')) {
      return { color: 'text-red-400', bg: 'bg-red-500/20', icon: '🚨' };
    }
    if (issueLower.includes('water') || issueLower.includes('leak')) {
      return { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '💧' };
    }
    if (issueLower.includes('ac') || issueLower.includes('temperature')) {
      return { color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: '❄️' };
    }
    if (issueLower.includes('noise') || issueLower.includes('complaint')) {
      return { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: '🔊' };
    }
    return { color: 'text-gray-400', bg: 'bg-gray-500/20', icon: '📋' };
  };

  // Generate hourly chart data
  const getHourlyData = () => {
    if (!alerts || alerts.length === 0) {
      return Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
    }

    const hourlyCounts = Array(24).fill(0);
    alerts.forEach(alert => {
      if (alert.created_at) {
        const hour = new Date(alert.created_at).getHours();
        hourlyCounts[hour]++;
      }
    });

    return hourlyCounts.map((count, hour) => ({ hour, count }));
  };

  const hourlyData = getHourlyData();
  const maxHourlyCount = Math.max(...hourlyData.map(d => d.count), 1);

  // Calculate KPIs
  const totalAlertsToday = alerts?.length || dashboardData?.totalAlerts || 0;
  const avgResponseTime = dashboardData?.avgResponseTime || 0;
  const resolvedCount = alerts?.filter(a => a.status === 'RESOLVED').length || dashboardData?.resolvedCount || 0;
  const resolutionRate = totalAlertsToday > 0 ? Math.round((resolvedCount / totalAlertsToday) * 100) : 0;

  // Get top responders
  const getTopResponders = () => {
    if (dashboardData?.topResponders) {
      return dashboardData.topResponders;
    }

    // Calculate from alerts if not provided
    const responderMap = {};
    alerts?.forEach(alert => {
      if (alert.claimed_by) {
        responderMap[alert.claimed_by] = (responderMap[alert.claimed_by] || 0) + 1;
      }
    });

    return Object.entries(responderMap)
      .map(([name, claims]) => ({ name, claims }))
      .sort((a, b) => b.claims - a.claims)
      .slice(0, 5);
  };

  const topResponders = getTopResponders();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading GRACE Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-2">Connection Error</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* Header */}
      <div className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light tracking-tight">GRACE AI</h1>
                <p className="text-xs text-gray-400">Executive Operations Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs text-gray-400">Live</span>
                {lastUpdate && (
                  <span className="text-xs text-gray-600">
                    · {lastUpdate.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Alerts Today */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Alerts Today</p>
                <p className="text-4xl font-light text-white">{totalAlertsToday}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-400">Active monitoring</span>
            </div>
          </div>

          {/* Average Response Time */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg Response Time</p>
                <p className="text-4xl font-light text-white">
                  {avgResponseTime.toFixed(1)}
                  <span className="text-xl text-gray-500 ml-1">min</span>
                </p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-400">First response benchmark</span>
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Resolution Rate</p>
                <p className="text-4xl font-light text-white">
                  {resolutionRate}
                  <span className="text-xl text-gray-500 ml-1">%</span>
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-emerald-400">{resolvedCount} resolved</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">{totalAlertsToday - resolvedCount} active</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Alert Feed - Takes 2 columns */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/30 flex items-center justify-between">
              <h2 className="text-xl font-light flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Live Alert Feed</span>
              </h2>
              <span className="text-sm text-gray-400">
                {alerts?.filter(a => a.status === 'PENDING').length || 0} pending
              </span>
            </div>

            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              {alerts && alerts.length > 0 ? (
                <div className="divide-y divide-slate-700/30">
                  {alerts.map((alert, index) => {
                    const urgency = getUrgencyLevel(alert.created_at, alert.status);
                    const elapsed = getTimeElapsed(alert.created_at);
                    const issueStyle = getIssueStyle(alert.issue);
                    const isPending = alert.status === 'PENDING';
                    const isResolved = alert.status === 'RESOLVED';

                    return (
                      <div
                        key={index}
                        className={`px-6 py-4 transition-all hover:bg-slate-700/20 ${urgency === 'critical' && isPending
                            ? 'bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 animate-pulse'
                            : urgency === 'high' && isPending
                              ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500'
                              : 'border-l-4 border-transparent'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{issueStyle.icon}</span>
                              <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs font-medium">
                                Room {alert.room}
                              </span>
                              <span className="text-sm font-medium text-gray-300">
                                {alert.guest}
                              </span>
                              {urgency === 'critical' && isPending && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
                                  CRITICAL
                                </span>
                              )}
                            </div>

                            <p className={`text-lg mb-2 ${issueStyle.color} font-medium`}>
                              {alert.issue}
                            </p>

                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center space-x-1 text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{elapsed}</span>
                              </span>
                              {alert.claimed_by && (
                                <span className="flex items-center space-x-1 text-blue-400">
                                  <User className="w-4 h-4" />
                                  <span>{alert.claimed_by}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${isPending
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : isResolved
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}
                            >
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-400/30 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">All Clear</p>
                  <p className="text-gray-600 text-sm mt-1">No active alerts at this time</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Hourly Analytics Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/30">
                <h2 className="text-xl font-light flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>Alerts by Hour</span>
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-2">
                  {hourlyData.filter(d => d.count > 0).slice(-12).map((data) => (
                    <div key={data.hour} className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500 w-8">
                        {data.hour.toString().padStart(2, '0')}:00
                      </span>
                      <div className="flex-1 bg-slate-700/30 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ width: `${(data.count / maxHourlyCount) * 100}%` }}
                        >
                          {data.count > 0 && (
                            <span className="text-xs text-white font-medium">{data.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hourlyData.every(d => d.count === 0) && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Staff Spotlight */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/30">
                <h2 className="text-xl font-light flex items-center space-x-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span>Top Responders</span>
                </h2>
              </div>

              <div className="p-6">
                {topResponders && topResponders.length > 0 ? (
                  <div className="space-y-4">
                    {topResponders.map((responder, index) => (
                      <div
                        key={responder.name}
                        className="flex items-center justify-between p-3 bg-slate-700/20 rounded-xl hover:bg-slate-700/40 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${index === 0
                                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                                : index === 1
                                  ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                  : index === 2
                                    ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white'
                                    : 'bg-slate-700 text-gray-300'
                              }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">{responder.name}</p>
                            <p className="text-xs text-gray-500">
                              {responder.claims} {responder.claims === 1 ? 'claim' : 'claims'}
                            </p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/20 rounded-full">
                          <span className="text-sm font-medium text-emerald-400">
                            {responder.claims}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No activity yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ExecutiveDashboard;