'use client';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { SkeletonClaimList } from '@/components/Skeleton/Skeleton';
import { useClaimsFilter } from '@shared/hooks/useClaimsFilter';
import { getBadgeStyle, getBadgeLabel } from '@shared/constants/status';
import { formatClaimNumber } from '@shared/utils/formatters';
import type { Claim } from '@/types';
import styles from './Claims.module.scss';

interface BadgeStyle { bg: string; border: string; text: string; }

interface ClaimsFilterHook {
    memberFilter: string;
    setMemberFilter: (v: string) => void;
    providerFilter: string;
    setProviderFilter: (v: string) => void;
    statusFilter: string;
    setStatusFilter: (v: string) => void;
    startDate: string;
    setStartDate: (v: string) => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (fn: (v: boolean) => boolean) => void;
    currentPage: number;
    setCurrentPage: (fn: (v: number) => number) => void;
    totalPages: number;
    paginatedClaims: Claim[];
    filteredCount: number;
    claimMembers: string[];
    claimStatuses: string[];
    clearFilters: () => void;
    loading: boolean;
}

function ClaimCard({ claim, index }: { claim: Claim; index: number }) {
    const router = useRouter();
    const badge = getBadgeStyle(claim.status) as BadgeStyle;
    return (
        <button
            className={`${styles.claimCard} animate-fade-up stagger-${Math.min(index + 1, 8)}`}
            onClick={() => router.push(`/claims/${claim.id}`)}
        >
            <span
                className={styles.claimBadge}
                style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}
            >
                {getBadgeLabel(claim.status)}
            </span>
            <p className={styles.claimId}>Claim number {formatClaimNumber(claim.id)}</p>
            <div className={styles.claimBody}>
                <div className={styles.claimLeft}>
                    <div className={styles.claimInfoRow}>
                        <span className={styles.claimInfoLabel}>Member</span>
                        <span className={styles.claimInfoValue}>{claim.member}</span>
                    </div>
                    <div className={styles.claimInfoRow}>
                        <span className={styles.claimInfoLabel}>Treatment date</span>
                        <span className={styles.claimInfoValue}>{claim.date}</span>
                    </div>
                </div>
                <div className={styles.claimRight}>
                    <span className={styles.claimInfoLabel}>Claim amount</span>
                    <div className={styles.claimAmountRow}>
                        <span className={styles.claimInfoValue}>{claim.amount.replace('$', '')} USD</span>
                        <span className={styles.chevron}>›</span>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default function ClaimsPage() {
    const { t } = useTranslation();
    const {
        memberFilter, setMemberFilter,
        providerFilter, setProviderFilter,
        statusFilter, setStatusFilter,
        startDate, setStartDate,
        isFilterVisible, setIsFilterVisible,
        currentPage, setCurrentPage,
        totalPages, paginatedClaims,
        claimMembers, claimStatuses,
        clearFilters, loading,
    } = useClaimsFilter() as ClaimsFilterHook;

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={`${styles.pageHeader} animate-fade-up`}>
                    <h1 className={styles.pageTitle}>{t('Claims')}</h1>
                    <button
                        className={styles.filterToggle}
                        onClick={() => setIsFilterVisible((v: boolean) => !v)}
                        aria-expanded={isFilterVisible}
                    >
                        {isFilterVisible ? 'Hide Filters ▴' : 'Show Filters ▾'}
                    </button>
                </div>

                {isFilterVisible && (
                    <div className={`${styles.filterCard} animate-slide-down`}>
                        <p className={styles.filterCardTitle}>Search &amp; Filter Claims</p>
                        <div className={styles.filterRow}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Member</label>
                                <select className={styles.filterSelect} value={memberFilter} onChange={e => setMemberFilter(e.target.value)}>
                                    <option value="">All Members</option>
                                    {claimMembers.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Status</label>
                                <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                    <option value="">All Statuses</option>
                                    {claimStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={styles.filterRow}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Provider Name</label>
                                <input
                                    className={styles.filterInput}
                                    placeholder="e.g. General Hospital"
                                    value={providerFilter}
                                    onChange={e => setProviderFilter(e.target.value)}
                                />
                            </div>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Date Range (After)</label>
                                <input
                                    className={styles.filterInput}
                                    placeholder="YYYY-MM-DD"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className={styles.clearBtn} onClick={clearFilters}>Clear All Filters</button>
                    </div>
                )}

                <div className={styles.claimsList}>
                    {loading ? (
                        <SkeletonClaimList count={5} />
                    ) : paginatedClaims.length > 0 ? (
                        <>
                            {paginatedClaims.map((claim: Claim, i: number) => (
                                <ClaimCard key={claim.id} claim={claim} index={i} />
                            ))}
                            {totalPages > 1 && (
                                <div className={`${styles.pagination} animate-fade-in`}>
                                    <button
                                        className={styles.pageBtn}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                                    >‹</button>
                                    <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                                    <button
                                        className={styles.pageBtn}
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                                    >›</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={`${styles.emptyState} animate-scale-in`}>
                            No claims found matching these filters.
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
