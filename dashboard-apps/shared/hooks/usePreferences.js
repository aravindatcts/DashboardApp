import { useState, useEffect } from 'react';
import { apiGet, apiPut } from '../api/client';

const EMPTY_PREFS = {
    language: '',
    emailPrefs: '',
    deliveryEob: '',
    deliveryTax: '',
};

/**
 * Preferences dropdown state.
 * Fetches preferences from API and saves changes via PUT.
 */
export function usePreferences() {
    const [prefs, setPrefs] = useState(EMPTY_PREFS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        apiGet('/api/preferences')
            .then(res => { setPrefs(res.preferences || EMPTY_PREFS); setLoading(false); })
            .catch(() => { setError('Failed to load preferences.'); setLoading(false); });
    }, []);

    const handleChange = (field, value) => {
        setPrefs(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = () => {
        apiPut('/api/preferences', { preferences: prefs })
            .then(() => setSaveStatus({ ok: true, message: 'Preferences Updated Successfully!' }))
            .catch(() => setSaveStatus({ ok: false, message: 'Update failed. Please try again.' }));
    };

    return {
        prefs,
        handleChange,
        handleUpdate,
        loading,
        error,
        saveStatus,
        clearSaveStatus: () => setSaveStatus(null),
    };
}
