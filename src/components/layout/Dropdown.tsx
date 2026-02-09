
import { useState, useRef, useEffect, type ReactNode } from 'react';

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const alignmentClasses = align === 'right' ? 'right-0' : 'left-0';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {trigger}
            </button>

            {isOpen && (
                <div
                    className={`absolute ${alignmentClasses} mt-2 w-48 rounded-lg bg-white dark:bg-surface-dark shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-slate-200 dark:border-slate-700 z-50`}
                    role="menu"
                >
                    <div className="py-1" onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

interface DropdownItemProps {
    children: ReactNode;
    onClick?: () => void;
    danger?: boolean;
}

export function DropdownItem({ children, onClick, danger = false }: DropdownItemProps) {
    const baseClasses = 'block w-full px-4 py-2 text-left text-sm transition-colors';
    const colorClasses = danger
        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700';

    return (
        <button type="button" className={`${baseClasses} ${colorClasses}`} onClick={onClick} role="menuitem">
            {children}
        </button>
    );
}

interface DropdownDividerProps { }

export function DropdownDivider({ }: DropdownDividerProps) {
    return <hr className="my-1 border-slate-200 dark:border-slate-700" />;
}
