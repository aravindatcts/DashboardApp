import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useAuth } from '../components/AuthContext';

export default function Login() {
    const { login, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#003d82" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoSection}>
                <View style={styles.logoMark}>
                    <Text style={styles.logoMarkText}>AHI</Text>
                </View>
                <Text style={styles.companyName}>America Health Insurance</Text>
                <Text style={styles.tagline}>Your health, our priority</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Member Portal</Text>
                <Text style={styles.cardSubtitle}>
                    Sign in securely to access your benefits, claims, and health information.
                </Text>

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={login}
                    activeOpacity={0.85}
                >
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>

                <Text style={styles.securityNote}>
                    Protected by Descope · PKCE secured
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoMark: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#003d82',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#003d82',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    logoMarkText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: 1,
    },
    companyName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a2e',
    },
    tagline: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 4,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 10,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 28,
    },
    signInButton: {
        backgroundColor: '#003d82',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#003d82',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    signInButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    securityNote: {
        marginTop: 20,
        fontSize: 12,
        color: '#9ca3af',
    },
});
