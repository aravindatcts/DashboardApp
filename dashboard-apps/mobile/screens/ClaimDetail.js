import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBadgeStyle } from '@shared/constants/status';
import { buildClaimTimeline } from '@shared/utils/timeline';

export default function ClaimDetail({ route }) {
    const navigation = useNavigation();
    const { claim } = route.params || {};

    if (!claim) {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.errorContent}>
                    <Text style={styles.errorText}>Claim not found.</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backBtnText}>← Back to Claims</Text>
                    </TouchableOpacity>
                </View>
                <Footer />
            </View>
        );
    }

    // Timeline and badge from shared utilities
    const timeline = buildClaimTimeline(claim);
    const badgeStyle = getBadgeStyle(claim.status);

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.scrollContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>‹ Back to Claims</Text>
                    </TouchableOpacity>

                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Claim Detail</Text>
                        <TouchableOpacity style={styles.downloadBtn}>
                            <Text style={styles.pdfIcon}>📄</Text>
                            <Text style={styles.downloadBtnText}>EOB Download</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Main Details Card */}
                    <View style={styles.detailCard}>
                        {/* ... card content stays same ... */}
                        <View style={styles.cardHeader}>
                            <View>
                                <View style={[styles.badgeWrapper, { backgroundColor: badgeStyle.backgroundColor, borderColor: badgeStyle.borderColor }]}>
                                    <Text style={[styles.badgeText, { color: badgeStyle.color }]}>{claim.status === 'Paid' ? 'Claim processed' : `Claim ${claim.status.toLowerCase()}`}</Text>
                                </View>
                                <Text style={styles.claimIdTitle}>Claim number {claim.id.replace('CLM', '')}</Text>
                            </View>
                            <View style={styles.amountContainer}>
                                <Text style={styles.amountLabel}>Claim amount</Text>
                                <Text style={styles.amountValue}>{claim.amount.replace('$', '')} USD</Text>
                            </View>
                        </View>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoCol}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Member</Text>
                                    <Text style={styles.infoValue}>{claim.member}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Date of Treatment</Text>
                                    <Text style={styles.infoValue}>{claim.date}</Text>
                                </View>
                            </View>
                            <View style={styles.infoCol}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Provider</Text>
                                    <Text style={styles.infoValue}>{claim.provider}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Diagnosis</Text>
                                    <Text style={styles.infoValue}>J01.90 - Acute sinusitis</Text>
                                </View>
                            </View>
                        </View>

                        {/* Responsibility Breakdown Bar */}
                        <View style={styles.responsibilitySection}>
                            <Text style={styles.breakdownTitle}>Financial Responsibility Breakdown</Text>
                            <View style={styles.stackedBarWrapper}>
                                <View style={styles.stackedBarContainer}>
                                    <View style={[styles.barSegment, { flex: 0.8, backgroundColor: '#004a99' }]} />
                                    <View style={[styles.barSegment, { flex: 0.2, backgroundColor: '#00c3a5' }]} />
                                </View>
                                <View style={[styles.barJointWrapper, { left: '80%' }]}>
                                    <Text style={styles.barJointLabel}>{claim?.amount || '$850.00'}</Text>
                                    <View style={styles.barSplitLine} />
                                </View>
                            </View>
                            <View style={styles.legendContainer}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#004a99' }]} />
                                    <Text style={styles.legendText}>Payor Responsibility:</Text>
                                    <Text style={styles.legendValue}>${(parseFloat(claim.amount.replace('$', '')) * 0.8).toFixed(2)}</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#00c3a5' }]} />
                                    <Text style={styles.legendText}>Patient Responsibility:</Text>
                                    <Text style={styles.legendValue}>${(parseFloat(claim.amount.replace('$', '')) * 0.2).toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Timeline View */}
                    <View style={styles.timelineCard}>
                        {/* ... timeline content ... */}
                        <Text style={styles.timelineTitle}>Processing Timeline</Text>
                        <View style={styles.horizontalTimelineContainer}>
                            {timeline.map((item, index) => {
                                const isTop = index % 2 === 0;
                                const bgColors = ['#f8bbd0', '#ffe082', claim.status === 'Denied' ? '#ef9a9a' : '#a5d6a7'];
                                const darkColors = ['#c2185b', '#f57f17', claim.status === 'Denied' ? '#d32f2f' : '#388e3c'];

                                const bgColor = item.completed ? bgColors[index] : '#e0e0e0';
                                const darkColor = item.completed ? darkColors[index] : '#9e9e9e';
                                const zIndex = 10 - index;

                                return (
                                    <View key={index} style={[styles.arrowWrapper, { zIndex, marginLeft: index === 0 ? 0 : -15 }]}>
                                        <View style={[styles.arrowBody, { backgroundColor: bgColor, paddingLeft: index === 0 ? 0 : 15 }]}>
                                            <Text style={[styles.arrowStatusText, { color: darkColor }]}>{item.status}</Text>

                                            {isTop ? (
                                                <View style={styles.nodeTop}>
                                                    <Text style={styles.nodeDate}>{item.completed ? item.date : 'Pending'}</Text>
                                                    <View style={[styles.nodeDot, { backgroundColor: darkColor, marginBottom: -2 }]} />
                                                    <View style={[styles.nodeLine, { backgroundColor: darkColor }]} />
                                                </View>
                                            ) : (
                                                <View style={styles.nodeBottom}>
                                                    <View style={[styles.nodeLine, { backgroundColor: darkColor }]} />
                                                    <View style={[styles.nodeDot, { backgroundColor: darkColor, marginTop: -2 }]} />
                                                    <Text style={styles.nodeDate}>{item.completed ? item.date : 'Pending'}</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={[styles.arrowHead, { borderLeftColor: bgColor }]} />
                                    </View>
                                );
                            })}
                        </View>
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
        flexGrow: 1,
    },
    errorContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 18,
    fontFamily: '-apple-system',
        color: '#666',
        marginBottom: 20,
    },
    backBtn: {
        padding: 10,
    },
    backBtnText: {
        color: '#004a99',
        fontSize: 16,
    fontFamily: '-apple-system',
        fontWeight: '600',
    fontFamily: '-apple-system',
    },
    breadcrumb: {
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    breadcrumbText: {
        color: '#004a99',
        fontSize: 14,
    fontFamily: '-apple-system',
        fontWeight: '600',
    fontFamily: '-apple-system',
    },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 28,
    fontFamily: '-apple-system',
        fontWeight: '700',
    fontFamily: '-apple-system',
        color: '#004a99',
    },
    downloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#004a99',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    pdfIcon: {
        fontSize: 16,
    fontFamily: '-apple-system',
        marginRight: 8,
    },
    downloadBtnText: {
        color: '#004a99',
        fontWeight: '600',
    fontFamily: '-apple-system',
        fontSize: 14,
    fontFamily: '-apple-system',
    },
    detailCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 20,
        marginBottom: 20,
    },
    badgeWrapper: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: 12,
    },
    badgeText: {
        fontSize: 12,
    fontFamily: '-apple-system',
        fontWeight: '600',
    fontFamily: '-apple-system',
    },
    claimIdTitle: {
        fontSize: 22,
    fontFamily: '-apple-system',
        fontWeight: 'bold',
    fontFamily: '-apple-system',
        color: '#222',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amountLabel: {
        fontSize: 14,
    fontFamily: '-apple-system',
        color: '#666',
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 24,
    fontFamily: '-apple-system',
        fontWeight: 'bold',
    fontFamily: '-apple-system',
        color: '#004a99',
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoCol: {
        flex: 0.48,
    },
    infoRow: {
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 13,
    fontFamily: '-apple-system',
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    fontFamily: '-apple-system',
    },
    infoValue: {
        fontSize: 15,
    fontFamily: '-apple-system',
        fontWeight: '600',
    fontFamily: '-apple-system',
        color: '#222',
    },
    responsibilitySection: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    breakdownTitle: {
        fontSize: 14,
    fontFamily: '-apple-system',
        fontWeight: '700',
    fontFamily: '-apple-system',
        color: '#444',
        marginBottom: 12,
    },
    stackedBarWrapper: {
        position: 'relative',
        height: 32,
        marginBottom: 16,
        justifyContent: 'center',
    },
    stackedBarContainer: {
        flexDirection: 'row',
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
    },
    barSegment: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    barJointWrapper: {
        position: 'absolute',
        alignItems: 'center',
        width: 100,
        marginLeft: -50, // Center the labels on the joint
        top: -24, // Position above the 32px bar
        zIndex: 10,
    },
    barJointLabel: {
        fontSize: 11,
    fontFamily: '-apple-system',
        fontWeight: 'bold',
    fontFamily: '-apple-system',
        color: '#222',
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 2,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    barSplitLine: {
        width: 2,
        height: 52, // Taller to extend well above and below
        backgroundColor: '#888', // Medium gray
    },
    barLabel: {
        color: 'white',
        fontSize: 10,
    fontFamily: '-apple-system',
        fontWeight: 'bold',
    fontFamily: '-apple-system',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendText: {
        fontSize: 13,
    fontFamily: '-apple-system',
        color: '#666',
        marginRight: 4,
    },
    legendValue: {
        fontSize: 13,
    fontFamily: '-apple-system',
        fontWeight: '700',
    fontFamily: '-apple-system',
        color: '#222',
    },
    timelineCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 24,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 24,
    },
    timelineTitle: {
        fontSize: 18,
    fontFamily: '-apple-system',
        fontWeight: '600',
    fontFamily: '-apple-system',
        color: '#222',
        marginBottom: 20,
    },
    horizontalTimelineContainer: {
        flexDirection: 'row',
        paddingVertical: 80, // Restored space for nodes
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    arrowWrapper: {
        flexDirection: 'row',
        flex: 1,
    },
    arrowBody: {
        flex: 1,
        height: 44, // Slightly taller for status text
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowStatusText: {
        fontWeight: 'bold',
    fontFamily: '-apple-system',
        fontSize: 12,
    fontFamily: '-apple-system',
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    arrowHead: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 0,
        borderBottomWidth: 22,
        borderTopWidth: 22,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    nodeTop: {
        position: 'absolute',
        bottom: 44,
        alignItems: 'center',
        width: 140,
    },
    nodeBottom: {
        position: 'absolute',
        top: 44,
        alignItems: 'center',
        width: 140,
    },
    nodeDate: {
        fontSize: 12,
    fontFamily: '-apple-system',
        color: '#666',
        textAlign: 'center',
    },
    nodeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    nodeLine: {
        width: 1,
        height: 20,
    }
});
