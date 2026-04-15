import { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../api/client';

const ITEMS_PER_PAGE = 5;

/**
 * Encapsulates the full claims filter + pagination logic.
 * Fetches all claims from API once, then filters client-side.
 * Platform-agnostic: returns plain state and handlers, no RN/DOM APIs.
 */
export function useClaimsFilter() {
    const [allClaims, setAllClaims] = useState([]);
    const [claimMembers, setClaimMembers] = useState([]);
    const [claimStatuses, setClaimStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [memberFilter, setMemberFilter] = useState('');
    const [providerFilter, setProviderFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        apiGet('/api/claims?limit=1000')
            .then(res => {
                setAllClaims(res.claims || []);
                setClaimMembers(res.members || []);
                setClaimStatuses(res.statuses || []);
                setLoading(false);
            })
            .catch(() => { setError('Failed to load claims.'); setLoading(false); });
    }, []);

    const filteredClaims = useMemo(() => {
        return allClaims.filter(claim => {
            if (memberFilter && claim.member !== memberFilter) return false;
            if (providerFilter && !claim.provider.toLowerCase().includes(providerFilter.toLowerCase())) return false;
            if (statusFilter && claim.status !== statusFilter) return false;
            if (startDate && claim.date < startDate) return false;
            if (endDate && claim.date > endDate) return false;
            return true;
        });
    }, [allClaims, memberFilter, providerFilter, statusFilter, startDate, endDate]);

    const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [memberFilter, providerFilter, statusFilter, startDate, endDate]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedClaims = filteredClaims.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const clearFilters = () => {
        setMemberFilter('');
        setProviderFilter('');
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
    };

    return {
        // Filter state
        memberFilter, setMemberFilter,
        providerFilter, setProviderFilter,
        statusFilter, setStatusFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        isFilterVisible, setIsFilterVisible,
        // Pagination
        currentPage, setCurrentPage,
        totalPages,
        paginatedClaims,
        filteredCount: filteredClaims.length,
        // Actions
        clearFilters,
        // API-driven options
        claimMembers,
        claimStatuses,
        // Status
        loading,
        error,
    };
}
