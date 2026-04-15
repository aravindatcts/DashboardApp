import React, { createContext } from 'react';
import { AuthProvider as DescopeAuthProvider, useSession, useUser, useDescope } from '@descope/react-sdk';

const DESCOPE_PROJECT_ID = "P3CAhP3b0wQIFXYY7dAViJzEKO7P";

export const AuthProvider = ({ children }) => {
    return (
        <DescopeAuthProvider projectId={DESCOPE_PROJECT_ID}>
            {children}
        </DescopeAuthProvider>
    );
};

export const useAuth = () => {
    const { isAuthenticated, isSessionLoading } = useSession();
    const { user: descopeUser, isUserLoading } = useUser();
    const { logout } = useDescope();

    const isLoading = isSessionLoading || isUserLoading;
    const user = isAuthenticated ? descopeUser : null;
    console.log("Hello");
    return {
        user,
        isLoading,
        logout,
        // login is handled directly by the Descope component inside Login.web.js
        login: () => { }
    };
};
