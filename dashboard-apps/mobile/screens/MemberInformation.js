import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useMemberForm } from '@shared/hooks/useMemberForm';

export default function MemberInformation() {
    const { t } = useTranslation();
    const { formData, isEditing, setIsEditing, handleChange, handleUpdate } = useMemberForm();

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{t("Member Information")}</Text>
                        {!isEditing && (
                            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                                <Text style={styles.editBtnText}>{t("Edit")}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Name")}</Text>
                            {isEditing ? (
                                <TextInput style={styles.input} value={formData.name} onChangeText={(text) => handleChange('name', text)} />
                            ) : (
                                <Text style={styles.valueText}>{formData.name}</Text>
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Email Address")}</Text>
                            {isEditing ? (
                                <TextInput style={styles.input} value={formData.email} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
                            ) : (
                                <Text style={styles.valueText}>{formData.email}</Text>
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Phone Number")}</Text>
                            {isEditing ? (
                                <TextInput style={styles.input} value={formData.phone} onChangeText={(text) => handleChange('phone', text)} keyboardType="phone-pad" />
                            ) : (
                                <Text style={styles.valueText}>{formData.phone}</Text>
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Billing Address")}</Text>
                            {isEditing ? (
                                <TextInput style={styles.input} value={formData.billingAddress} onChangeText={(text) => handleChange('billingAddress', text)} multiline />
                            ) : (
                                <Text style={styles.valueText}>{formData.billingAddress}</Text>
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t("Mailing Address")}</Text>
                            {isEditing ? (
                                <TextInput style={styles.input} value={formData.mailingAddress} onChangeText={(text) => handleChange('mailingAddress', text)} multiline />
                            ) : (
                                <Text style={styles.valueText}>{formData.mailingAddress}</Text>
                            )}
                        </View>

                        {isEditing && (
                            <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate}>
                                <Text style={styles.btnPrimaryText}>{t("Update")}</Text>
                            </TouchableOpacity>
                        )}
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
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 800, marginBottom: 24 },
    title: { fontSize: 32, fontWeight: '700', color: '#1d1d1f' },
    editBtn: { backgroundColor: '#e5e5ea', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
    editBtnText: { color: '#0066cc', fontSize: 16, fontWeight: '600' },
    card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 800, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#86868b', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#d2d2d7', borderRadius: 8, padding: 12, fontSize: 16, color: '#1d1d1f', backgroundColor: '#fff' },
    valueText: { fontSize: 16, color: '#1d1d1f', fontWeight: '500' },
    btnPrimary: { backgroundColor: '#0066cc', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
