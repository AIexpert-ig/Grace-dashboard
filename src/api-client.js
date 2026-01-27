/**
 * GRACE API Client
 * Production-ready integration layer for FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class GraceAPIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Dashboard Statistics
    async getDashboardStats() {
        return this.request('/staff/dashboard-stats');
    }

    // Escalations
    async getEscalations(status = null) {
        const query = status ? `?status=${status}` : '';
        return this.request(`/escalations${query}`);
    }

    async getEscalationById(id) {
        return this.request(`/escalations/${id}`);
    }

    async claimEscalation(id, staffName) {
        return this.request(`/escalations/${id}/claim`, {
            method: 'POST',
            body: JSON.stringify({ claimed_by: staffName }),
        });
    }

    async updateEscalationStatus(id, status) {
        return this.request(`/escalations/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    // Metrics
    async getMetrics(timeRange = '24h') {
        return this.request(`/metrics?range=${timeRange}`);
    }

    async getAverageTimeToClaim() {
        return this.request('/metrics/time-to-claim');
    }

    async getAverageTimeToResolve() {
        return this.request('/metrics/time-to-resolve');
    }

    // Staff Performance
    async getStaffLeaderboard(limit = 10) {
        return this.request(`/staff/leaderboard?limit=${limit}`);
    }

    async getStaffPerformance(staffName) {
        return this.request(`/staff/${encodeURIComponent(staffName)}/performance`);
    }

    // Real-time updates (WebSocket alternative using polling)
    subscribe(callback, interval = 5000) {
        const pollData = async () => {
            try {
                const [escalations, metrics, leaderboard] = await Promise.all([
                    this.getEscalations(),
                    this.getMetrics(),
                    this.getStaffLeaderboard(),
                ]);

                callback({
                    escalations,
                    metrics,
                    leaderboard,
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        pollData();
        const intervalId = setInterval(pollData, interval);

        return () => clearInterval(intervalId);
    }
}

export default new GraceAPIClient();