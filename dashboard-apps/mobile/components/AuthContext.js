import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

// Required for Expo Go / bare workflow to close the in-app browser after redirect
WebBrowser.maybeCompleteAuthSession();

const DESCOPE_PROJECT_ID = 'P3CAhP3b0wQIFXYY7dAViJzEKO7P';

// OIDC issuer — expo-auth-session appends /.well-known/openid-configuration automatically
const ISSUER = `https://api.descope.com/${DESCOPE_PROJECT_ID}`;

// SecureStore keys
const KEYS = {
    SESSION: 'descope_session',
};

// ─── Secure storage helpers (SecureStore on native, sessionStorage on web) ───

async function secureGet(key) {
    if (Platform.OS === 'web') return sessionStorage.getItem(key);
    return SecureStore.getItemAsync(key);
}

async function secureSet(key, value) {
    if (Platform.OS === 'web') {
        sessionStorage.setItem(key, value);
        return;
    }
    return SecureStore.setItemAsync(key, value);
}

async function secureDel(key) {
    if (Platform.OS === 'web') {
        sessionStorage.removeItem(key);
        return;
    }
    return SecureStore.deleteItemAsync(key);
}

// ─── JWT payload parser (no signature verification — that happens server-side) ─

function parseJwtPayload(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

function isTokenExpired(token) {
    const claims = parseJwtPayload(token);
    if (!claims?.exp) return true;
    // Treat tokens expiring within 30 s as expired
    return claims.exp * 1000 < Date.now() + 30_000;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch OIDC discovery document from Descope
    const discovery = AuthSession.useAutoDiscovery(ISSUER);

    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'memberportal' });

    // Build the PKCE auth request — usePKCE:true generates code_verifier + code_challenge
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: DESCOPE_PROJECT_ID,
            redirectUri,
            // offline_access requests a refresh token alongside the access token
            scopes: ['openid', 'profile', 'email', 'offline_access'],
            responseType: AuthSession.ResponseType.Code,
            usePKCE: true,
        },
        discovery
    );

    // ── Helpers ──────────────────────────────────────────────────────────────

    const applyTokenResponse = useCallback(async (tokens) => {
        const claims = parseJwtPayload(tokens.id_token ?? tokens.access_token);
        const userInfo = {
            sub: claims?.sub ?? null,
            name: claims?.name ?? null,
            email: claims?.email ?? null,
            picture: claims?.picture ?? null,
        };

        const sessionData = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token ?? null,
            idToken: tokens.id_token ?? null,
            expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
            user: userInfo,
        };

        setSession(sessionData);
        setUser(userInfo);
        await secureSet(KEYS.SESSION, JSON.stringify(sessionData));
    }, []);

    const clearSession = useCallback(async () => {
        setUser(null);
        setSession(null);
        await secureDel(KEYS.SESSION);
    }, []);

    // Exchange a refresh_token for a new access_token
    const refreshSession = useCallback(async (refreshToken, tokenEndpoint) => {
        if (!refreshToken || !tokenEndpoint) return false;
        try {
            const body = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: DESCOPE_PROJECT_ID,
            });
            const res = await fetch(tokenEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
            });
            if (!res.ok) return false;
            await applyTokenResponse(await res.json());
            return true;
        } catch {
            return false;
        }
    }, [applyTokenResponse]);

    // Exchange authorization_code + code_verifier for tokens (PKCE step)
    const exchangeCode = useCallback(async (code, codeVerifier, tokenEndpoint) => {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: DESCOPE_PROJECT_ID,
            code_verifier: codeVerifier,
        });
        const res = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Token exchange failed (${res.status}): ${text}`);
        }
        return res.json();
    }, [redirectUri]);

    // ── Restore session on mount ──────────────────────────────────────────────

    useEffect(() => {
        const restore = async () => {
            try {
                const raw = await secureGet(KEYS.SESSION);
                if (!raw) return;

                const stored = JSON.parse(raw);

                if (!isTokenExpired(stored.accessToken)) {
                    // Token is still valid — hydrate state
                    setSession(stored);
                    setUser(stored.user);
                } else if (stored.refreshToken && discovery?.tokenEndpoint) {
                    // Token expired — try to refresh silently
                    const ok = await refreshSession(stored.refreshToken, discovery.tokenEndpoint);
                    if (!ok) await clearSession();
                } else {
                    await clearSession();
                }
            } catch {
                await clearSession();
            } finally {
                setIsLoading(false);
            }
        };
        restore();
        // Only run once discovery is available
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [discovery]);

    // ── Handle PKCE callback response ─────────────────────────────────────────

    useEffect(() => {
        if (response?.type !== 'success') return;

        const { code } = response.params;
        const codeVerifier = request?.codeVerifier;

        if (!code || !codeVerifier || !discovery?.tokenEndpoint) return;

        exchangeCode(code, codeVerifier, discovery.tokenEndpoint)
            .then(applyTokenResponse)
            .catch((err) => {
                console.error('[Auth] Token exchange error:', err);
                Alert.alert('Sign In Failed', 'Could not complete authentication. Please try again.');
            });
    }, [response]);   // intentionally narrow — only fires when response changes

    // ── Public API ────────────────────────────────────────────────────────────

    const login = useCallback(async () => {
        if (!discovery) {
            Alert.alert('Please Wait', 'Authentication service is loading. Try again in a moment.');
            return;
        }
        try {
            await promptAsync();
        } catch (err) {
            console.error('[Auth] promptAsync error:', err);
            Alert.alert('Error', 'Unable to open sign-in. Please try again.');
        }
    }, [discovery, promptAsync]);

    const logout = useCallback(async () => {
        // Best-effort token revocation — never block logout on this
        if (session?.refreshToken && discovery?.revocationEndpoint) {
            try {
                const body = new URLSearchParams({
                    token: session.refreshToken,
                    client_id: DESCOPE_PROJECT_ID,
                });
                await fetch(discovery.revocationEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: body.toString(),
                });
            } catch (err) {
                console.warn('[Auth] Revocation request failed (non-fatal):', err);
            }
        }
        await clearSession();
    }, [session, discovery, clearSession]);

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
