import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { isAuthenticated, login } = useAuth();
    const { mode, setThemeMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(username, password);

        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } else {
            setError(result.error || 'Login gagal');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background-dark dark:to-slate-900 px-4 transition-colors font-display">
            {/* Theme switcher */}
            <div className="absolute top-6 right-6">
                <button
                    onClick={() => setThemeMode(mode === 'dark' ? 'light' : 'dark')}
                    className="p-3 rounded-full bg-white dark:bg-surface-dark shadow-md text-slate-500 dark:text-slate-400 hover:text-primary transition-all"
                >
                    <span className="material-icons text-xl block">
                        {mode === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[480px]">
                <div className="bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-10 md:p-12 transition-colors">
                    {/* Logo & Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-6 text-white text-3xl font-bold">
                            E
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Welcome to EMS
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Manage your employees efficiently
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error message */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                                <span className="material-icons text-lg">error</span>
                                {error}
                            </div>
                        )}

                        {/* Username field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                            >
                                Username
                            </label>
                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <span className="material-icons-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">person_outline</span>
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                                >
                                    Password
                                </label>
                                <a href="#" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <span className="material-icons-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">lock_outline</span>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium letter-spacing-wider"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-surface-dark disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing In...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Hint */}
                    <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <span className="material-icons text-primary text-lg mt-0.5">info</span>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Demo Access:</p>
                                <div className="font-mono bg-white dark:bg-slate-900 rounded p-1.5 border border-slate-200 dark:border-slate-700 inline-block">
                                    <span className="select-all">U: admin</span> &nbsp; <span className="select-all">P: pastibisa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        © 2026 EMS Inc. &nbsp;•&nbsp; <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> &nbsp;•&nbsp; <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
