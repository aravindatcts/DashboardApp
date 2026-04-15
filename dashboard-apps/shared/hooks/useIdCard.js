import { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../api/client';

/**
 * ID Card display: member picker + front/back flip.
 * Fetches card data and member options from the API.
 */
export function useIdCard() {
    const [idCardData, setIdCardData] = useState({});
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedMember, setSelectedMember] = useState('Sarah Jenkins');
    const [showBack, setShowBack] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGet('/api/members')
            .then(res => {
                setIdCardData(res.idCardData || {});
                setMemberOptions(res.memberOptions || []);
                setLoading(false);
            })
            .catch(() => { setError('Failed to load ID card data.'); setLoading(false); });
    }, []);

    const memberId = useMemo(() => idCardData[selectedMember] || '', [idCardData, selectedMember]);

    const toggleSide = () => setShowBack(prev => !prev);

    return {
        selectedMember, setSelectedMember,
        showBack,
        toggleSide,
        memberId,
        memberOptions,
        loading,
        error,
    };
}
