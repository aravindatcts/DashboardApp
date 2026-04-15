import { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../api/client';

const ITEMS_PER_PAGE = 6;

/**
 * Encapsulates all SearchPcp filtering + pagination logic.
 * Fetches all providers from API once, then filters client-side.
 */
export function useProviderSearch() {
    const [allProviders, setAllProviders] = useState([]);
    const [SEARCH_CATEGORIES, setSearchCategories] = useState([]);
    const [PROVIDER_TYPES, setProviderTypes] = useState([]);
    const [FACILITY_TYPES, setFacilityTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchCategory, setSearchCategory] = useState('Search Using Agent');
    const [searchName, setSearchName] = useState('');
    const [doctorType, setDoctorType] = useState('All');
    const [facilityType, setFacilityType] = useState('All');
    const [searchCity, setSearchCity] = useState('');
    const [searchRadius, setSearchRadius] = useState(25);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showMap, setShowMap] = useState(true);
    const [showNameSuggestions, setShowNameSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        apiGet('/api/providers?limit=1000')
            .then(res => {
                setAllProviders(res.providers || []);
                setSearchCategories(res.searchCategories || []);
                setProviderTypes(res.providerTypes || []);
                setFacilityTypes(res.facilityTypes || []);
                setLoading(false);
            })
            .catch(() => { setError('Failed to load providers.'); setLoading(false); });
    }, []);

    const filteredProviders = useMemo(() => {
        return allProviders.filter(p => {
            let matchesCategory = true;
            if (searchCategory === 'By Name') {
                matchesCategory = p.name.toLowerCase().includes(searchName.toLowerCase());
            } else if (searchCategory === 'By Specialty' && doctorType !== 'All') {
                matchesCategory = p.specialty === doctorType;
            } else if (searchCategory === 'By Group/Facility' && facilityType !== 'All') {
                matchesCategory = p.facility === facilityType;
            }
            const matchesCity = searchCity === '' || p.city.toLowerCase().includes(searchCity.toLowerCase());
            const distanceVal = parseFloat(p.distance.split(' ')[0]);
            const matchesRange = distanceVal <= searchRadius;
            return matchesCategory && matchesCity && matchesRange;
        });
    }, [allProviders, searchCategory, searchName, doctorType, facilityType, searchCity, searchRadius]);

    const totalPages = Math.ceil(filteredProviders.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const indexOfLastItem = indexOfFirstItem + ITEMS_PER_PAGE;
    const currentProviders = filteredProviders.slice(indexOfFirstItem, indexOfLastItem);

    // Autocomplete suggestions for "By Name" mode
    const uniqueProviderNames = useMemo(() => [...new Set(allProviders.map(p => p.name))], [allProviders]);
    const suggestedNames = useMemo(() =>
        uniqueProviderNames.filter(name => name.toLowerCase().includes(searchName.toLowerCase())),
        [uniqueProviderNames, searchName]
    );

    // Reset to page 1 when any filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchCategory, searchName, doctorType, facilityType, searchCity, searchRadius]);

    const goToPage = (page) => setCurrentPage(page);

    return {
        // Filter state
        searchCategory, setSearchCategory,
        searchName, setSearchName,
        doctorType, setDoctorType,
        facilityType, setFacilityType,
        searchCity, setSearchCity,
        searchRadius, setSearchRadius,
        showAdvancedFilters, setShowAdvancedFilters,
        showMap, setShowMap,
        showNameSuggestions, setShowNameSuggestions,
        // Pagination
        currentPage, totalPages,
        currentProviders,
        indexOfFirstItem, indexOfLastItem,
        filteredCount: filteredProviders.length,
        goToPage,
        // Autocomplete
        suggestedNames,
        // Options (from API)
        SEARCH_CATEGORIES,
        PROVIDER_TYPES,
        FACILITY_TYPES,
        // Status
        loading,
        error,
    };
}
