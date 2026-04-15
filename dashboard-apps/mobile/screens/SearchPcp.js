import React, { useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProviderSearch } from '@shared/hooks/useProviderSearch';

export default function SearchPcp() {
    const navigation = useNavigation();
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
    };

    // All state + filter + pagination from @shared/hooks/useProviderSearch
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
    } = useProviderSearch();
    // mockProviders, filter logic, pagination, and goToPage are in @shared/hooks/useProviderSearch


    const renderRating = (rating) => {
        return (
            <View style={styles.ratingRow}>
                <Text style={styles.starText}>★</Text>
                <Text style={styles.ratingText}>{rating}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Find a Doctor or Facility Header */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Find a Doctor or Facility</Text>
                </View>

                {/* Main Search Card */}
                <View style={styles.searchCardContainer}>
                    <View style={styles.searchCard}>
                        {/* Tabs */}
                        <View style={styles.tabRow}>
                            {SEARCH_CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.tabBtn, searchCategory === cat.id && styles.activeTabBtn]}
                                    onPress={() => {
                                        setSearchCategory(cat.id);
                                    }}
                                >
                                    <View style={styles.tabContent}>
                                        <Text style={[styles.tabIcon, searchCategory === cat.id && styles.activeTabText]}>{cat.icon}</Text>
                                        <Text style={[styles.tabLabel, searchCategory === cat.id && styles.activeTabText]}>{cat.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Input Row */}
                        <View style={searchCategory === 'Search Using Agent' ? styles.agentInputRow : styles.inputRow}>
                            {searchCategory === 'Search Using Agent' && (
                                <View style={styles.agentInputContainer}>
                                    <Text style={styles.agentPrompt}>
                                        You can Search by Saying - Find me dentist who is having 4 stars. Find a Family Physician who can talk in Spanish. Or Just Say, I am having a throat pain and find a appropriate doctor for it.
                                    </Text>
                                    <View style={styles.agentSearchWrapper}>
                                        <TextInput
                                            style={styles.agentInput}
                                            placeholder="How can I help you find care...?"
                                            multiline
                                            value={searchName}
                                            onChangeText={(text) => {
                                                setSearchName(text);
                                            }}
                                        />
                                        <TouchableOpacity style={styles.agentSearchBtn} onPress={() => goToPage(1)}>
                                            <Text style={styles.agentSearchBtnText}>Ask</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            {searchCategory === 'By Name' && (
                                <View style={styles.autocompleteContainer}>
                                    <TextInput
                                        style={styles.mainInput}
                                        placeholder="Enter Provider Name"
                                        value={searchName}
                                        onFocus={() => setShowNameSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowNameSuggestions(false), 200)}
                                        onChangeText={(text) => {
                                            setSearchName(text);
                                            setShowNameSuggestions(true);
                                        }}
                                    />
                                    {showNameSuggestions && suggestedNames.length > 0 && (
                                        <View style={styles.suggestionsDropdown}>
                                            <ScrollView style={styles.suggestionsScroll} keyboardShouldPersistTaps="handled">
                                                {suggestedNames.map((name, idx) => (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        style={styles.suggestionItem}
                                                        onPress={() => {
                                                            setSearchName(name);
                                                            setShowNameSuggestions(false);
                                                        }}
                                                    >
                                                        <Text style={styles.suggestionText}>{name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                            )}
                            {searchCategory === 'By Specialty' && (
                                <View style={styles.animatedGridContainer}>
                                    <View style={styles.animatedGrid}>
                                        {PROVIDER_TYPES.map((type) => {
                                            const isActive = doctorType === type;
                                            return (
                                                <TouchableOpacity
                                                    key={type}
                                                    activeOpacity={0.8}
                                                    onPress={() => setDoctorType(type)}
                                                    style={styles.gridBtnWrapper}
                                                >
                                                    <Animated.View style={[styles.gridCard, isActive && styles.gridCardActive]}>
                                                        <Text style={[styles.gridCardText, isActive && styles.gridCardTextActive]}>{type}</Text>
                                                    </Animated.View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                            {searchCategory === 'By Group/Facility' && (
                                <View style={styles.animatedGridContainer}>
                                    <View style={styles.animatedGrid}>
                                        {FACILITY_TYPES.map((type) => {
                                            const isActive = facilityType === type;
                                            return (
                                                <TouchableOpacity
                                                    key={type}
                                                    activeOpacity={0.8}
                                                    onPress={() => setFacilityType(type)}
                                                    style={styles.gridBtnWrapper}
                                                >
                                                    <Animated.View style={[styles.gridCard, isActive && styles.gridCardActive]}>
                                                        <Text style={[styles.gridCardText, isActive && styles.gridCardTextActive]}>{type}</Text>
                                                    </Animated.View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}

                        </View>

                        {searchCategory !== 'Search Using Agent' && (
                            <View style={styles.primarySearchBtnRow}>
                                <TouchableOpacity style={styles.primarySearchBtn} onPress={() => goToPage(1)}>
                                    <Text style={styles.primarySearchBtnText}>Search Providers</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Location and Radius */}
                        <View style={styles.locationRadiusRow}>
                            <View style={styles.locationField}>
                                <Text style={styles.fieldLabel}>Your Location (City, State, or ZIP)</Text>
                                <View style={styles.locationInputWrapper}>
                                    <TextInput
                                        style={styles.locationInput}
                                        placeholder="Enter City, State, or ZIP"
                                        placeholderTextColor="#888"
                                        value={searchCity}
                                        onChangeText={(text) => {
                                            setSearchCity(text);
                                        }}
                                    />
                                    <Text style={styles.gpsIcon}>⌖</Text>
                                </View>
                            </View>
                            <View style={styles.radiusField}>
                                <Text style={styles.fieldLabel}>Search Radius</Text>
                                <View style={styles.radiusControls}>
                                    <View style={styles.sliderTrackContainer}>
                                        <View style={styles.sliderTrack}>
                                            <View style={[styles.sliderFill, { width: `${searchRadius}%` }]} />
                                            <View style={[styles.sliderThumb, { left: `${searchRadius}%` }]} />
                                            <View style={styles.sliderInteractionOverlay}>
                                                {[1, 25, 50, 75, 100].map(val => (
                                                    <TouchableOpacity
                                                        key={val}
                                                        style={styles.sliderTapZone}
                                                        onPress={() => {
                                                            setSearchRadius(val);
                                                        }}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                        <View style={styles.radiusLabels}>
                                            <Text style={styles.radiusValue}>1 mile</Text>
                                            <Text style={styles.radiusValue}>100 miles</Text>
                                        </View>
                                    </View>
                                    <View style={styles.radiusDropdown}>
                                        <Text style={styles.radiusDropdownText}>{searchRadius} miles</Text>
                                        <Text style={styles.dropdownArrow}>⌵</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Advanced Filters */}
                        <View style={styles.advancedFiltersHeader}>
                            <Text style={styles.advancedFiltersText}>Advanced Filters</Text>
                            <TouchableOpacity onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                                <Text style={styles.advancedFiltersIcon}>{showAdvancedFilters ? '−' : '+'}</Text>
                            </TouchableOpacity>
                        </View>

                        {showAdvancedFilters && (
                            <View style={styles.advancedFiltersPanel}>
                                {/* Advanced Filters placeholder content */}
                                <Text style={styles.fieldLabel}>Additional filters can go here.</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Results and Map Layout */}
                <View style={styles.resultsMapLayout}>
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsCount}>
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCount)} of {filteredCount} providers
                        </Text>
                        <TouchableOpacity style={styles.mapToggleBtn} onPress={() => setShowMap(!showMap)}>
                            <Text style={styles.mapToggleText}>{showMap ? 'Hide Map' : 'Show Map'}</Text>
                        </TouchableOpacity>
                    </View>

                    {showMap && (
                        <View style={styles.mapContainerTop}>
                            <View style={styles.mapMock}>
                                {/* Dynamically placed markers for current page */}
                                {currentProviders.map((provider, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.mapMarkerContainer,
                                            {
                                                top: `${20 + (i * 15)}%`,
                                                left: `${30 + (i * 10)}%`,
                                            }
                                        ]}
                                    >
                                        <View style={[styles.mapMarker, { backgroundColor: i === 0 ? '#004a99' : '#00c3a5' }]} />
                                        <View style={styles.markerLabel}>
                                            <Text style={styles.markerLabelText} numberOfLines={1}>{provider.name}</Text>
                                        </View>
                                    </View>
                                ))}
                                <View style={styles.mapOverlay}>
                                    <Text style={styles.mapOverlayText}>Interactive Map View</Text>
                                    <Text style={styles.mapOverlaySub}>Page {currentPage} providers shown</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={styles.resultsList}>
                        <View style={styles.providerGrid}>
                            {currentProviders.map(provider => (
                                <View key={provider.id} style={styles.providerCard}>
                                    <View style={styles.providerCardContent}>
                                        <View style={styles.providerCardLeft}>
                                            <Image source={{ uri: provider.photo }} style={styles.providerImage} />
                                            {renderRating(provider.rating)}
                                        </View>
                                        <View style={styles.providerCardRight}>
                                            <Text style={styles.providerName} numberOfLines={1}>{provider.name}</Text>
                                            <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                                            <View style={styles.providerInfoRow}>
                                                <Text style={styles.providerInfoIcon}>📍</Text>
                                                <Text style={styles.providerInfoText} numberOfLines={2}>{provider.address}</Text>
                                            </View>
                                            <View style={styles.providerInfoRow}>
                                                <Text style={styles.providerInfoIcon}>📞</Text>
                                                <Text style={styles.providerInfoText}>{provider.phone || '(803) 355-7730'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.providerCardActions}>
                                        <TouchableOpacity
                                            style={styles.viewProfileBtn}
                                            onPress={() => navigation.navigate('ProviderProfile', { provider })}
                                        >
                                            <Text style={styles.viewProfileBtnText}>View Profile</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.scheduleBtn}>
                                            <Text style={styles.scheduleBtnText}>Schedule Appointment</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <View style={styles.paginationContainer}>
                                <TouchableOpacity
                                    style={[styles.pageBtn, currentPage === 1 && styles.disabledPageBtn]}
                                    onPress={() => currentPage > 1 && goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <Text style={[styles.pageBtnText, currentPage === 1 && styles.disabledPageBtnText]}>Previous</Text>
                                </TouchableOpacity>

                                <View style={styles.pageNumbers}>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <TouchableOpacity
                                            key={i + 1}
                                            style={[styles.pageNum, currentPage === i + 1 && styles.activePageNum]}
                                            onPress={() => goToPage(i + 1)}
                                        >
                                            <Text style={[styles.pageNumText, currentPage === i + i && styles.activePageNumText]}>{i + 1}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={[styles.pageBtn, currentPage === totalPages && styles.disabledPageBtn]}
                                    onPress={() => currentPage < totalPages && goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <Text style={[styles.pageBtnText, currentPage === totalPages && styles.disabledPageBtnText]}>Next</Text>
                                </TouchableOpacity>
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
    container: { flex: 1, backgroundColor: '#f9f9fa' }, // Light off-white
    scrollContainer: { flexGrow: 1, paddingBottom: 40 },

    // Find Your Care Form
    heroSection: { alignItems: 'center', backgroundColor: '#215c8e', paddingVertical: 40, paddingHorizontal: 20 },
    heroTitle: {
        fontSize: 32,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#fff'
    },

    // Main Search Card
    searchCardContainer: { paddingHorizontal: 20, marginTop: -32, alignItems: 'center', zIndex: 10 },
    searchCard: { backgroundColor: '#fff', borderRadius: 8, width: '100%', maxWidth: 1000, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4, padding: 24, paddingBottom: 16 },


    // Animated Grid Filters
    animatedGridContainer: { width: '100%', marginBottom: 16 },
    animatedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    gridBtnWrapper: { width: '30%', minWidth: 100, flexGrow: 1 },
    gridCard: { backgroundColor: '#f5f5f7', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 12, borderWidth: 2, borderColor: '#e5e5ea', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    gridCardActive: { backgroundColor: '#eef6ff', borderColor: '#0066cc', shadowColor: '#0066cc', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    gridCardText: { fontSize: 14, fontFamily: '-apple-system', fontWeight: '500', color: '#444', textAlign: 'center' },
    gridCardTextActive: { color: '#0066cc', fontWeight: '700' },
    primarySearchBtnRow: { width: '100%', alignItems: 'center', marginTop: 12, marginBottom: 24 },
    primarySearchBtn: { backgroundColor: '#0066cc', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, shadowColor: '#0066cc', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    primarySearchBtnText: { color: '#ffffff', fontSize: 16, fontFamily: '-apple-system', fontWeight: '600' },

    tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 24 },
    tabBtn: { flex: 1, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
    activeTabBtn: { borderBottomColor: '#215c8e' },
    tabContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tabIcon: {
        fontSize: 20,
        fontFamily: '-apple-system', color: '#215c8e'
    },
    tabLabel: {
        fontSize: 16,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#333'
    },
    activeTabText: { color: '#215c8e' },

    agentInputRow: { width: '100%', marginBottom: 24 },
    agentInputContainer: { width: '100%', backgroundColor: '#f4f7fb', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e1e8f0' },
    agentPrompt: {
        fontSize: 13,
        fontFamily: '-apple-system', color: '#445566', marginBottom: 12, fontStyle: 'italic', lineHeight: 20
    },
    agentSearchWrapper: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    agentInput: {
        flex: 1, minHeight: 48, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
        fontFamily: '-apple-system', color: '#222'
    },
    agentSearchBtn: { backgroundColor: '#215c8e', height: 48, paddingHorizontal: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
    agentSearchBtnText: {
        color: '#fff', fontSize: 15,
        fontFamily: '-apple-system', fontWeight: '600'
    },
    inputRow: { width: '100%', marginBottom: 24, zIndex: 10 },
    mainInput: { width: '100%', height: 48, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingHorizontal: 16, fontSize: 16 },
    autocompleteContainer: { width: '100%', position: 'relative', zIndex: 20 },
    suggestionsDropdown: { position: 'absolute', top: 52, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 4, maxHeight: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, zIndex: 30 },
    suggestionsScroll: { width: '100%' },
    suggestionItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    suggestionText: { fontSize: 15, fontFamily: '-apple-system', color: '#333' },
    pickerContainer: { flex: 1, height: 48, justifyContent: 'center' },
    searchBtn: { backgroundColor: '#215c8e', height: 48, paddingHorizontal: 32, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
    searchBtnText: {
        color: '#fff', fontSize: 16,
        fontFamily: '-apple-system', fontWeight: '600'
    },

    locationRadiusRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
    locationField: { flex: 1, maxWidth: 400 },
    fieldLabel: {
        fontSize: 14,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#333', marginBottom: 8
    },
    locationInputWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingHorizontal: 16 },
    locationInput: { flex: 1, fontSize: 16 },
    gpsIcon: {
        fontSize: 18,
        fontFamily: '-apple-system', color: '#666'
    },

    radiusField: { flex: 1, flexDirection: 'column' },
    radiusControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    sliderTrackContainer: { flex: 1, marginTop: 15 },
    sliderTrack: { width: '100%', height: 4, backgroundColor: '#ddd', borderRadius: 2, position: 'relative' },
    sliderFill: { position: 'absolute', top: 0, left: 0, height: 4, backgroundColor: '#215c8e', borderRadius: 2 },
    sliderThumb: { position: 'absolute', top: -8, width: 20, height: 20, borderRadius: 10, backgroundColor: '#215c8e', marginLeft: -10 },
    sliderInteractionOverlay: { position: 'absolute', top: -15, left: 0, right: 0, height: 34, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
    sliderTapZone: { flex: 1, height: '100%' },
    radiusLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    radiusValue: {
        fontSize: 12,
        fontFamily: '-apple-system', color: '#666'
    },
    radiusDropdown: { flexDirection: 'row', alignItems: 'center', height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
    radiusDropdownText: {
        fontSize: 14,
        fontFamily: '-apple-system', color: '#333'
    },
    dropdownArrow: {
        fontSize: 12,
        fontFamily: '-apple-system', color: '#666'
    },

    advancedFiltersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#eee' },
    advancedFiltersText: {
        fontSize: 16,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#333'
    },
    advancedFiltersIcon: {
        fontSize: 24,
        fontFamily: '-apple-system', color: '#215c8e', fontWeight: 'bold'
    },
    advancedFiltersPanel: { marginTop: 16 },

    // Results & Map
    resultsMapLayout: { flexDirection: 'column', paddingHorizontal: 20, paddingVertical: 40, gap: 24, maxWidth: 1000, alignSelf: 'center', width: '100%' },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mapToggleBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#215c8e', borderRadius: 4 },
    mapToggleText: {
        color: '#215c8e', fontWeight: '600',
        fontFamily: '-apple-system', fontSize: 14
    },
    resultsList: { flex: 1, width: '100%' },
    resultsCount: {
        fontSize: 15,
        fontFamily: '-apple-system', color: '#333', fontWeight: '600'
    },

    providerGrid: { flexDirection: 'column', gap: 20, width: '100%' },
    providerCard: { width: '100%', minWidth: 320, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 10 },
    providerCardContent: { flexDirection: 'row', marginBottom: 16 },
    providerCardLeft: { alignItems: 'center', width: 90, marginRight: 16 },
    providerCardRight: { flex: 1 },
    providerImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
    providerName: {
        fontSize: 18,
        fontFamily: '-apple-system', fontWeight: '700',
        fontFamily: '-apple-system', color: '#222', marginBottom: 4
    },
    providerSpecialty: {
        fontSize: 14,
        fontFamily: '-apple-system', color: '#555', marginBottom: 8
    },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    starText: {
        color: '#f5a623', fontSize: 14,
        fontFamily: '-apple-system', marginRight: 4
    },
    ratingText: {
        fontSize: 14,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#333'
    },
    providerInfoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
    providerInfoIcon: {
        fontSize: 16,
        fontFamily: '-apple-system', marginRight: 6
    },
    providerInfoText: {
        fontSize: 13,
        fontFamily: '-apple-system', color: '#555', flex: 1
    },
    providerCardActions: { flexDirection: 'row', gap: 10 },
    viewProfileBtn: { flex: 1, paddingVertical: 10, borderRadius: 4, borderWidth: 1, borderColor: '#215c8e', alignItems: 'center', justifyContent: 'center' },
    viewProfileBtnText: {
        color: '#215c8e', fontSize: 13,
        fontFamily: '-apple-system', fontWeight: '600'
    },
    scheduleBtn: { flex: 1, backgroundColor: '#4caf50', paddingVertical: 10, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
    scheduleBtnText: {
        color: '#fff', fontSize: 13,
        fontFamily: '-apple-system', fontWeight: '600'
    },

    // Map Area
    mapContainerTop: { width: '100%', height: 400, marginBottom: 20, borderRadius: 8, overflow: 'hidden' },
    mapMock: { width: '100%', height: '100%', minHeight: 600, backgroundColor: '#d0ddd0', position: 'relative', overflow: 'hidden' }, // No border radius
    mapOverlay: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#fff', padding: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    mapOverlayText: {
        fontSize: 16,
        fontFamily: '-apple-system', fontWeight: '700',
        fontFamily: '-apple-system', color: '#222', marginBottom: 4
    },
    mapOverlaySub: {
        fontSize: 13,
        fontFamily: '-apple-system', color: '#666'
    },
    mapMarkerContainer: { position: 'absolute', alignItems: 'center' },
    mapMarker: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 3, marginBottom: 4 },
    markerLabel: { backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
    markerLabelText: {
        fontSize: 11,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#111', maxWidth: 100
    },

    // Pagination
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32, gap: 16 },
    pageBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
    pageBtnText: {
        fontSize: 14,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#222'
    },
    disabledPageBtn: { opacity: 0.5 },
    disabledPageBtnText: { color: '#888' },
    pageNumbers: { flexDirection: 'row', gap: 8 },
    pageNum: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    activePageNum: { backgroundColor: '#0055cc' },
    pageNumText: {
        fontSize: 15,
        fontFamily: '-apple-system', fontWeight: '600',
        fontFamily: '-apple-system', color: '#555'
    },
    activePageNumText: { color: '#fff' }
});
