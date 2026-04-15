const fs = require('fs');
const file = './screens/SearchPcp.js';
let content = fs.readFileSync(file, 'utf8');

// Ensure Animated is imported
if (!content.includes("Animated")) {
    content = content.replace(
        "import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';",
        "import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Animated } from 'react-native';"
    );
}

// Add state for hover animations in the component
if (!content.includes("const scaleValue = useRef(new Animated.Value(1)).current;")) {
    content = content.replace(
        "const itemsPerPage = 6;",
        `const itemsPerPage = 6;
    const scaleValue = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = () => {
        Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
    };`
    );

    // Also need useRef
    content = content.replace(
        "import React, { useState } from 'react';",
        "import React, { useState, useRef } from 'react';"
    );
}

// Replace the Specialty layout
const originalSpecialty = `{searchCategory === 'By Specialty' && (
                                <View style={styles.pickerContainer}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                        {providerTypes.map(type => (
                                            <TouchableOpacity
                                                key={type}
                                                style={[styles.typeChip, doctorType === type && styles.activeTypeChip]}
                                                onPress={() => {
                                                    setDoctorType(type);
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <Text style={[styles.typeChipText, doctorType === type && styles.activeTypeChipText]}>{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}`;

const animatedSpecialty = `{searchCategory === 'By Specialty' && (
                                <View style={styles.animatedGridContainer}>
                                    <View style={styles.gridHeaderRow}>
                                        <Text style={styles.gridHeaderTitle}>Select a Specialty</Text>
                                    </View>
                                    <View style={styles.animatedGrid}>
                                        {providerTypes.map((type, index) => {
                                            const isActive = doctorType === type;
                                            return (
                                                <TouchableOpacity
                                                    key={type}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setDoctorType(type);
                                                        setCurrentPage(1);
                                                    }}
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
                            )}`;

// Replace the Facility layout
const originalFacility = `{searchCategory === 'By Group/Facility' && (
                                <View style={styles.pickerContainer}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                        {facilityTypes.map(type => (
                                            <TouchableOpacity
                                                key={type}
                                                style={[styles.typeChip, facilityType === type && styles.activeTypeChip]}
                                                onPress={() => {
                                                    setFacilityType(type);
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <Text style={[styles.typeChipText, facilityType === type && styles.activeTypeChipText]}>{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}`;

const animatedFacility = `{searchCategory === 'By Group/Facility' && (
                                <View style={styles.animatedGridContainer}>
                                    <View style={styles.gridHeaderRow}>
                                        <Text style={styles.gridHeaderTitle}>Select Facility Type</Text>
                                    </View>
                                    <View style={styles.animatedGrid}>
                                        {facilityTypes.map((type, index) => {
                                            const isActive = facilityType === type;
                                            return (
                                                <TouchableOpacity
                                                    key={type}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setFacilityType(type);
                                                        setCurrentPage(1);
                                                    }}
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
                            )}`;

// Replace the Search Button layout so it stays below the grid
content = content.replace(
    `{searchCategory !== 'Search Using Agent' && (
                                <TouchableOpacity style={styles.searchBtn} onPress={() => setCurrentPage(1)}>
                                    <Text style={styles.searchBtnText}>Search</Text>
                                </TouchableOpacity>
                            )}`,
    ""
);

// Inject styles
if (!content.includes("animatedGridContainer")) {
    const styleBlock = `
    // Animated Grid Filters
    animatedGridContainer: { width: '100%', marginTop: 24, marginBottom: 16 },
    gridHeaderRow: { marginBottom: 16 },
    gridHeaderTitle: { fontSize: 16, fontFamily: '-apple-system', fontWeight: '600', color: '#1d1d1f' },
    animatedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    gridBtnWrapper: { width: '31%', minWidth: 150 },
    gridCard: { backgroundColor: '#f5f5f7', paddingVertical: 20, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: '#e5e5ea', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    gridCardActive: { backgroundColor: '#eef6ff', borderColor: '#0066cc', shadowColor: '#0066cc', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    gridCardText: { fontSize: 14, fontFamily: '-apple-system', fontWeight: '500', color: '#444', textAlign: 'center' },
    gridCardTextActive: { color: '#0066cc', fontWeight: '700' },
    primarySearchBtnRow: { width: '100%', alignItems: 'center', marginTop: 12, marginBottom: 24 },
    primarySearchBtn: { backgroundColor: '#0066cc', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, shadowColor: '#0066cc', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    primarySearchBtnText: { color: '#ffffff', fontSize: 16, fontFamily: '-apple-system', fontWeight: '600' },
`;
    content = content.replace("tabRow: {", styleBlock + "\n    tabRow: {");
}

// Add the search button back below the category selection logic but before Location
const searchBtnReplacement = `                        </View>
                        
                        {searchCategory !== 'Search Using Agent' && (
                            <View style={styles.primarySearchBtnRow}>
                                <TouchableOpacity style={styles.primarySearchBtn} onPress={() => setCurrentPage(1)}>
                                    <Text style={styles.primarySearchBtnText}>Search Providers</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Location and Radius */}`;
content = content.replace("</View>\n\n                        {/* Location and Radius */}", searchBtnReplacement);

content = content.replace(originalSpecialty, animatedSpecialty);
content = content.replace(originalFacility, animatedFacility);

fs.writeFileSync(file, content);
console.log("Search layout patched");
