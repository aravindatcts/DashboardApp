import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useClaimsFilter } from '@shared/hooks/useClaimsFilter';
import { getBadgeStyle } from '@shared/constants/status';

// ↑ mockClaims data moved to @shared/data/claims.js

const ClaimCard = ({ claim }) => {
    const navigation = useNavigation();
    const badgeStyle = getBadgeStyle(claim.status); // from @shared/constants/status

    return (
        <TouchableOpacity
            style={styles.claimCardItem}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ClaimDetail', { claim })}
        >
            <View style={[styles.claimBadgeWrapper, { backgroundColor: badgeStyle.backgroundColor, borderColor: badgeStyle.borderColor }]}>
                <Text style={[styles.claimBadgeText, { color: badgeStyle.color, fontWeight: '600' }]}>{claim.status === 'Paid' ? 'Claim processed' : `Claim ${claim.status.toLowerCase()}`}</Text>
            </View>
            <Text style={styles.claimIdTitle}>Claim number {claim.id.replace('CLM', '')}</Text>

            <View style={styles.claimMainContent}>
                <View style={styles.claimLeft}>
                    <View style={styles.claimInfoRow}>
                        <Text style={styles.infoLabel}>Member</Text>
                        <Text style={styles.infoValue}>{claim.member}</Text>
                    </View>
                    <View style={styles.claimInfoRow}>
                        <Text style={styles.infoLabel}>Treatment date</Text>
                        <Text style={styles.infoValue}>{claim.date}</Text>
                    </View>
                </View>

                <View style={styles.claimCenter}>
                    {/* Empty placeholder for alignment or extra data */}
                </View>

                <View style={styles.claimRight}>
                    <Text style={styles.infoLabel}>Claim amount</Text>
                    <View style={styles.claimAmountRow}>
                        <Text style={styles.infoValue}>{claim.amount.replace('$', '')} USD</Text>
                        <Text style={styles.chevronIcon}>›</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function Claims() {
    // All filter + pagination logic from @shared/hooks/useClaimsFilter
    const {
        memberFilter, setMemberFilter,
        providerFilter, setProviderFilter,
        statusFilter, setStatusFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        isFilterVisible, setIsFilterVisible,
        currentPage, setCurrentPage,
        totalPages, paginatedClaims, filteredCount,
        clearFilters,
        claimMembers, claimStatuses,
    } = useClaimsFilter();

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.scrollContent}>
                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Claims</Text>
                        <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)} style={styles.filterToggleBtn}>
                            <Text style={styles.filterToggleText}>
                                {isFilterVisible ? 'Hide Filters ▴' : 'Show Filters ▾'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {isFilterVisible && (
                        <View style={styles.filterCard}>
                            <Text style={styles.filterCardTitle}>Search & Filter Claims</Text>

                            <View style={styles.filterRow}>
                                <View style={styles.filterGroup}>
                                    <Text style={styles.label}>Member</Text>
                                    <View style={styles.pickerWrapper}>
                                        <select
                                            value={memberFilter}
                                            onChange={(e) => setMemberFilter(e.target.value)}
                                            style={styles.pickerWeb}
                                        >
                                            <option value="">All Members</option>
                                            {claimMembers.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </View>
                                </View>
                                <View style={styles.filterGroup}>
                                    <Text style={styles.label}>Status</Text>
                                    <View style={styles.pickerWrapper}>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            style={styles.pickerWeb}
                                        >
                                            <option value="">All Statuses</option>
                                            {claimStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.filterRow}>
                                <View style={styles.filterGroup}>
                                    <Text style={styles.label}>Provider Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. General Hospital"
                                        value={providerFilter}
                                        onChangeText={setProviderFilter}
                                    />
                                </View>
                                <View style={styles.filterGroup}>
                                    <Text style={styles.label}>Date Range (After)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="YYYY-MM-DD"
                                        value={startDate}
                                        onChangeText={setStartDate}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.clearBtn}
                                onPress={() => {
                                    setMemberFilter('');
                                    setProviderFilter('');
                                    setStatusFilter('');
                                    setStartDate('');
                                    setEndDate('');
                                }}
                            >
                                <Text style={styles.clearBtnText}>Clear All Filters</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.claimsListContainer}>
                        {paginatedClaims.length > 0 ? (
                            <>
                                {paginatedClaims.map((claim, idx) => (
                                    <ClaimCard key={idx} claim={claim} />
                                ))}
                                {totalPages > 1 && (
                                    <View style={styles.pagination}>
                                        <TouchableOpacity
                                            style={styles.pageBtnIcon}
                                            disabled={currentPage === 1}
                                            onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        >
                                            <Text style={[styles.pageBtnText, currentPage === 1 && { color: '#ccc' }]}>‹</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.pageInfoText}>
                                            Page {currentPage} of {totalPages}
                                        </Text>

                                        <TouchableOpacity
                                            style={styles.pageBtnIcon}
                                            disabled={currentPage === totalPages}
                                            onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        >
                                            <Text style={[styles.pageBtnText, currentPage === totalPages && { color: '#ccc' }]}>›</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        ) : (
                            <View style={styles.claimsCard}>
                                <Text style={styles.noData}>No claims found matching these filters.</Text>
                            </View>
                        )}
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f7',
    },
    scrollContainer: {
        paddingVertical: 20,
    },
    scrollContent: {
        paddingHorizontal: '10%',
        zIndex: 1,
    },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 24,
        fontFamily: '-apple-system',
        fontWeight: '700',
        fontFamily: '-apple-system',
        color: '#004a99',
    },
    filterToggleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#004a99',
        borderRadius: 6,
    },
    filterToggleText: {
        color: '#004a99',
        fontWeight: '600',
        fontFamily: '-apple-system',
        fontSize: 14,
        fontFamily: '-apple-system',
    },
    filterCard: {
        backgroundColor: '#f0f8ff',
        borderWidth: 1,
        borderColor: '#b9d5f5',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#004a99',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    filterCardTitle: {
        fontSize: 16,
        fontFamily: '-apple-system',
        fontWeight: '600',
        fontFamily: '-apple-system',
        marginBottom: 16,
        color: '#222',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    filterGroup: {
        flex: 0.48,
    },
    label: {
        fontSize: 13,
        fontFamily: '-apple-system',
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
        fontFamily: '-apple-system',
    },
    input: {
        borderWidth: 1,
        borderColor: '#b9d5f5',
        borderRadius: 6,
        padding: 10,
        fontSize: 14,
        fontFamily: '-apple-system',
        backgroundColor: '#fff',
        color: '#004a99'
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#b9d5f5',
        borderRadius: 6,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    pickerWeb: {
        width: '100%',
        padding: 10,
        borderWidth: 0,
        fontSize: 14,
        fontFamily: '-apple-system',
        backgroundColor: 'transparent',
        outlineStyle: 'none',
        color: '#004a99'
    },
    clearBtn: {
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        backgroundColor: '#f5f5f7',
    },
    clearBtnText: {
        color: '#333',
        fontWeight: '500',
        fontFamily: '-apple-system',
        fontSize: 14,
        fontFamily: '-apple-system',
    },
    claimsListContainer: {
        marginBottom: 20,
    },
    claimCardItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    claimBadgeWrapper: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: 10,
    },
    claimBadgeText: {
        fontSize: 12,
        fontFamily: '-apple-system',
        color: '#333',
    },
    claimIdTitle: {
        fontSize: 18,
        fontFamily: '-apple-system',
        fontWeight: 'bold',
        fontFamily: '-apple-system',
        color: '#222',
        marginBottom: 12,
    },
    claimMainContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    claimLeft: {
        flex: 1,
    },
    claimCenter: {
        flex: 0.5,
    },
    claimRight: {
        flexDirection: 'column',
    },
    claimInfoRow: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'center',
    },
    infoLabel: {
        width: 120,
        fontSize: 14,
        fontFamily: '-apple-system',
        color: '#555',
    },
    infoValue: {
        fontSize: 14,
        fontFamily: '-apple-system',
        fontWeight: 'bold',
        fontFamily: '-apple-system',
        color: '#222',
        marginLeft: 10,
    },
    claimAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    chevronIcon: {
        fontSize: 24,
        fontFamily: '-apple-system',
        color: '#005bea',
        fontWeight: 'bold',
        fontFamily: '-apple-system',
        marginLeft: 30,
        transform: [{ translateY: -2 }],
    },
    claimsCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    noData: {
        padding: 20,
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    pageBtnIcon: {
        padding: 10,
        marginHorizontal: 4,
    },
    pageBtnText: {
        color: '#666',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: '-apple-system',
    },
    pageInfoText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        marginHorizontal: 12,
        fontFamily: '-apple-system',
    },
    pageCircle: {
        backgroundColor: '#333',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    pageCircleText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: '-apple-system',
        fontSize: 14,
        fontFamily: '-apple-system',
    }
});
