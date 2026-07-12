import React, { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { usePaginatedBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';

const AllBlogsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Debounce search query by 300ms to avoid constant API requests
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { blogs, pagination, loading } = usePaginatedBlogs({
        page: currentPage,
        limit: 9,
        search: debouncedSearchQuery
    });

    const { totalPages } = pagination;

    // Helper to generate list of page numbers to show (e.g. 1 2 3 ... 10)
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            <TopNavBar />
            <main className="flex-grow max-w-container-max w-full mx-auto px-gutter py-lg flex flex-col gap-lg">
                <header>
                    <h1 className="font-headline-xl text-on-surface dark:text-white">Explore Ideas</h1>
                    <p className="font-body-lg text-on-surface-variant dark:text-slate-400">Discover the latest insights from our community.</p>
                </header>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container dark:bg-slate-900 p-sm rounded-xl border border-outline-variant/30 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2 flex-grow max-w-md">
                        <div className="w-full relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400">search</span>
                            <input 
                                type="text" 
                                placeholder="Search articles..." 
                                className="input-field w-full rounded-lg pl-10 pr-4 py-2 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                            {blogs.map((post: any) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                        
                        {blogs.length === 0 && (
                            <div className="text-center py-20 text-on-surface-variant dark:text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                <p className="font-headline-sm">No articles found matching your search.</p>
                            </div>
                        )}

                        {/* Premium Pagination Component */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12 py-6 border-t border-outline-variant/15 dark:border-slate-800/40">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center p-2 rounded-xl border border-outline-variant/30 dark:border-slate-800 text-on-surface-variant dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container dark:hover:bg-slate-900 transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                
                                <div className="flex items-center gap-1.5">
                                    {getPageNumbers().map((pageNum, idx) => {
                                        if (pageNum === '...') {
                                            return (
                                                <span key={`ellipsis-${idx}`} className="px-3 py-1.5 text-on-surface-variant dark:text-slate-500 font-mono text-sm select-none">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return (
                                            <button
                                                key={`page-${pageNum}`}
                                                onClick={() => setCurrentPage(pageNum as number)}
                                                className={`px-3.5 py-1.5 rounded-xl border font-bold text-sm transition-all duration-200 ${
                                                    currentPage === pageNum
                                                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/25 dark:shadow-indigo-500/15'
                                                        : 'border-outline-variant/30 dark:border-slate-800 text-on-surface-variant dark:text-slate-450 hover:bg-surface-container dark:hover:bg-slate-900'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center justify-center p-2 rounded-xl border border-outline-variant/30 dark:border-slate-800 text-on-surface-variant dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container dark:hover:bg-slate-900 transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AllBlogsPage;
