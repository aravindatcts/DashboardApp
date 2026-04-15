import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSecurityDetails } from '@shared/hooks/useSecurityDetails';

export default function SecurityDetails() {
    const { t } = useTranslation();
    const { password, setPassword, mfaOption, setMfaOption, handleUpdate, mfaOptions } = useSecurityDetails();

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <Text style={styles.title}>{t("Security Details")}</Text>
                    <View style={styles.card}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Password")}</Text>
                            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
                            <TouchableOpacity style={styles.btnSecondary}>
                                <Text style={styles.btnSecondaryText}>{t("Change Password")}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.inputGroup, { marginTop: 32 }]}>
                            <Text style={styles.sectionTitle}>{t("Multi-Factor Authentication (MFA)")}</Text>
                            <Text style={styles.subtext}>{t("Select your preferred MFA method:")}</Text>

                            <View style={styles.mfaOptionsContainer}>
                                {mfaOptions.map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.mfaOption, mfaOption === option && styles.mfaOptionActive]}
                                        onPress={() => setMfaOption(option)}
                                    >
                                        <Text style={[styles.mfaOptionText, mfaOption === option && styles.mfaOptionTextActive]}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate}>
                            <Text style={styles.btnPrimaryText}>{t("Update Security Settings")}</Text>
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
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1d1d1f', marginBottom: 8 },
    subtext: { fontSize: 14, color: '#86868b', marginBottom: 16 },
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '600', color: '#1d1d1f', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#d2d2d7', borderRadius: 8, padding: 12, fontSize: 16, color: '#1d1d1f', backgroundColor: '#fff', marginBottom: 12 },
    btnSecondary: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#e5e5ea' },
    btnSecondaryText: { color: '#1d1d1f', fontWeight: '500' },
    mfaOptionsContainer: { gap: 12 },
    mfaOption: { borderWidth: 1, borderColor: '#d2d2d7', borderRadius: 8, padding: 16, backgroundColor: '#fff' },
    mfaOptionActive: { borderColor: '#0066cc', backgroundColor: '#f0f8ff' },
    mfaOptionText: { fontSize: 16, color: '#1d1d1f', fontWeight: '500' },
    mfaOptionTextActive: { color: '#0066cc', fontWeight: '700' },
    btnPrimary: { backgroundColor: '#0066cc', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
    btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
