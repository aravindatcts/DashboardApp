import { AuthProvider as DescopeAuthProvider, useSession, useUser, useDescope } from '@descope/react-sdk';

const DESCOPE_PROJECT_ID = 'P3CAhP3b0wQIFXYY7dAViJzEKO7P';

// Thin wrapper — delegates everything to the Descope React SDK
export const AuthProvider = ({ children }) => (
    <DescopeAuthProvider projectId={DESCOPE_PROJECT_ID}>
        {children}
    </DescopeAuthProvider>
);

export const useAuth = () => {
    const { isAuthenticated, isSessionLoading } = useSession();
    const { user: descopeUser, isUserLoading } = useUser();
    const { logout: descopeLogout } = useDescope();

    return {
        user: isAuthenticated ? descopeUser : null,
        session: null,  // managed internally by Descope SDK
        isAuthenticated,
        isLoading: isSessionLoading || isUserLoading,
        // login is handled directly by the <Descope> flow component in Login.web.js
        login: () => {},
        logout: descopeLogout,
    };
};
