import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ 
    currentPage, 
    lastPage, 
    total, 
    onPageChange,
    itemCount
}) {
    if (lastPage <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (lastPage <= maxVisible) {
            for (let i = 1; i <= lastPage; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(lastPage);
            }
        }
        return pages;
    };

    return (
        <div className="px-6 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-gray-400">
                Showing <span className="text-[#0F172A]">{itemCount}</span> of <span className="text-[#0F172A]">{total}</span> logs
            </p>
            <div className="flex items-center space-x-1 sm:space-x-2">
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-100 text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                {getPageNumbers().map((page, index) => (
                    <button 
                        key={index}
                        onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                        disabled={page === '...'}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-black transition-all ${
                            currentPage === page 
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                : page === '...'
                                ? 'text-gray-400 border-transparent cursor-default'
                                : 'text-gray-400 hover:text-[#0F172A] border border-slate-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="p-2 rounded-xl border border-slate-100 text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
