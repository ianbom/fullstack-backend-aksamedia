import type { PaginationState } from '../../types';

interface PaginationProps {
    pagination: PaginationState;
    onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const buttonBaseClasses =
        'px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-surface-dark';
    const buttonActiveClasses = 'bg-primary text-white';
    const buttonInactiveClasses =
        'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700';
    const buttonDisabledClasses = 'opacity-50 cursor-not-allowed';

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-slate-600 dark:text-slate-400">
                Menampilkan <span className="font-medium">{startItem}</span> -{' '}
                <span className="font-medium">{endItem}</span> dari{' '}
                <span className="font-medium">{totalItems}</span> data
            </div>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`${buttonBaseClasses} ${buttonInactiveClasses} ${currentPage === 1 ? buttonDisabledClasses : ''
                        }`}
                    aria-label="Previous page"
                >
                    <span className="material-icons text-lg">chevron_left</span>
                </button>

                {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page as number)}
                            className={`${buttonBaseClasses} ${currentPage === page ? buttonActiveClasses : buttonInactiveClasses
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`${buttonBaseClasses} ${buttonInactiveClasses} ${currentPage === totalPages ? buttonDisabledClasses : ''
                        }`}
                    aria-label="Next page"
                >
                    <span className="material-icons text-lg">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
