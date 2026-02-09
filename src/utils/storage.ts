/**
 * LocalStorage utility functions
 * Provides type-safe access to localStorage with JSON serialization
 */

const STORAGE_KEYS = {
    AUTH_USER: 'auth_user',
    AUTH_TOKEN: 'auth_token',
    THEME: 'theme_preference',
    EMPLOYEES: 'employees_data',
} as const;

/**
 * Get item from localStorage with type safety
 */
export function getStorageItem<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from localStorage [${key}]:`, error);
        return null;
    }
}

/**
 * Set item in localStorage with JSON serialization
 */
export function setStorageItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage [${key}]:`, error);
    }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from localStorage [${key}]:`, error);
    }
}

export { STORAGE_KEYS };
