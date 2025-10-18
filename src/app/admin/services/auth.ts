import { encryptData, decryptData } from '@/app/api/crypto';

const TOKEN_KEY = 'portfolio_admin_token';

export const saveAuthToken = (token: string) => {
    if (typeof window === 'undefined') return;
    try {
        const encrypted = encryptData({ token });
        localStorage.setItem(TOKEN_KEY, encrypted);
    } catch { }
};

export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const data = decryptData(raw);
    return data?.token || null;
};

export const clearAuthToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};


