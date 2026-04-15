import React from 'react';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePreferences } from '@shared/hooks/usePreferences';

export default function Preferences() {
    const { t } = useTranslation();
    const { prefs, handleChange, handleUpdate } = usePreferences();

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <Text style={styles.title}>{t("Preferences")}</Text>
                    <View style={styles.card}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Language Preference")}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={prefs.language} onValueChange={(v) => handleChange('language', v)} style={styles.picker}>
                                    <Picker.Item label="English" value="English" />
                                    <Picker.Item label="Español" value="Español" />
                                    <Picker.Item label="தமிழ் (Tamil)" value="Tamil" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Email Preferences")}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={prefs.emailPrefs} onValueChange={(v) => handleChange('emailPrefs', v)} style={styles.picker}>
                                    <Picker.Item label="All Communications" value="All Communications" />
                                    <Picker.Item label="Important Updates Only" value="Important Updates Only" />
                                    <Picker.Item label="None" value="None" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.sectionTitle}>{t("Document Delivery Preferences")}</Text>

                            <Text style={styles.label}>{t("Explanation of Benefit")}</Text>
                            <View style={[styles.pickerContainer, { marginBottom: 16 }]}>
                                <Picker selectedValue={prefs.deliveryEob} onValueChange={(v) => handleChange('deliveryEob', v)} style={styles.picker}>
                                    <Picker.Item label="Paper & Online" value="Paper & Online" />
                                    <Picker.Item label="Online Only" value="Online Only" />
                                </Picker>
                            </View>

                            <Text style={styles.label}>{t("US Tax Form 1095B")}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={prefs.deliveryTax} onValueChange={(v) => handleChange('deliveryTax', v)} style={styles.picker}>
                                    <Picker.Item label="Paper & Online" value="Paper & Online" />
                                    <Picker.Item label="Online Only" value="Online Only" />
                                </Picker>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate}>
                            <Text style={styles.btnPrimaryText}>{t("Update")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Footer compact />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f7' },
    scrollContainer: { paddingBottom: 40 },
    content: { paddingHorizontal: '12%', paddingTop: 40, alignItems: 'center' },
    title: { fontSize: 32, fontWeight: '700', color: '#1d1d1f', marginBottom: 24, alignSelf: 'flex-start' },
    card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 800, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1d1d1f', marginTop: 12, marginBottom: 16 },
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '600', color: '#1d1d1f', marginBottom: 8 },
    pickerContainer: { borderWidth: 1, borderColor: '#d2d2d7', borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' },
    picker: { height: 44, width: '100%' },
    btnPrimary: { backgroundColor: '#0066cc', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
