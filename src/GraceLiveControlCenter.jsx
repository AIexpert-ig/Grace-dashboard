import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, TrendingUp, User, Zap, Activity } from 'lucide-react';
import apiClient from './api-client';

const GraceLiveControlCenter = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [escalations, setEscalations] = useState([]);
    const [metrics, setMetrics] = useState({
        avgTimeToClaim: 0,
        avgTimeToResolve: 0,
        totalPending: 0,
        totalInProgress: 0,
        totalResolved: 0
    });
    const [staffLeaderboard, setStaffLeaderboard] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');

    useEffect(() => {
        setConnectionStatus('connecting');

        const unsubscribe = apiClient.subscribe((data) => {
            setEscalations(data.escalations || []);
            setMetrics(data.metrics || {});
            setStaffLeaderboard(data.leaderboard || []);
            setLastUpdate(new Date());
            setConnectionStatus('connected');
        }, 5000);

        return unsubscribe;
    }, []);

    const handleClaimEscalation = async (escalationId) => {
        try {
            const staffName = prompt('Enter your name to claim this escalation:');
            if (staffName) {
                await apiClient.claimEscalation(escalationId, staffName);
            }
        } catch (error) {
            console.error('Failed to claim escalation:', error);
            alert('Failed to claim escalation. Please try again.');
        }
    };

    const handleUpdateStatus = async (escalationId, newStatus) => {
        try {
            await apiClient.updateEscalationStatus(escalationId, newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return darkMode ? 'text-red-400' : 'text-red-600';
            case 'IN_PROGRESS': return darkMode ? 'text-amber-400' : 'text-amber-600';
            case 'RESOLVED': return darkMode ? 'text-emerald-400' : 'text-emerald-600';
            default: return darkMode ? 'text-gray-400' : 'text-gray-600';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'PENDING': return darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600';
            case 'IN_PROGRESS': return darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600';
            case 'RESOLVED': return darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600';
            default: return darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
        }
    };

    const getUrgencyIndicator = (escalation) => {
        if (!escalation.created_at) return null;

        const ageMinutes = (new Date() - new Date(escalation.created_at)) / 60000;

        if (escalation.status === 'PENDING') {
            if (escalation.issue?.toLowerCase().includes('medical') || escalation.issue?.toLowerCase().includes('emergency')) {
                return { level: 'critical', label: 'CRITICAL', animate: true };
            }
            if (ageMinutes > 15) {
                return { level: 'high', label: 'URGENT', animate: true };
            }
            if (ageMinutes > 5) {
                return { level: 'medium', label: 'ATTENTION', animate: false };
            }
        }
        return null;
    };

    const getUrgencyStyles = (escalation) => {
        const urgency = getUrgencyIndicator(escalation);

        if (urgency?.level === 'critical') {
            return 'border-l-4 border-red-500 bg-gradient-to-r from-red-500/10 to-transparent';
        }
        if (urgency?.level === 'high') {
            return 'border-l-4 border-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent';
        }
        return 'border-l-4 border-transparent';
    };

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'Unknown';
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    const themeClasses = darkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900';

    const cardClasses = darkMode
        ? 'bg-slate-800/50 backdrop-blur-xl border border-slate-700/50'
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50';

    return (
        <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
            {/* Header */}
            <div className="border-b border-gray-700/30 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${darkMode ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-amber-400 to-amber-500'} rounded-lg flex items-center justify-center shadow-lg`}>
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-light tracking-tight">GRACE</h1>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Live Operations Control Center</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Activity className={`w-4 h-4 ${connectionStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`} />
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {connectionStatus === 'connected' ? 'Live' : 'Connecting...'}
                                </span>
                                {lastUpdate && (
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        · Updated {formatTimeAgo(lastUpdate)}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors text-sm`}
                            >
                                {darkMode ? '☀️ Light' : '🌙 Dark'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time to Claim</p>
                                <p className="text-3xl font-light mt-2">{metrics.avgTimeToClaim?.toFixed(1) || 0}<span className="text-lg text-gray-500">m</span></p>
                            </div>
                            <Clock className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} opacity-80`} />
                        </div>
                    </div>

                    <div className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time to Resolve</p>
                                <p className="text-3xl font-light mt-2">{metrics.avgTimeToResolve?.toFixed(1) || 0}<span className="text-lg text-gray-500">m</span></p>
                            </div>
                            <CheckCircle className={`w-8 h-8 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} opacity-80`} />
                        </div>
                    </div>

                    <div className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                                <p className="text-3xl font-light mt-2">{metrics.totalPending || 0}</p>
                            </div>
                            <AlertCircle className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-600'} opacity-80`} />
                        </div>
                    </div>

                    <div className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
                                <p className="text-3xl font-light mt-2">{metrics.totalInProgress || 0}</p>
                            </div>
                            <Activity className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-amber-600'} opacity-80`} />
                        </div>
                    </div>

                    <div className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Resolved</p>
                                <p className="text-3xl font-light mt-2">{metrics.totalResolved || 0}</p>
                            </div>
                            <TrendingUp className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'} opacity-80`} />
                        </div>
                    </div>
                </div>

                {/* Live Escalations */}
                <div className={`${cardClasses} rounded-xl shadow-lg overflow-hidden`}>
                    <div className="px-6 py-4 border-b border-gray-700/30 flex items-center justify-between">
                        <h2 className="text-xl font-light">Live Escalations</h2>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {escalations.length} active
                        </span>
                    </div>
                    <div className="divide-y divide-gray-700/30">
                        {escalations.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <CheckCircle className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-lg`}>All clear</p>
                                <p className={`${darkMode ? 'text-gray-600' : 'text-gray-500'} text-sm mt-1`}>No active escalations at this time</p>
                            </div>
                        ) : (
                            escalations.map((escalation) => {
                                const urgency = getUrgencyIndicator(escalation);
                                return (
                                    <div
                                        key={escalation.id}
                                        className={`px-6 py-4 ${getUrgencyStyles(escalation)} hover:bg-gray-700/10 transition-all`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                                        Room {escalation.room_number}
                                                    </span>
                                                    <span className="font-medium">{escalation.guest_name}</span>
                                                    {urgency && (
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${urgency.animate ? 'animate-pulse' : ''} ${urgency.level === 'critical' ? 'bg-red-500 text-white' :
                                                                urgency.level === 'high' ? 'bg-amber-500 text-white' :
                                                                    'bg-amber-400 text-gray-900'
                                                            }`}>
                                                            {urgency.label}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                                                    {escalation.issue}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                        Created {formatTimeAgo(escalation.created_at)}
                                                    </span>
                                                    {escalation.claimed_by && (
                                                        <>
                                                            <span className={`flex items-center space-x-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                                <User className="w-4 h-4" />
                                                                <span>{escalation.claimed_by}</span>
                                                            </span>
                                                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                                Claimed {formatTimeAgo(escalation.claimed_at)}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusBadgeColor(escalation.status)}`}>
                                                    {escalation.status?.replace('_', ' ')}
                                                </span>

                                                {escalation.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleClaimEscalation(escalation.id)}
                                                        className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                                                    >
                                                        Claim
                                                    </button>
                                                )}

                                                {escalation.status === 'IN_PROGRESS' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(escalation.id, 'RESOLVED')}
                                                        className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'} text-white transition-colors`}
                                                    >
                                                        Resolve
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Staff Leaderboard */}
                <div className={`${cardClasses} rounded-xl shadow-lg overflow-hidden`}>
                    <div className="px-6 py-4 border-b border-gray-700/30">
                        <h2 className="text-xl font-light">Staff Performance</h2>
                    </div>
                    <div className="p-6">
                        {staffLeaderboard.length === 0 ? (
                            <div className="text-center py-8">
                                <p className={darkMode ? 'text-gray-500' : 'text-gray-400'}>No performance data available</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {staffLeaderboard.map((staff, index) => (
                                    <div key={staff.name} className="flex items-center justify-between group hover:bg-gray-700/5 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${index === 0 ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg' :
                                                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                                                        index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' :
                                                            darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{staff.name}</p>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {staff.claims} claims · {staff.avgResolve?.toFixed(1)}m avg resolve
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                            {staff.claims} tasks
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraceLiveControlCenter;