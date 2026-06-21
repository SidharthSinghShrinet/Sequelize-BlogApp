import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import CategoryMesh from '../components/CategoryMesh';
import CategoryBlogsList from '../components/CategoryBlogsList';
import { useAllBlogs } from '../hooks/useBlogs';
import type { CategoryInfo } from '../hooks/useBlogs';

const CategoriesPage = () => {
    const { blogs, loading } = useAllBlogs();
    const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Navigation Header */}
            <TopNavBar />

            {/* Main Area */}
            <main className="flex-grow max-w-container-max w-full mx-auto px-gutter py-lg flex flex-col gap-8 md:gap-12">
                
                {/* Header Section */}
                <header className="flex flex-col gap-2.5">
                    <span className="font-mono text-[10px] font-bold text-primary dark:text-indigo-400 uppercase tracking-widest">
                        Metadata Parsing // Automation Engine
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Interactive Category Mesh
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                        A real-time vector node graph clustering MySQL database articles. Publications are automatically mapped to nodes based on content semantic keyword matches.
                    </p>
                </header>

                {/* Mesh Display & Loader */}
                {loading ? (
                    <div className="flex-grow flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider animate-pulse">
                                Loading dynamic nodes...
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
                        <CategoryMesh 
                            blogs={blogs} 
                            onSelectCategory={(category) => setSelectedCategory(category)} 
                        />
                    </div>
                )}

                {/* Slide-over Blogs List Drawer */}
                <CategoryBlogsList 
                    category={selectedCategory}
                    blogs={blogs}
                    onClose={() => setSelectedCategory(null)}
                />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CategoriesPage;
