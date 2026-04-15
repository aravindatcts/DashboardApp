import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

// Required for web redirect handling
WebBrowser.maybeCompleteAuthSession();

const DESCOPE_PROJECT_ID = "P3CAhP3b0wQIFXYY7dAViJzEKO7P";

// Descope OIDC issuer — expo-auth-session will append /.well-known/openid-configuration
const ISSUER = `https://api.descope.com/${DESCOPE_PROJECT_ID}`;

const AuthContext = createContext({
    user: null,
    login: async () => { },
    logout: async () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // useAutoDiscovery takes the ISSUER (not the full discovery URL)
    // expo-auth-session appends /.well-known/openid-configuration automatically
    const discovery = AuthSession.useAutoDiscovery(ISSUER);

    const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'memberportal',
    });

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: DESCOPE_PROJECT_ID,
            redirectUri,
            scopes: ['openid', 'profile', 'email'],
            responseType: AuthSession.ResponseType.Code,
            usePKCE: true,
        },
        discovery
    );

    // Load persisted session on mount
    useEffect(() => {
        const loadSession = async () => {
            try {
                let session;
                if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
                    session = localStorage.getItem('descopeSession');
                } else {
                    session = await SecureStore.getItemAsync('descopeSession');
                }
                if (session) {
                    setUser(JSON.parse(session));
                }
            } catch (error) {
                console.error('Failed to load session:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSession();
    }, []);

    // Handle auth response
    useEffect(() => {
        if (response?.type === 'success') {
            console.log('Auth success! Code received:', response.params.code);
            const sessionData = { isAuthenticated: true, code: response.params.code };
            setUser(sessionData);
            const sessionString = JSON.stringify(sessionData);
            if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
                localStorage.setItem('descopeSession', sessionString);
            } else {
                SecureStore.setItemAsync('descopeSession', sessionString);
            }
        } else if (response?.type === 'error') {
            console.error('Auth error:', response.error);
            Alert.alert('Authentication Error', response.error?.message || 'Unknown error');
        } else if (response?.type === 'dismiss') {
            console.log('Auth cancelled by user');
        }
    }, [response]);

    const login = async () => {
        if (!discovery) {
            Alert.alert('Loading', 'Authentication service is still loading, please try again in a moment.');
            return;
        }
        if (!request) {
            console.warn('Auth request not ready yet');
            Alert.alert('Not Ready', 'Authentication is not ready yet, please try again.');
            return;
        }
        try {
            console.log('Redirect URI:', redirectUri);
            console.log('Discovery:', discovery?.authorizationEndpoint);
            await promptAsync();
        } catch (err) {
            console.error('promptAsync error:', err);
            Alert.alert('Error', err.message);
        }
    };

    const logout = async () => {
        setUser(null);
        if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('descopeSession');
        } else {
            await SecureStore.deleteItemAsync('descopeSession');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
