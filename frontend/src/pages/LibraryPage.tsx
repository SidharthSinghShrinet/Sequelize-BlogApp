import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BlogApi, BookmarkApi } from '../api/client';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import Tabs from '../components/Tabs';
import toast from 'react-hot-toast';

const LibraryPage = () => {
    const { user, bookmarkedBlogIds, bookmarkedProjectIds, toggleBlogBookmark, toggleProjectBookmark } = useAuth();
    const [activeTab, setActiveTab] = useState<'publications' | 'saved'>('publications');

    // My publications state
    const [myBlogs, setMyBlogs] = useState<any[]>([]);
    const [loadingMyBlogs, setLoadingMyBlogs] = useState(false);

    // Bookmarks state
    const [savedBlogs, setSavedBlogs] = useState<any[]>([]);
    const [savedProjects, setSavedProjects] = useState<any[]>([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [savedSubTab, setSavedSubTab] = useState<'blogs' | 'projects'>('blogs');

    const fetchMyBlogs = async () => {
        setLoadingMyBlogs(true);
        try {
            const response: any = await BlogApi.getUserBlogs();
            setMyBlogs(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch your publications.");
        } finally {
            setLoadingMyBlogs(false);
        }
    };

    const fetchSavedItems = async () => {
        setLoadingSaved(true);
        try {
            const response: any = await BookmarkApi.getBookmarks();
            setSavedBlogs(response.data.blogs || []);
            setSavedProjects(response.data.projects || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch saved items.");
        } finally {
            setLoadingSaved(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'publications') {
            fetchMyBlogs();
        } else if (activeTab === 'saved') {
            fetchSavedItems();
        }
    }, [activeTab]);

    const handleDeleteBlog = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
        try {
            await BlogApi.deleteBlog(id);
            toast.success("Blog deleted successfully!");
            setMyBlogs(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            toast.error("Failed to delete blog.");
        }
    };

    // Filters saved items locally using the global Set in AuthContext for instant reaction on unsave
    const visibleSavedBlogs = savedBlogs.filter(blog => bookmarkedBlogIds.has(blog.id));
    const visibleSavedProjects = savedProjects.filter(project => bookmarkedProjectIds.has(project.id));

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 transition-colors duration-300">
            <TopNavBar />

            <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-12">
                <div className="max-w-6xl mx-auto flex flex-col gap-8">

                    {/* Header */}
                    <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Library</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Access your published articles and saved collections in one place.</p>
                    </div>

                    {/* Tab Navigation */}
                    <Tabs
                        tabs={[
                            { id: 'publications', label: 'My Publications', icon: 'article', count: myBlogs.length },
                            { id: 'saved', label: 'Save for Later', icon: 'bookmark', count: visibleSavedBlogs.length + visibleSavedProjects.length }
                        ]}
                        activeTab={activeTab}
                        onChange={(id) => setActiveTab(id as any)}
                    />

                    {/* Tab Body */}
                    <div className="min-h-[400px] flex flex-col">

                        {/* Publications Tab */}
                        {activeTab === 'publications' && (
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Publications</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage articles you have authored.</p>
                                    </div>
                                    <Link to="/create" className="bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 hover:text-primary dark:text-indigo-400 dark:border-indigo-500/35 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/15 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                                        New Article
                                    </Link>
                                </div>

                                {loadingMyBlogs ? (
                                    <div className="flex-grow flex items-center justify-center py-20">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : myBlogs.length === 0 ? (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                                        <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-700 mb-3">note_add</span>
                                        <h4 className="text-base font-bold text-slate-850 dark:text-slate-300 mb-1">No publications yet</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-4">Start sharing your software engineering findings and build code patterns tutorials today!</p>
                                        <Link to="/create" className="bg-primary text-white p-2 text-xs font-bold px-4.5 py-2 rounded-xl transition-all shadow-md shadow-primary/20 hover:brightness-105 active:scale-95">
                                            Write Your First Blog
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 flex-grow">
                                        {myBlogs.map((blog) => (
                                            <BlogCard
                                                key={blog.id}
                                                post={blog}
                                                isOwnerCard={true}
                                                layout="list"
                                                onDelete={() => handleDeleteBlog(blog.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Saved Items Tab */}
                        {activeTab === 'saved' && (
                            <div className="flex flex-col flex-grow">
                                <div className="flex flex-col gap-1 mb-4">
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Save for Later</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">View articles and projects you bookmarked.</p>
                                </div>

                                {/* Sub-tabs */}
                                <Tabs
                                    variant="pill"
                                    className="mb-6"
                                    tabs={[
                                        { id: 'blogs', label: 'Articles', count: visibleSavedBlogs.length },
                                        { id: 'projects', label: 'Projects', count: visibleSavedProjects.length }
                                    ]}
                                    activeTab={savedSubTab}
                                    onChange={(id) => setSavedSubTab(id as any)}
                                />

                                {loadingSaved ? (
                                    <div className="flex-grow flex items-center justify-center py-20">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : savedSubTab === 'blogs' ? (
                                    visibleSavedBlogs.length === 0 ? (
                                        <div className="flex-grow flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                                            <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-700 mb-3">bookmark_border</span>
                                            <h4 className="text-base font-bold text-slate-850 dark:text-slate-300 mb-1">No saved articles</h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-4">Click the bookmark icon on any guide or article to save it for later.</p>
                                            <Link to="/blogs" className="bg-primary px-2 text-white text-xs font-bold px-4.5 py-2 rounded-xl transition-all shadow-md shadow-primary/20 hover:brightness-105 active:scale-95">
                                                Browse Articles
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {visibleSavedBlogs.map((blog) => (
                                                <BlogCard key={blog.id} post={blog} />
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    visibleSavedProjects.length === 0 ? (
                                        <div className="flex-grow flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                                            <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-700 mb-3">bookmark_border</span>
                                            <h4 className="text-base font-bold text-slate-850 dark:text-slate-300 mb-1">No saved projects</h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-4">Click the bookmark icon on any showcase project to save it for later.</p>
                                            <Link to="/projects" className="bg-primary px-2 text-white text-xs font-bold px-4.5 py-2 rounded-xl transition-all shadow-md shadow-primary/20 hover:brightness-105 active:scale-95">
                                                Browse Projects
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {visibleSavedProjects.map((project) => (
                                                <ProjectCard key={project.id} project={project} />
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LibraryPage;
