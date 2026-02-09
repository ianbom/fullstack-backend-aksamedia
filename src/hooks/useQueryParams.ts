import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

interface UseQueryParamsReturn {
    page: number;
    search: string;
    division: string;
    setPage: (page: number) => void;
    setSearch: (search: string) => void;
    setDivision: (division: string) => void;
    setParams: (params: { page?: number; search?: string; division?: string }) => void;
}

export function useQueryParams(): UseQueryParamsReturn {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = useMemo(() => {
        const pageParam = searchParams.get('page');
        const pageNum = pageParam ? parseInt(pageParam, 10) : 1;
        return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
    }, [searchParams]);

    const search = useMemo(() => {
        return searchParams.get('search') || '';
    }, [searchParams]);

    const division = useMemo(() => {
        return searchParams.get('division') || '';
    }, [searchParams]);

    const setPage = useCallback(
        (newPage: number) => {
            const params = new URLSearchParams(searchParams);
            if (newPage === 1) {
                params.delete('page');
            } else {
                params.set('page', newPage.toString());
            }
            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const setSearch = useCallback(
        (newSearch: string) => {
            const params = new URLSearchParams(searchParams);
            if (newSearch) {
                params.set('search', newSearch);
            } else {
                params.delete('search');
            }
            params.delete('page');
            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const setDivision = useCallback(
        (newDivision: string) => {
            const params = new URLSearchParams(searchParams);
            if (newDivision) {
                params.set('division', newDivision);
            } else {
                params.delete('division');
            }
            params.delete('page');
            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const setParams = useCallback(
        (newParams: { page?: number; search?: string; division?: string }) => {
            const params = new URLSearchParams(searchParams);

            if (newParams.page !== undefined) {
                if (newParams.page === 1) {
                    params.delete('page');
                } else {
                    params.set('page', newParams.page.toString());
                }
            }

            if (newParams.search !== undefined) {
                if (newParams.search) {
                    params.set('search', newParams.search);
                } else {
                    params.delete('search');
                }
            }

            if (newParams.division !== undefined) {
                if (newParams.division) {
                    params.set('division', newParams.division);
                } else {
                    params.delete('division');
                }
            }

            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    return { page, search, division, setPage, setSearch, setDivision, setParams };
}
