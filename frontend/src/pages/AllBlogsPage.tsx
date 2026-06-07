import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { useAllBlogs } from '../hooks/useBlogs';

const AllBlogsPage = () => {
    const { blogs, loading } = useAllBlogs();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBlogs = blogs.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                className="w-full bg-surface-variant dark:bg-slate-950 text-on-surface dark:text-slate-100 rounded-lg pl-10 pr-4 py-2 outline-none border-none focus:ring-1 focus:ring-primary transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                            {filteredBlogs.map((post: any) => (
                                <Link to={`/post/${post.id}`} key={post.id} className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl overflow-hidden border border-outline-variant/30 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 transition-all group flex flex-col">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={`https://picsum.photos/seed/post${post.id}/800/400`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                                        <div className="absolute top-sm left-sm px-2 py-1 bg-surface/80 dark:bg-slate-950/80 backdrop-blur-md rounded font-label-sm text-primary">Article</div>
                                    </div>
                                    <div className="p-sm flex flex-col flex-grow gap-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">{post.authorDetails?.username?.charAt(0).toUpperCase()}</div>
                                            <span className="text-label-sm text-on-surface-variant dark:text-slate-400">{post.authorDetails?.username} • {new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h2 className="font-headline-md text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{post.title}</h2>
                                        <p className="font-body-md text-on-surface-variant dark:text-slate-400 line-clamp-3">{post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
                                    </div>
                                    <div className="border-t border-outline-variant/30 dark:border-slate-800 px-sm py-xs flex justify-between items-center text-on-surface-variant dark:text-slate-400">
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-1 hover:text-primary dark:hover:text-indigo-400"><span className="material-symbols-outlined text-[18px]">favorite</span> 0</button>
                                            <button className="flex items-center gap-1 hover:text-primary dark:hover:text-indigo-400"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> 0</button>
                                        </div>
                                        <span className="material-symbols-outlined text-[18px] hover:text-primary dark:hover:text-indigo-400">share</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {filteredBlogs.length === 0 && (
                            <div className="text-center py-20 text-on-surface-variant dark:text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                <p className="font-headline-sm">No articles found matching your search.</p>
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
