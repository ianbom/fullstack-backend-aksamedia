

import { Outlet } from 'react-router-dom';
import { NavbarPro } from './NavbarPro';

export function LayoutPro() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
            <NavbarPro />
            <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}
