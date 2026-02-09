import api from './api';
import type { Employee, ApiPagination } from '../types';

interface GetEmployeesParams {
    name?: string;
    division_id?: string;
    per_page?: number;
    page?: number;
}

interface GetEmployeesResponse {
    status: string;
    message: string;
    data: {
        employees: Employee[];
    };
    pagination: ApiPagination;
}

export async function getEmployees(params?: GetEmployeesParams): Promise<GetEmployeesResponse> {
    const response = await api.get<GetEmployeesResponse>('/employees', { params });
    return response.data;
}

export async function createEmployee(data: {
    name: string;
    phone?: string;
    division: string;
    position: string;
    image?: File | null;
}): Promise<void> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('division', data.division);
    formData.append('position', data.position);
    if (data.image) formData.append('image', data.image);

    await api.post('/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function updateEmployee(
    id: string,
    data: {
        name: string;
        phone?: string;
        division: string;
        position: string;
        image?: File | null;
    }
): Promise<void> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('division', data.division);
    formData.append('position', data.position);
    if (data.image) formData.append('image', data.image);
    formData.append('_method', 'PUT');

    await api.post(`/employees/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function deleteEmployee(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
}
