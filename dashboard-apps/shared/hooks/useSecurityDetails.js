import { useState, useEffect } from 'react';
import { apiGet, apiPut } from '../api/client';

/**
 * SecurityDetails state: password field + MFA option selection.
 * Fetches MFA options and current selection from API.
 */
export function useSecurityDetails() {
    const [mfaOptions, setMfaOptions] = useState([]);
    const [password, setPassword] = useState('********');
    const [mfaOption, setMfaOption] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        apiGet('/api/security')
            .then(res => {
                setMfaOptions(res.mfaOptions || []);
                setMfaOption(res.currentMfa || '');
                setLoading(false);
            })
            .catch(() => { setError('Failed to load security settings.'); setLoading(false); });
    }, []);

    const handleUpdate = () => {
        apiPut('/api/security', { currentMfa: mfaOption })
            .then(() => setSaveStatus({ ok: true, message: 'Security Settings Updated Successfully!' }))
            .catch(() => setSaveStatus({ ok: false, message: 'Update failed. Please try again.' }));
    };

    return {
        password, setPassword,
        mfaOption, setMfaOption,
        handleUpdate,
        mfaOptions,
        loading,
        error,
        saveStatus,
        clearSaveStatus: () => setSaveStatus(null),
    };
}
