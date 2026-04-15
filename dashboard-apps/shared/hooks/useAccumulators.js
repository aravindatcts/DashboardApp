import { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../api/client';

/**
 * Accumulator bar state: member selection, network tab switching, data derivation.
 * Fetches accumulator and member data from the API.
 * @param {boolean} isDetailed - true = Finances tab (shows member picker + In/Out-of-Network tabs)
 *                               false = Overview tab (simplified)
 */
export function useAccumulators(isDetailed = false) {
    const [accumulatorData, setAccumulatorData] = useState({});
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedMember, setSelectedMember] = useState('Sarah Jenkins');
    const [networkTab, setNetworkTab] = useState('In-Network');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGet('/api/members')
            .then(res => {
                setAccumulatorData(res.accumulatorData || {});
                setMemberOptions(res.memberOptions || []);
                setLoading(false);
            })
            .catch(() => { setError('Failed to load accumulator data.'); setLoading(false); });
    }, []);

    const accData = useMemo(() => {
        return accumulatorData[selectedMember] || { inNetwork: [], outNetwork: [] };
    }, [accumulatorData, selectedMember]);

    const tabs = isDetailed
        ? ['In-Network', 'Out-of-Network']
        : ['In-Network', 'Out of Networks'];

    const activeTab = networkTab;

    const setTab = (val) => {
        // Normalize tab value between detailed and overview modes
        if (val === 'Out of Networks') {
            setNetworkTab('Out-of-Network');
        } else {
            setNetworkTab(val);
        }
    };

    // Resolve which tab label is "active" in overview mode
    const resolvedActiveTab = isDetailed
        ? activeTab
        : (activeTab === 'Out-of-Network' ? 'Out of Networks' : activeTab);

    const data = activeTab === 'In-Network' ? accData.inNetwork : accData.outNetwork;

    return {
        selectedMember, setSelectedMember,
        tabs,
        activeTab: resolvedActiveTab,
        setTab,
        data,
        memberOptions,
        loading,
        error,
    };
}
