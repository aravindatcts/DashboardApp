import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Descope } from '@descope/react-sdk';

export default function Login() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome to Member Portal</Text>
                <Descope
                    flowId="LoginFlow"
                    onSuccess={(e) => console.log('Logged in successfully', e.detail.user)}
                    onError={(e) => console.error('Could not log in!', e)}
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
        backgroundColor: '#f5f5f7',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1d1d1f'
    },
});
