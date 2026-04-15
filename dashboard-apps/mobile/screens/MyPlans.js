import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiGet } from '@shared/api/client';

const StackedMetricBar = ({ payorPays, youPay, t }) => {
    return (
        <View style={styles.stackedBarContainer}>
            <View style={styles.stackedBarLabels}>
                <Text style={[styles.barLabel, { color: '#0066cc', fontWeight: '600' }]}>{payorPays}% {t("Payor")}</Text>
                <Text style={[styles.barLabel, { color: '#ff9500', fontWeight: '600' }]}>{youPay}% {t("You")}</Text>
            </View>
            <View style={[styles.barTrack, { height: 16, borderRadius: 8, flexDirection: 'row', overflow: 'hidden' }]}>
                <View style={[styles.barFill, { width: `${payorPays}%`, backgroundColor: '#0066cc' }]} />
                <View style={[styles.barFill, { width: `${youPay}%`, backgroundColor: '#ff9500' }]} />
            </View>
        </View>
    );
};

export default function MyPlans() {
    const { t } = useTranslation();
    const [benefits, setBenefits] = useState([]);
    const [networkOptions, setNetworkOptions] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [networkOption, setNetworkOption] = useState('');

    useEffect(() => {
        Promise.all([apiGet('/api/benefits'), apiGet('/api/members')])
            .then(([benefitsData, membersData]) => {
                setBenefits(benefitsData.benefits || []);
                setNetworkOptions(benefitsData.networkOptions || []);
                if (benefitsData.networkOptions?.length) setNetworkOption(benefitsData.networkOptions[0]);
                setMemberOptions(membersData.memberOptions || []);
                if (membersData.memberOptions?.length) setSelectedMember(membersData.memberOptions[0].value);
            })
            .catch(err => console.error('Failed to load plan data:', err));
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <Text style={styles.pageTitle}>{t("My Current Plan Benefits")}</Text>
                    <Text style={styles.subtitle}>{t("View Current Benefits by Family Member")}</Text>

                    <View style={{ marginTop: 24, alignSelf: 'flex-start', width: '100%', maxWidth: 400 }}>
                        <Text style={styles.label}>{t("Choose a family member")}</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={selectedMember} onValueChange={setSelectedMember} style={styles.picker}>
                                {memberOptions.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
                            </Picker>
                        </View>
                    </View>

                    <Text style={styles.disclaimerText}>
                        {t("The information on this page provides highlights of coverage only. It is not a contract. Coverage is subject to your plan terms, including exclusions and limitations. If there are any differences between the information on this page and your official plan documents, the terms of the plan document will control.")}
                    </Text>

                    <View style={{ marginTop: 24, alignSelf: 'flex-start', width: '100%' }}>
                        <Text style={styles.label}>{t("View by plan options:")}</Text>
                        <View style={styles.radioGroup}>
                            {networkOptions.map(option => (
                                <TouchableOpacity key={option} style={styles.radioOption} onPress={() => setNetworkOption(option)}>
                                    <View style={[styles.radioOuter, networkOption === option && styles.radioOuterSelected]}>
                                        {networkOption === option && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioText}>{t(option)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.tabsContainer}>
                        <View style={[styles.tab, styles.tabActive]}>
                            <Text style={[styles.tabText, styles.tabTextActive]}>{t("Medical")}</Text>
                        </View>
                    </View>

                    <View style={styles.accordionContainer}>
                        <TouchableOpacity style={styles.accordionHeader}>
                            <Text style={styles.accordionIcon}>›</Text>
                            <Text style={styles.accordionTitle}>{t("Lifetime Maximum")}</Text>
                        </TouchableOpacity>

                        <View style={styles.accordionHeader}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.accordionIcon, { transform: [{ rotate: '90deg' }] }]}>›</Text>
                                <Text style={styles.accordionTitle}>{t("Benefits")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t("Service Covered")}</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>{t("Payor Pays vs You Pay")}</Text>
                            </View>
                            {benefits.map((row, idx) => (
                                <View key={idx} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 2 }]}>{t(row.service)}</Text>
                                    <View style={[styles.tableCell, { flex: 1.5 }]}>
                                        {row.isFixed ? (
                                            <Text style={[styles.cellText, { fontWeight: '600' }]}>{t(row.fixedText)}</Text>
                                        ) : (
                                            <StackedMetricBar payorPays={row.payorPays} youPay={row.youPay} t={t} />
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    scrollContainer: { paddingBottom: 60 },
    content: { paddingHorizontal: '10%', paddingTop: 40, alignItems: 'center', width: '100%', maxWidth: 1200, alignSelf: 'center' },
    pageTitle: { fontSize: 32, fontWeight: '700', color: '#333333', marginBottom: 16, alignSelf: 'flex-start', fontFamily: 'Georgia, serif' },
    subtitle: { fontSize: 16, color: '#444444', marginBottom: 24, alignSelf: 'flex-start' },
    label: { fontSize: 14, color: '#444444', marginBottom: 8 },
    pickerContainer: { borderWidth: 1, borderColor: '#cccccc', borderRadius: 4, backgroundColor: '#ffffff', overflow: 'hidden' },
    picker: { height: 44, width: '100%' },
    disclaimerText: { fontSize: 13, color: '#333333', marginTop: 24, lineHeight: 20, alignSelf: 'flex-start' },
    radioGroup: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', marginTop: 8 },
    radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#cccccc', justifyContent: 'center', alignItems: 'center' },
    radioOuterSelected: { borderColor: '#004a99' },
    radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#004a99' },
    radioText: { fontSize: 13, color: '#444444', textTransform: 'uppercase' },
    tabsContainer: { flexDirection: 'row', width: '100%', borderBottomWidth: 2, borderBottomColor: '#004a99', marginTop: 32 },
    tab: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#f0f0f0', borderTopLeftRadius: 4, borderTopRightRadius: 4, marginRight: 4 },
    tabActive: { backgroundColor: '#004a99' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#333333' },
    tabTextActive: { color: '#ffffff' },
    accordionContainer: { width: '100%', marginTop: 24 },
    accordionHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    accordionIcon: { fontSize: 24, color: '#004a99', marginRight: 12, width: 20, textAlign: 'center' },
    accordionTitle: { fontSize: 18, fontWeight: '600', color: '#004a99' },
    tableContainer: { width: '100%', marginTop: 16, backgroundColor: '#fafafa', borderRadius: 4 },
    tableHeaderRow: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    tableHeaderCell: { fontSize: 13, fontWeight: '600', color: '#333333' },
    tableRow: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', alignItems: 'center' },
    tableCell: { fontSize: 13, color: '#333333', paddingRight: 16 },
    cellText: { fontSize: 13, color: '#333333' },
    stackedBarContainer: { width: '100%', paddingRight: 32 },
    stackedBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    barTrack: { backgroundColor: '#e0e0e0', overflow: 'hidden' },
    barFill: { height: '100%' },
    barLabel: { fontSize: 12, color: '#333333' }
});
