import api from './api';
import type { Division, ApiPagination } from '../types';

interface GetDivisionsParams {
    name?: string;
    per_page?: number;
    page?: number;
}

interface GetDivisionsResponse {
    status: string;
    message: string;
    data: {
        divisions: Division[];
    };
    pagination: ApiPagination;
}

export async function getDivisions(params?: GetDivisionsParams): Promise<GetDivisionsResponse> {
    const response = await api.get<GetDivisionsResponse>('/divisions', { params });
    return response.data;
}

export async function getAllDivisions(): Promise<Division[]> {
    const divisions: Division[] = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
        const response = await getDivisions({ page: currentPage, per_page: 50 });
        divisions.push(...response.data.divisions);
        lastPage = response.pagination.last_page;
        currentPage++;
    } while (currentPage <= lastPage);

    return divisions;
}
