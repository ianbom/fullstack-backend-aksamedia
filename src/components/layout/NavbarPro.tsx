
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Dropdown, DropdownItem, DropdownDivider } from './Dropdown';
import type { ThemeMode } from '../../types';

const navLinks = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/employees', label: 'Employees', icon: 'groups' },
];

const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'System', icon: 'computer' },
];

export function NavbarPro() {
    const { user, logout } = useAuth();
    const { mode, setThemeMode } = useTheme();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    const handleLogout = async () => {
        await logout();
    };

    const isActivePath = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const getCurrentThemeIcon = () => {
        const current = themeOptions.find(opt => opt.value === mode);
        return current?.icon || 'light_mode';
    };

    return (
        <>
            <nav className="fixed w-full z-50 glassmorphism transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Left: Hamburger + Logo */}
                        <div className="flex items-center gap-4">
                            {/* Hamburger Menu - Mobile Only */}
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-icons">menu</span>
                            </button>

                            {/* Logo */}
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="material-icons-outlined text-white text-xl md:text-2xl">groups</span>
                                </div>
                                <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 dark:text-white">
                                    EMS Pro
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex space-x-1 ml-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActivePath(link.path)
                                            ? 'text-primary bg-primary/10 dark:bg-primary/20 dark:text-white'
                                            : 'text-slate-500 hover:text-primary hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Theme Dropdown */}
                            <Dropdown
                                trigger={
                                    <button
                                        type="button"
                                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-icons-outlined">
                                            {getCurrentThemeIcon()}
                                        </span>
                                    </button>
                                }
                            >
                                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Theme</p>
                                </div>
                                {themeOptions.map((option) => (
                                    <DropdownItem
                                        key={option.value}
                                        onClick={() => setThemeMode(option.value)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`material-icons-outlined text-lg ${mode === option.value ? 'text-primary' : ''}`}>
                                                {option.icon}
                                            </span>
                                            <span className={mode === option.value ? 'text-primary font-medium' : ''}>
                                                {option.label}
                                            </span>
                                            {mode === option.value && (
                                                <span className="material-icons text-primary text-lg ml-auto">check</span>
                                            )}
                                        </div>
                                    </DropdownItem>
                                ))}
                            </Dropdown>

                            {/* User Profile */}
                            <div className="relative">
                                <Dropdown
                                    trigger={
                                        <div className="flex items-center gap-3 focus:outline-none">
                                            <div className="h-9 w-9 md:h-10 md:w-10 rounded-full ring-2 ring-white dark:ring-slate-700 bg-primary flex items-center justify-center text-white font-semibold text-sm md:text-base">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">HR Manager</p>
                                            </div>
                                            <span className="material-icons-outlined text-slate-400 hidden md:block">
                                                expand_more
                                            </span>
                                        </div>
                                    }
                                >
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">@{user?.username}</p>
                                    </div>
                                    <Link to="/profile">
                                        <DropdownItem>Profile</DropdownItem>
                                    </Link>
                                    <DropdownDivider />
                                    <DropdownItem onClick={handleLogout} danger>
                                        Logout
                                    </DropdownItem>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-icons-outlined text-white">groups</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                            EMS Pro
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="p-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActivePath(link.path)
                                ? 'text-primary bg-primary/10 dark:bg-primary/20'
                                : 'text-slate-600 hover:text-primary hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className="material-icons-outlined">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer - Theme Options */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 px-2">
                        Theme
                    </p>
                    <div className="flex gap-2">
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setThemeMode(option.value)}
                                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-all ${mode === option.value
                                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <span className="material-icons-outlined text-lg">{option.icon}</span>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
