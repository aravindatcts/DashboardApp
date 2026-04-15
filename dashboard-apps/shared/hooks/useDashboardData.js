import { useState, useEffect } from 'react';
import { apiGet } from '../api/client';

/**
 * Fetches all dashboard-level data from the API.
 * Used by the web Dashboard page and mobile Dashboard screen.
 */
export function useDashboardData() {
    const [data, setData] = useState({
        planInfo: { plan: '', memberId: '', groupId: '', effective: '', status: '' },
        coveredMembers: [],
        hraBalance: '',
        recentClaims: [],
        dashboardTabs: ['Overview', 'ID Cards', 'Care', 'Coverage', 'Finances'],
        memberOptions: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGet('/api/members')
            .then(res => {
                setData({
                    planInfo: res.planInfo,
                    coveredMembers: res.coveredMembers,
                    hraBalance: res.hraBalance,
                    recentClaims: res.recentClaims,
                    dashboardTabs: res.dashboardTabs,
                    memberOptions: res.memberOptions,
                });
                setLoading(false);
            })
            .catch(() => { setError('Failed to load dashboard data.'); setLoading(false); });
    }, []);

    return { ...data, loading, error };
}
