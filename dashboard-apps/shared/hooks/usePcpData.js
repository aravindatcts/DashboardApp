import { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../api/client';

/**
 * PCP card: member picker + resolved PCP data.
 * Fetches PCP and member options from the API.
 */
export function usePcpData() {
    const [pcpData, setPcpData] = useState({});
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedMember, setSelectedMember] = useState('Sarah Jenkins');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGet('/api/members')
            .then(res => {
                setPcpData(res.pcpData || {});
                setMemberOptions(res.memberOptions || []);
                setLoading(false);
            })
            .catch(() => { setError('Failed to load PCP data.'); setLoading(false); });
    }, []);

    const currentPcp = useMemo(() => pcpData[selectedMember] || {}, [pcpData, selectedMember]);

    return {
        selectedMember, setSelectedMember,
        currentPcp,
        memberOptions,
        loading,
        error,
    };
}
