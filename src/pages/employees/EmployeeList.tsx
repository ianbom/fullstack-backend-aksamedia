import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, deleteEmployee } from '../../utils/employeeService';
import { getAllDivisions } from '../../utils/divisionService';
import { Pagination } from '../../components/ui/Pagination';
import { Modal } from '../../components/ui/Modal';
import { useQueryParams } from '../../hooks/useQueryParams';
import type { Employee, Division } from '../../types';

export function EmployeeListPage() {
    const { page, search, division, setPage, setSearch, setDivision } = useQueryParams();
    const [searchInput, setSearchInput] = useState(search);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    const { data: employeeData, isLoading } = useQuery({
        queryKey: ['employees', { page, search, division }],
        queryFn: () =>
            getEmployees({
                page,
                name: search || undefined,
                division_id: division || undefined,
                per_page: 10,
            }),
    });

    const { data: divisions = [] } = useQuery<Division[]>({
        queryKey: ['divisions', 'all'],
        queryFn: getAllDivisions,
        staleTime: 5 * 60 * 1000,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            closeDeleteModal();
        },
    });

    const employees = employeeData?.data?.employees || [];
    const pagination = employeeData?.pagination
        ? {
            currentPage: employeeData.pagination.current_page,
            totalPages: employeeData.pagination.last_page,
            totalItems: employeeData.pagination.total,
            itemsPerPage: employeeData.pagination.per_page,
        }
        : { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                setSearch(searchInput);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput, search, setSearch]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
    };

    const handleDivisionChange = (value: string) => {
        setDivision(value);
    };

    const handleResetFilters = () => {
        setSearchInput('');
        setSearch('');
        setDivision('');
    };

    const openDeleteModal = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setEmployeeToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleDelete = () => {
        if (employeeToDelete) {
            deleteMutation.mutate(employeeToDelete.id);
        }
    };

    const hasFilters = search || division;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daftar Karyawan</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Kelola data karyawan perusahaan
                    </p>
                </div>
                <Link
                    to="/employees/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                    <span className="material-icons text-lg">add</span>
                    Tambah Karyawan
                </Link>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Cari nama karyawan..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-slate-400 text-xl">
                                search
                            </span>
                        </div>
                    </div>
                    <div className="sm:w-52">
                        <div className="relative">
                            <select
                                value={division}
                                onChange={(e) => handleDivisionChange(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">Semua Divisi</option>
                                {divisions.map((div) => (
                                    <option key={div.id} value={div.id}>
                                        {div.name}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-slate-400 text-xl pointer-events-none">
                                business
                            </span>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-icons text-slate-400 text-lg pointer-events-none">
                                expand_more
                            </span>
                        </div>
                    </div>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                        >
                            <span className="material-icons text-lg">clear</span>
                            Reset
                        </button>
                    )}
                </div>

                {hasFilters && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        {search && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                <span className="material-icons text-sm">search</span>
                                "{search}"
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchInput('');
                                        setSearch('');
                                    }}
                                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                                >
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            </span>
                        )}
                        {division && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                <span className="material-icons text-sm">business</span>
                                {divisions.find((d) => d.id === division)?.name}
                                <button
                                    type="button"
                                    onClick={() => setDivision('')}
                                    className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-0.5"
                                >
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr className="text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                <th className="px-6 py-4">No</th>
                                <th className="px-6 py-4">Karyawan</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Telepon</th>
                                <th className="px-6 py-4 hidden md:table-cell">Divisi</th>
                                <th className="px-6 py-4">Posisi</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            <p className="text-sm text-slate-500">Loading...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-slate-500 dark:text-slate-400">
                                            <span className="material-icons text-5xl mb-4 block">
                                                sentiment_dissatisfied
                                            </span>
                                            <p className="text-lg font-medium">Tidak ada data</p>
                                            <p className="text-sm mt-1">
                                                {hasFilters ? 'Coba ubah filter atau kata kunci pencarian' : 'Mulai dengan menambahkan karyawan baru'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee, index) => {
                                    const rowNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1;
                                    return (
                                        <tr
                                            key={employee.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                {rowNumber}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={employee.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=09617c&color=fff`}
                                                        alt={employee.name}
                                                        className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-slate-700"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">{employee.name}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 sm:hidden">
                                                            {employee.phone || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                                                {employee.phone || '-'}
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                    {employee.division.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary">
                                                    {employee.position}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/employees/${employee.id}/edit`}
                                                        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-icons text-xl">edit</span>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteModal(employee)}
                                                        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <span className="material-icons text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {employees.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            <Modal isOpen={deleteModalOpen} onClose={closeDeleteModal} title="Hapus Karyawan">
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Apakah Anda yakin ingin menghapus karyawan{' '}
                        <span className="font-medium text-slate-900 dark:text-white">{employeeToDelete?.name}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
