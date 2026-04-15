import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProviderProfile({ route }) {
    const { provider } = route.params;
    const { t } = useTranslation();

    // Mock data for the provider details not in the search results
    const providerDetails = {
        degree: 'Doctor of Medicine (MD)',
        college: 'Harvard Medical School',
        graduationYear: '2005',
        bio: 'Dr. ' + provider.name.split(' ').pop() + ' is a dedicated healthcare provider with over 15 years of experience in ' + provider.specialty + '. He is committed to providing compassionate and comprehensive care to all his patients.',
        reviews: [
            { id: 1, user: 'Mary S.', rating: 5, comment: 'Excellent doctor! Very attentive and knowledgeable.', date: 'Oct 2025' },
            { id: 2, user: 'John D.', rating: 4, comment: 'Great experience, but wait time was a bit long.', date: 'Sep 2025' },
            { id: 3, user: 'Linda M.', rating: 5, comment: 'Dr. ' + provider.name.split(' ').pop() + ' really took the time to explain everything.', date: 'Aug 2025' },
            { id: 4, user: 'Robert K.', rating: 5, comment: 'Highly recommend for anyone needing ' + provider.specialty + '.', date: 'Jul 2025' },
            { id: 5, user: 'Sarah W.', rating: 4, comment: 'Very professional staff and great care.', date: 'Jun 2025' },
        ]
    };

    const renderRating = (rating) => {
        return (
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={[styles.starIcon, { color: star <= Math.floor(rating) ? '#FFD700' : '#E0E0E0' }]}>
                        ★
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.content}>
                <View style={styles.breadcrumbs}>
                    <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                        <Text style={styles.breadcrumbLink}>{t('Home')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.breadcrumbSeparator}> / </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SearchPcp')}>
                        <Text style={styles.breadcrumbLink}>{t('Search Provider')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.breadcrumbSeparator}> / </Text>
                    <Text style={styles.breadcrumbCurrent}>{provider.name}</Text>
                </View>

                <View style={styles.mainLayout}>
                    {/* Left Column: Provider Info */}
                    <View style={styles.infoColumn}>
                        <View style={styles.providerInfoCard}>
                            <View style={styles.headerRow}>
                                <Image source={{ uri: provider.photo }} style={styles.avatar} />
                                <View style={styles.headerText}>
                                    <Text style={styles.providerName}>{provider.name}</Text>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{provider.specialty}</Text>
                                    </View>
                                    {renderRating(provider.rating)}
                                </View>
                            </View>

                            <View style={styles.detailsGroup}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>📍 {t('Address')}:</Text>
                                    <Text style={styles.detailValue}>{provider.address}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>📞 {t('Contact')}:</Text>
                                    <Text style={styles.detailValue}>{provider.phone || '(803) 355-7730'}</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>🎓 {t('College Degree')}:</Text>
                                    <Text style={styles.detailValue}>{providerDetails.degree}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>🏫 {t('College Information')}:</Text>
                                    <Text style={styles.detailValue}>{providerDetails.college} (Class of {providerDetails.graduationYear})</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Right Column: Map Placeholder */}
                    <View style={styles.mapColumn}>
                        <View style={styles.mapPlaceholder}>
                            <View style={styles.mapBackground}>
                                <Text style={styles.mapIcon}>🗺️</Text>
                                <Text style={styles.mapText}>Google Maps View for</Text>
                                <Text style={styles.mapProviderName}>{provider.name}</Text>
                                <View style={styles.mapMarker}>
                                    <View style={styles.markerDot} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom Section: Member Reviews */}
                <View style={styles.reviewsSection}>
                    <Text style={styles.sectionTitle}>{t('Member Reviews')} ({t('Top 5')})</Text>
                    {providerDetails.reviews.map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewUser}>
                                    <View style={styles.userCircle}><Text style={styles.userInitials}>{review.user.charAt(0)}</Text></View>
                                    <Text style={styles.userName}>{review.user}</Text>
                                </View>
                                <Text style={styles.reviewDate}>{review.date}</Text>
                            </View>
                            {renderRating(review.rating)}
                            <Text style={styles.reviewComment}>{review.comment}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <Footer compact />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    content: {
        flex: 1,
        paddingHorizontal: Platform.OS === 'web' ? '10%' : 16,
        paddingTop: 0,
    },
    breadcrumbs: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 8,
    },
    breadcrumbLink: {
        fontSize: 14,
        color: '#0064D2',
        fontWeight: '500',
    },
    breadcrumbSeparator: {
        fontSize: 14,
        color: '#8E8E93',
        marginHorizontal: 8,
    },
    breadcrumbCurrent: {
        fontSize: 14,
        color: '#8E8E93',
    },
    mainLayout: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        marginBottom: 32,
    },
    infoColumn: {
        flex: 1,
        marginRight: Platform.OS === 'web' ? 24 : 0,
        marginBottom: Platform.OS === 'web' ? 0 : 24,
    },
    mapColumn: {
        flex: 0.8,
    },
    providerInfoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E4E6EB',
        marginRight: 20,
    },
    headerText: {
        flex: 1,
    },
    providerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1d1d1f',
        marginBottom: 4,
    },
    badge: {
        backgroundColor: '#E7F3FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    badgeText: {
        color: '#0064D2',
        fontSize: 12,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    starIcon: {
        fontSize: 16,
        marginRight: 2,
    },
    detailsGroup: {
        marginTop: 16,
    },
    detailItem: {
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        color: '#3A3A3C',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: '#E4E6EB',
        marginVertical: 16,
    },
    mapPlaceholder: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        height: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    mapBackground: {
        flex: 1,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: 'white',
    },
    mapIcon: {
        fontSize: 60,
        marginBottom: 10,
    },
    mapText: {
        fontSize: 14,
        color: '#65676B',
    },
    mapProviderName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c1e21',
        marginTop: 4,
    },
    mapMarker: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -15,
        width: 30,
        height: 30,
        backgroundColor: '#FF3B30',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    markerDot: {
        width: 8,
        height: 8,
        backgroundColor: 'white',
        borderRadius: 4,
    },
    reviewsSection: {
        marginBottom: 60,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1d1d1f',
        marginBottom: 20,
    },
    reviewCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#0064D2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userInitials: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1c1e21',
    },
    reviewDate: {
        fontSize: 13,
        color: '#8E8E93',
    },
    reviewComment: {
        fontSize: 15,
        color: '#444',
        marginTop: 10,
        lineHeight: 20,
    }
});
