import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Descope } from '@descope/react-sdk';

export default function Login() {
    return (
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <View style={styles.logoMark}>
                    <Text style={styles.logoMarkText}>AHI</Text>
                </View>
                <Text style={styles.companyName}>America Health Insurance</Text>
                <Text style={styles.tagline}>Your health, our priority</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Member Portal</Text>
                {/* Descope flow component — on success the SDK updates useSession(),
                    which flips isAuthenticated in useAuth() and RootNavigator
                    automatically switches to the authenticated stack. */}
                <Descope
                    flowId="LoginFlow"
                    onError={(e) => console.error('[Auth] Descope flow error:', e)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoMark: {
        width: 72,
        height: 72,
        borderRadius: 18,
        backgroundColor: '#003d82',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoMarkText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 1,
    },
    companyName: {
        fontSize: 17,
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
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 20,
    },
});
