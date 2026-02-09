export interface User {
    id: string;
    username: string;
    name: string;
    email?: string;
    phone?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface Division {
    id: string;
    name: string;
}

export interface Employee {
    id: string;
    image: string;
    name: string;
    phone: string;
    division: Division;
    position: string;
}

export interface EmployeeFormData {
    image: File | null;
    name: string;
    phone: string;
    divisionId: string;
    position: string;
}

export interface UserFormData {
    name: string;
    username: string;
    phone?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
}

export interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface ApiPagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface EmployeeQueryParams {
    page: number;
    search: string;
    divisionId?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
    mode: ThemeMode;
    isDark: boolean;
}
