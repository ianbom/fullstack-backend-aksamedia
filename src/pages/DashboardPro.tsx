import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getEmployees, deleteEmployee } from '../utils/employeeService';
import { getDivisions } from '../utils/divisionService';
import { Dropdown, DropdownItem, DropdownDivider } from '../components/layout/Dropdown';
import { Modal } from '../components/ui/Modal';
import type { Employee } from '../types';

export function DashboardProPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    const { data: employeeData, isLoading: isLoadingEmployees } = useQuery({
        queryKey: ['employees', 'dashboard'],
        queryFn: () => getEmployees({ per_page: 5 }),
    });

    const { data: divisionData } = useQuery({
        queryKey: ['divisions', 'dashboard'],
        queryFn: () => getDivisions({ per_page: 50 }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            closeDeleteModal();
        },
    });

    const employees = employeeData?.data?.employees || [];
    const totalEmployees = employeeData?.pagination?.total || 0;
    const totalDivisions = divisionData?.pagination?.total || 0;
    const positions = [...new Set(employees.map((e) => e.position))];

    const stats = [
        {
            label: 'Total Employees',
            value: totalEmployees.toString(),
            icon: 'groups',
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            label: 'Divisions',
            value: totalDivisions.toString(),
            icon: 'business',
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Positions',
            value: positions.length.toString(),
            icon: 'work',
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
    ];

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

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary via-primary-dark to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-20 -mb-20 blur-3xl" />

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-white space-y-2 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Welcome back, {user?.name}
                        </h1>
                        <p className="text-primary-light text-lg max-w-xl">
                            Here is what's happening in your company today.
                        </p>
                    </div>
                    <Link
                        to="/employees/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        <span className="material-icons">add</span>
                        Add Employee
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="relative bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                                <span className={`material-icons-outlined text-3xl ${stat.textColor}`}>
                                    {stat.icon}
                                </span>
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color}`} />
                    </div>
                ))}
            </div>

            {/* Recent Employees Table */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Recent Employees
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Latest additions to your team
                        </p>
                    </div>
                    <Link
                        to="/employees"
                        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                    >
                        View all
                        <span className="material-icons text-sm">arrow_forward</span>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-4 rounded-tl-lg">Employee</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Phone</th>
                                <th className="px-6 py-4">Division</th>
                                <th className="px-6 py-4 hidden md:table-cell">Position</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Status</th>
                                <th className="px-6 py-4 rounded-tr-lg text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoadingEmployees ? (
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
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee, index) => {
                                    const isEven = index % 2 === 1;
                                    return (
                                        <tr
                                            key={employee.id}
                                            className={`group hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${isEven ? 'bg-slate-50/30 dark:bg-slate-800/20' : ''}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={employee.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=09617c&color=fff`}
                                                        alt={employee.name}
                                                        className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-slate-700"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {employee.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">ID: {employee.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 hidden sm:table-cell">
                                                {employee.phone || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                    {employee.division.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-primary/10 text-primary">
                                                    {employee.position}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Dropdown
                                                    trigger={
                                                        <button
                                                            type="button"
                                                            className="text-slate-400 hover:text-primary transition-colors p-1"
                                                        >
                                                            <span className="material-icons-outlined text-lg">more_vert</span>
                                                        </button>
                                                    }
                                                >
                                                    <Link to={`/employees/${employee.id}/edit`}>
                                                        <DropdownItem>
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-icons-outlined text-lg">edit</span>
                                                                Edit
                                                            </div>
                                                        </DropdownItem>
                                                    </Link>
                                                    <DropdownDivider />
                                                    <DropdownItem onClick={() => openDeleteModal(employee)} danger>
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-icons-outlined text-lg">delete</span>
                                                            Delete
                                                        </div>
                                                    </DropdownItem>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalOpen} onClose={closeDeleteModal} title="Delete Employee">
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Are you sure you want to delete{' '}
                        <span className="font-medium text-slate-900 dark:text-white">{employeeToDelete?.name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
