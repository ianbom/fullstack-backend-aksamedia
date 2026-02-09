import { useState, useEffect, useRef, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, createEmployee, updateEmployee } from '../../utils/employeeService';
import { getAllDivisions } from '../../utils/divisionService';
import type { EmployeeFormData } from '../../types';

export function EmployeeFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(id);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<EmployeeFormData>({
        image: null,
        name: '',
        phone: '',
        divisionId: '',
        position: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [serverError, setServerError] = useState('');

    const { data: divisions = [] } = useQuery({
        queryKey: ['divisions', 'all'],
        queryFn: getAllDivisions,
        staleTime: 5 * 60 * 1000,
    });

    const { data: employeeData, isLoading: isLoadingEmployee } = useQuery({
        queryKey: ['employee', id],
        queryFn: () => getEmployees({ page: 1, per_page: 100 }),
        enabled: isEdit && !!id,
    });

    useEffect(() => {
        if (divisions.length > 0 && !formData.divisionId && !isEdit) {
            setFormData((prev) => ({ ...prev, divisionId: divisions[0].id }));
        }
    }, [divisions, formData.divisionId, isEdit]);

    useEffect(() => {
        if (isEdit && id && employeeData) {
            const employee = employeeData.data.employees.find((e) => e.id === id);
            if (employee) {
                setFormData({
                    image: null,
                    name: employee.name,
                    phone: employee.phone || '',
                    divisionId: employee.division.id,
                    position: employee.position,
                });
                setImagePreview(employee.image || '');
            } else {
                setNotFound(true);
            }
        }
    }, [id, isEdit, employeeData]);

    const createMutation = useMutation({
        mutationFn: (data: { name: string; phone?: string; division: string; position: string; image?: File | null }) =>
            createEmployee(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            navigate('/employees');
        },
        onError: (error: any) => {
            setServerError(error.response?.data?.message || 'Gagal menambahkan karyawan');
            setIsLoading(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ employeeId, data }: { employeeId: string; data: { name: string; phone?: string; division: string; position: string; image?: File | null } }) =>
            updateEmployee(employeeId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            navigate('/employees');
        },
        onError: (error: any) => {
            setServerError(error.response?.data?.message || 'Gagal memperbarui karyawan');
            setIsLoading(false);
        },
    });

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama wajib diisi';
        }

        if (!formData.divisionId) {
            newErrors.divisionId = 'Divisi wajib dipilih';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Posisi wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (!validate()) return;

        setIsLoading(true);

        const payload = {
            name: formData.name,
            phone: formData.phone || undefined,
            division: formData.divisionId,
            position: formData.position,
            image: formData.image,
        };

        if (isEdit && id) {
            updateMutation.mutate({ employeeId: id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleChange = (field: keyof EmployeeFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar (JPG, PNG, GIF, dll)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB');
            return;
        }

        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const inputClasses = (hasError: boolean) =>
        `w-full px-4 py-2.5 rounded-lg border ${hasError
            ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
            : 'border-slate-300 dark:border-slate-600 focus:ring-primary/50 focus:border-primary hover:border-primary/50'
        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`;

    if (notFound) {
        return (
            <div className="text-center py-12">
                <span className="material-icons text-6xl text-slate-400 mb-4 block">
                    sentiment_dissatisfied
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Karyawan tidak ditemukan
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Data karyawan dengan ID tersebut tidak ditemukan.
                </p>
                <Link
                    to="/employees"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                    <span className="material-icons text-lg">arrow_back</span>
                    Kembali ke daftar karyawan
                </Link>
            </div>
        );
    }

    if (isEdit && isLoadingEmployee) {
        return (
            <div className="flex justify-center items-center py-20">
                <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/employees"
                    className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 transition-colors"
                >
                    <span className="material-icons text-lg">arrow_back</span>
                    Kembali
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {isEdit ? 'Perbarui informasi karyawan' : 'Isi formulir untuk menambahkan karyawan baru'}
                </p>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {serverError && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                            <span className="material-icons text-lg">error</span>
                            {serverError}
                        </div>
                    )}

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Foto Karyawan
                        </label>

                        {imagePreview ? (
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-xl object-cover bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <span className="material-icons text-lg">close</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                                >
                                    <span className="material-icons text-lg">edit</span>
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isDragging
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                                        }`}>
                                        <span className="material-icons text-3xl">cloud_upload</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {isDragging ? 'Lepaskan file di sini' : 'Klik atau drag & drop foto'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            JPG, PNG, GIF (maks. 2MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Kosongkan untuk menggunakan foto default
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={inputClasses(!!errors.name)}
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Nomor Telepon
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={inputClasses(false)}
                            placeholder="+62 812-3456-7890"
                        />
                    </div>

                    {/* Division */}
                    <div>
                        <label
                            htmlFor="division"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Divisi <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="division"
                            value={formData.divisionId}
                            onChange={(e) => handleChange('divisionId', e.target.value)}
                            className={inputClasses(!!errors.divisionId)}
                        >
                            <option value="">Pilih Divisi</option>
                            {divisions.map((div) => (
                                <option key={div.id} value={div.id}>
                                    {div.name}
                                </option>
                            ))}
                        </select>
                        {errors.divisionId && (
                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.divisionId}</p>
                        )}
                    </div>

                    {/* Position */}
                    <div>
                        <label
                            htmlFor="position"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Posisi / Jabatan <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="position"
                            type="text"
                            value={formData.position}
                            onChange={(e) => handleChange('position', e.target.value)}
                            className={inputClasses(!!errors.position)}
                            placeholder="Contoh: Software Engineer"
                        />
                        {errors.position && (
                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.position}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Link
                            to="/employees"
                            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 active:scale-95"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : isEdit ? (
                                'Simpan Perubahan'
                            ) : (
                                'Tambah Karyawan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
