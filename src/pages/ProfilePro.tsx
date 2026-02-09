import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserFormData } from '../types';

export function ProfileProPage() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState<UserFormData>({
        name: user?.name || '',
        username: user?.username || '',
        phone: user?.phone || '',
        email: user?.email || '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!formData.name.trim()) {
            setErrorMessage('Nama tidak boleh kosong');
            return;
        }

        if (!formData.username.trim()) {
            setErrorMessage('Username tidak boleh kosong');
            return;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrorMessage('Format email tidak valid');
            return;
        }

        setIsLoading(true);
        const result = await updateProfile(formData);
        setIsLoading(false);

        if (result.success) {
            setSuccessMessage('Profil berhasil diperbarui!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setErrorMessage(result.error || 'Gagal memperbarui profil');
        }
    };

    const inputWithIconClasses = "w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
                <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-icons text-lg">home</span>
                    Dashboard
                </Link>
                <span className="material-icons text-slate-400 text-sm">chevron_right</span>
                <span className="text-slate-900 dark:text-white font-medium">Profile</span>
            </nav>

            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-primary to-[#0a7a9e] rounded-2xl p-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center sm:text-left text-white flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{user?.name || 'User'}</h1>
                        <p className="text-white/70">@{user?.username}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-1">
                            Settings
                        </h3>
                        <nav className="space-y-1">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium">
                                <span className="material-icons text-xl">person</span>
                                Profile Details
                            </div>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons text-xl">lock</span>
                                Security
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons text-xl">notifications</span>
                                Notifications
                            </button>
                        </nav>
                    </div>

                    <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                                <span className="material-icons text-primary text-2xl">help_outline</span>
                            </div>
                            <h4 className="font-semibold mb-2">Need Help?</h4>
                            <p className="text-sm text-slate-400 mb-4">
                                Contact support for account issues.
                            </p>
                            <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                Get Support
                                <span className="material-icons text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Update your personal details.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {successMessage && (
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                                    <span className="material-icons text-emerald-600 dark:text-emerald-400">check_circle</span>
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{successMessage}</p>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
                                    <span className="material-icons text-red-600 dark:text-red-400">error</span>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">{errorMessage}</p>
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label htmlFor="name" className={labelClasses}>
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 text-lg">badge</span>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={inputWithIconClasses}
                                        placeholder="Masukkan nama"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className={labelClasses}>
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 text-lg">alternate_email</span>
                                    <input
                                        id="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className={inputWithIconClasses}
                                        placeholder="Masukkan username"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="phone" className={labelClasses}>Phone</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 text-lg">phone</span>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className={inputWithIconClasses}
                                            placeholder="+62 812-3456-7890"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className={labelClasses}>Email</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 text-lg">mail</span>
                                        <input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={inputWithIconClasses}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    to="/"
                                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-lg">save</span>
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
