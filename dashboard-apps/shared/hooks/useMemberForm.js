import { useState, useEffect } from 'react';
import { apiGet, apiPut } from '../api/client';

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    billingAddress: '',
    mailingAddress: '',
};

/**
 * MemberInformation edit form state.
 * Fetches initial data from API and saves changes via PUT.
 */
export function useMemberForm() {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        apiGet('/api/member-form')
            .then(res => { setFormData(res); setLoading(false); })
            .catch(() => { setError('Failed to load member form data.'); setLoading(false); });
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = () => {
        apiPut('/api/member-form', formData)
            .then(() => {
                setIsEditing(false);
                setSaveStatus({ ok: true, message: 'Information Updated Successfully!' });
            })
            .catch(() => {
                setSaveStatus({ ok: false, message: 'Update failed. Please try again.' });
            });
    };

    return {
        formData,
        isEditing, setIsEditing,
        handleChange,
        handleUpdate,
        loading,
        error,
        saveStatus,
        clearSaveStatus: () => setSaveStatus(null),
    };
}
