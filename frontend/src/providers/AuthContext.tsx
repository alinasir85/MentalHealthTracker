import React, {createContext, ReactNode, useContext, useState} from 'react';
import {AuthContextType, AuthState, User} from '@app/lib/types';

declare global {
    interface Window {
        mentalhealthWS?: WebSocket;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    React.useEffect(() => {
        // Check for existing token and validate it
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setAuthState({
                user: JSON.parse(storedUser),
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            setAuthState(prev => ({...prev, isLoading: false}));
        }
    }, []);

    const login = async (response: any) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: response.credential}),
            });

            if (!res.ok) throw new Error('Authentication failed');

            const user: User = await res.json();

            localStorage.setItem('token', response.credential);
            localStorage.setItem('user', JSON.stringify(user));

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });

            // Close WebSocket connection if open
            if (window.mentalhealthWS) {
                window.mentalhealthWS.close();
            }
        }
    };

    return (
        <AuthContext.Provider value={{...authState, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
