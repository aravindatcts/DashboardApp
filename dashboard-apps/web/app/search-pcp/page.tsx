'use client';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { SkeletonProviderList } from '@/components/Skeleton/Skeleton';
import { useProviderSearch } from '@shared/hooks/useProviderSearch';
import type { Provider, SearchCategory } from '@/types';
import styles from './SearchPcp.module.scss';

interface ProviderSearchHook {
    searchCategory: string;
    setSearchCategory: (v: string) => void;
    searchName: string;
    setSearchName: (v: string) => void;
    doctorType: string;
    setDoctorType: (v: string) => void;
    facilityType: string;
    setFacilityType: (v: string) => void;
    searchCity: string;
    setSearchCity: (v: string) => void;
    searchRadius: number;
    setSearchRadius: (v: number) => void;
    showAdvancedFilters: boolean;
    setShowAdvancedFilters: (fn: (v: boolean) => boolean) => void;
    showMap: boolean;
    setShowMap: (fn: (v: boolean) => boolean) => void;
    showNameSuggestions: boolean;
    setShowNameSuggestions: (v: boolean) => void;
    currentPage: number;
    totalPages: number;
    currentProviders: Provider[];
    indexOfFirstItem: number;
    indexOfLastItem: number;
    filteredCount: number;
    goToPage: (page: number) => void;
    suggestedNames: string[];
    SEARCH_CATEGORIES: SearchCategory[];
    PROVIDER_TYPES: string[];
    FACILITY_TYPES: string[];
    loading: boolean;
}

export default function SearchPcpPage() {
    const { t } = useTranslation();
    const {
        searchCategory, setSearchCategory,
        searchName, setSearchName,
        doctorType, setDoctorType,
        facilityType, setFacilityType,
        searchCity, setSearchCity,
        searchRadius, setSearchRadius,
        showAdvancedFilters, setShowAdvancedFilters,
        showMap, setShowMap,
        showNameSuggestions, setShowNameSuggestions,
        currentPage, totalPages, currentProviders,
        indexOfFirstItem, indexOfLastItem, filteredCount,
        goToPage, suggestedNames,
        SEARCH_CATEGORIES, PROVIDER_TYPES, FACILITY_TYPES,
        loading,
    } = useProviderSearch() as ProviderSearchHook;

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>Find a Doctor or Facility</h1>
            </div>

            <main className={styles.main}>
                {/* Search Card */}
                <div className={styles.searchCard}>
                    {/* Category Tabs */}
                    <div className={styles.tabRow}>
                        {SEARCH_CATEGORIES.map((cat: SearchCategory) => (
                            <button
                                key={cat.id}
                                className={`${styles.tabBtn} ${searchCategory === cat.id ? styles.tabBtnActive : ''}`}
                                onClick={() => { setSearchCategory(cat.id); goToPage(1); }}
                            >
                                <span className={styles.tabIcon}>{cat.icon}</span>
                                <span className={styles.tabLabel}>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search Input Area */}
                    {searchCategory === 'Search Using Agent' && (
                        <div className={styles.agentBox}>
                            <p className={styles.agentPrompt}>
                                You can Search by Saying — Find me a dentist who is having 4 stars. Find a Family Physician who can talk in Spanish. Or just say, I am having a throat pain and find an appropriate doctor for it.
                            </p>
                            <div className={styles.agentInputRow}>
                                <textarea
                                    className={styles.agentInput}
                                    placeholder="How can I help you find care...?"
                                    value={searchName}
                                    rows={2}
                                    onChange={e => { setSearchName(e.target.value); goToPage(1); }}
                                />
                                <button className={styles.primaryBtn} onClick={() => goToPage(1)}>Ask</button>
                            </div>
                        </div>
                    )}

                    {searchCategory === 'By Name' && (
                        <div className={styles.autocompleteWrap}>
                            <input
                                className={styles.mainInput}
                                placeholder="Enter Provider Name"
                                value={searchName}
                                onFocus={() => setShowNameSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowNameSuggestions(false), 200)}
                                onChange={e => { setSearchName(e.target.value); goToPage(1); setShowNameSuggestions(true); }}
                            />
                            {showNameSuggestions && (suggestedNames as string[]).length > 0 && (
                                <div className={styles.suggestions}>
                                    {(suggestedNames as string[]).map((name, idx) => (
                                        <button key={idx} className={styles.suggestionItem} onMouseDown={() => { setSearchName(name); setShowNameSuggestions(false); goToPage(1); }}>
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {searchCategory === 'By Specialty' && (
                        <div className={styles.chipGrid}>
                            {(PROVIDER_TYPES as string[]).map(type => (
                                <button
                                    key={type}
                                    className={`${styles.chip} ${doctorType === type ? styles.chipActive : ''}`}
                                    onClick={() => { setDoctorType(type); goToPage(1); }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}

                    {searchCategory === 'By Group/Facility' && (
                        <div className={styles.chipGrid}>
                            {(FACILITY_TYPES as string[]).map(type => (
                                <button
                                    key={type}
                                    className={`${styles.chip} ${facilityType === type ? styles.chipActive : ''}`}
                                    onClick={() => { setFacilityType(type); goToPage(1); }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}

                    {searchCategory !== 'Search Using Agent' && (
                        <div className={styles.searchBtnRow}>
                            <button className={styles.primaryBtn} onClick={() => goToPage(1)}>Search Providers</button>
                        </div>
                    )}

                    {/* Location + Radius */}
                    <div className={styles.locationRow}>
                        <div className={styles.locationField}>
                            <label className={styles.fieldLabel}>Your Location (City, State, or ZIP)</label>
                            <div className={styles.locationInputWrap}>
                                <input
                                    className={styles.locationInput}
                                    placeholder="Enter City, State, or ZIP"
                                    value={searchCity}
                                    onChange={e => { setSearchCity(e.target.value); goToPage(1); }}
                                />
                                <span className={styles.gpsIcon} aria-hidden="true">⌖</span>
                            </div>
                        </div>
                        <div className={styles.radiusField}>
                            <label className={styles.fieldLabel}>Search Radius</label>
                            <div className={styles.radiusRow}>
                                <input
                                    type="range"
                                    min={1}
                                    max={100}
                                    value={searchRadius}
                                    className={styles.rangeInput}
                                    onChange={e => { setSearchRadius(Number(e.target.value)); goToPage(1); }}
                                />
                                <span className={styles.radiusBadge}>{searchRadius} miles</span>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className={styles.advHeader}>
                        <span className={styles.advLabel}>Advanced Filters</span>
                        <button className={styles.advToggle} onClick={() => setShowAdvancedFilters((v: boolean) => !v)}>
                            {showAdvancedFilters ? '−' : '+'}
                        </button>
                    </div>
                    {showAdvancedFilters && (
                        <div className={styles.advPanel}>
                            <p className={styles.fieldLabel}>Additional filters can go here.</p>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className={styles.resultsSection}>
                    <div className={styles.resultsHeader}>
                        <p className={styles.resultsCount}>
                            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredCount)} of {filteredCount} providers
                        </p>
                        <button className={styles.mapToggle} aria-pressed={showMap} onClick={() => setShowMap((v: boolean) => !v)}>
                            {showMap ? 'Hide Map' : 'Show Map'}
                        </button>
                    </div>

                    {/* Map Placeholder */}
                    {showMap && (
                        <div className={styles.mapContainer}>
                            {currentProviders.map((provider: Provider, i: number) => (
                                <div
                                    key={i}
                                    className={styles.mapMarker}
                                    style={{ top: `${20 + i * 15}%`, left: `${30 + i * 10}%` }}
                                >
                                    <div className={styles.markerDot} style={{ backgroundColor: i === 0 ? '#004a99' : '#00c3a5' }} />
                                    <div className={styles.markerLabel}>{provider.name}</div>
                                </div>
                            ))}
                            <div className={styles.mapOverlay}>
                                <p className={styles.mapOverlayTitle}>Interactive Map View</p>
                                <p className={styles.mapOverlaySub}>Page {currentPage} providers shown</p>
                            </div>
                        </div>
                    )}

                    {/* Provider Cards */}
                    <div className={styles.providerGrid}>
                        {loading ? (
                            <SkeletonProviderList count={4} />
                        ) : null}
                        {!loading && currentProviders.map((provider: Provider, i: number) => (
                            <div key={provider.id} className={`${styles.providerCard} animate-fade-up stagger-${Math.min(i + 1, 8)}`}>
                                <div className={styles.providerCardInner}>
                                    <div className={styles.providerLeft}>
                                        <img src={provider.photo} alt={`Photo of ${provider.name}`} className={styles.providerPhoto} />
                                        <div className={styles.ratingRow}>
                                            <span className={styles.star}>★</span>
                                            <span className={styles.rating}>{provider.rating}</span>
                                        </div>
                                    </div>
                                    <div className={styles.providerRight}>
                                        <p className={styles.providerName}>{provider.name}</p>
                                        <p className={styles.providerSpec}>{provider.specialty}</p>
                                        <div className={styles.providerInfoRow}>
                                            <span aria-hidden="true">📍</span>
                                            <span className={styles.providerInfoText}>{provider.address}</span>
                                        </div>
                                        <div className={styles.providerInfoRow}>
                                            <span aria-hidden="true">📞</span>
                                            <span className={styles.providerInfoText}>{provider.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.providerActions}>
                                    <button className={styles.viewProfileBtn}>View Profile</button>
                                    <button className={styles.scheduleBtn}>Schedule Appointment</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button className={styles.pageCtrl} disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                                Previous
                            </button>
                            <div className={styles.pageNumbers}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        className={`${styles.pageNum} ${currentPage === p ? styles.pageNumActive : ''}`}
                                        onClick={() => goToPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button className={styles.pageCtrl} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
