import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserFormData, AuthState } from '../types';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/storage';
import api from '../utils/api';

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (data: UserFormData) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(() => {
        return getStorageItem<User>(STORAGE_KEYS.AUTH_USER);
    });

    const isAuthenticated = user !== null;

    useEffect(() => {
        const token = getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
        if (token && !user) {
            api.get('/auth/profile')
                .then((res) => {
                    const admin = res.data.data.admin;
                    setUser(admin);
                    setStorageItem(STORAGE_KEYS.AUTH_USER, admin);
                })
                .catch(() => {
                    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
                    removeStorageItem(STORAGE_KEYS.AUTH_USER);
                    setUser(null);
                });
        }
    }, []);

    const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await api.post('/login', { username, password });
            const { token, admin } = response.data.data;

            setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
            setStorageItem(STORAGE_KEYS.AUTH_USER, admin);
            setUser(admin);

            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
            return { success: false, error: message };
        }
    };

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } catch {
            // ignore logout errors
        } finally {
            setUser(null);
            removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
            removeStorageItem(STORAGE_KEYS.AUTH_USER);
        }
    }, []);

    const updateProfile = async (data: UserFormData): Promise<{ success: boolean; error?: string }> => {
        try {
            const payload: Record<string, string> = {};
            if (data.name) payload.name = data.name;
            if (data.username) payload.username = data.username;
            if (data.phone) payload.phone = data.phone;
            if (data.email) payload.email = data.email;
            if (data.password) {
                payload.password = data.password;
                payload.password_confirmation = data.password_confirmation || '';
            }

            const response = await api.put('/auth/profile', payload);
            const admin = response.data.data.admin;

            setUser(admin);
            setStorageItem(STORAGE_KEYS.AUTH_USER, admin);

            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gagal memperbarui profil.';
            return { success: false, error: message };
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
