import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AccessPermission() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <Text style={styles.title}>{t("Access Permission")}</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>{t("Manage who has access to your account and health information.")}</Text>
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
    text: { fontSize: 16, color: '#1d1d1f' }
});
