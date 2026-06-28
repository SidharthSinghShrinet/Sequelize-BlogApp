import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogImageUrl, calculateReadingTime, usePaginatedBlogs } from '../hooks/useBlogs';
import type { CategoryInfo } from '../hooks/useBlogs';

interface CategoryBlogsListProps {
    category: CategoryInfo | null;
    onClose: () => void;
}

const CategoryBlogsList: React.FC<CategoryBlogsListProps> = ({ category, onClose }) => {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (category) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [category]);

    const { blogs, loading } = usePaginatedBlogs({
        page: 1,
        limit: 100, // Fetch up to 100 articles in the category
        category: category?.id || ""
    });

    if (!category) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop Overlay */}
            <div 
                className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Slide-over Drawer Panel */}
            <aside className="relative w-full sm:w-[485px] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-100 dark:border-slate-800/80 shadow-2xl flex flex-col z-10 transition-transform duration-300 translate-x-0 animate-[slideIn_0.3s_ease-out]">
                {/* Header Profile with gradient banner */}
                <div className={`p-6 border-b border-slate-100 dark:border-slate-850/60 bg-gradient-to-r ${category.color} relative overflow-hidden shrink-0`}>
                    {/* Background decorations */}
                    <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl font-mono select-none pointer-events-none">
                        &lt;/&gt;
                    </div>
                    
                    {/* Close Trigger */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 focus:outline-none transition-colors flex items-center justify-center"
                        aria-label="Close panel"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>

                    {/* Category Label */}
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                            <span className="material-symbols-outlined text-[22px]">{category.icon}</span>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold tracking-tight">{category.name}</h2>
                            <span className="text-[10px] uppercase font-bold tracking-wider font-mono opacity-80 mt-0.5">
                                {!loading ? `${blogs.length} ${blogs.length === 1 ? 'Article' : 'Articles'} Published` : 'Loading articles...'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subtitle Description */}
                <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-b border-slate-100 dark:border-slate-850/30 text-xs text-slate-500 dark:text-slate-400 font-medium italic shrink-0">
                    "{category.description}"
                </div>

                {/* Scrollable Blogs List */}
                <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner animate-bounce">
                                <span className="material-symbols-outlined text-[32px]">drafts</span>
                            </div>
                            <div className="flex flex-col gap-1 max-w-xs">
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-355">No articles found</h3>
                                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                                    No publications matching this node category keyword criteria have been created yet.
                                </p>
                            </div>
                            <Link 
                                to="/create"
                                className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:brightness-105 transition-all mt-2"
                            >
                                Publish First Article
                            </Link>
                        </div>
                    ) : (
                        blogs.map((blog: any) => {
                            const readTime = calculateReadingTime(blog.content);
                            const authorInitial = blog.authorDetails?.username?.charAt(0).toUpperCase() || 'A';
                            const authorName = blog.authorDetails?.username || 'Anonymous';
                            const postDate = new Date(blog.createdAt).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            });

                            return (
                                <Link 
                                    to={`/post/${blog.id}`}
                                    key={blog.id}
                                    onClick={onClose}
                                    className="group flex gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-indigo-500/30 transition-all duration-300"
                                >
                                    {/* Thumbnail Preview */}
                                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-50 dark:border-slate-800 relative bg-slate-50">
                                        <img 
                                            src={getBlogImageUrl(blog.content, blog.title, blog.id, blog.thumbnail)}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Info Panel */}
                                    <div className="flex flex-col justify-between flex-grow min-w-0 py-0.5">
                                        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                                            {blog.title}
                                        </h3>

                                        <div className="flex items-center justify-between gap-2 mt-2">
                                            {/* Author */}
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-650 dark:text-slate-300">
                                                    {authorInitial}
                                                </div>
                                                <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold truncate">
                                                    {authorName}
                                                </span>
                                            </div>

                                            {/* Metadata */}
                                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium font-mono shrink-0">
                                                <span>{postDate}</span>
                                                <span>•</span>
                                                <span>{readTime}m read</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </aside>
        </div>
    );
};

export default CategoryBlogsList;
