import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { BlogApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../hooks/useBlogs';
import toast from 'react-hot-toast';

const BlogPostPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [progress, setProgress] = useState(0);
    const { blog, loading, error } = useBlog(id);

    useEffect(() => {
        if (error) {
            navigate('/blogs');
        }
    }, [error, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setProgress((winScroll / height) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await BlogApi.deleteBlog(id!);
            toast.success("Blog post deleted");
            navigate('/blogs');
        } catch (err) {
            toast.error("Failed to delete blog");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <TopNavBar />
                <main className="flex-grow flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!blog) return null;

    const isAuthor = user && user.id === blog.author;

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="fixed top-0 left-0 h-1 bg-primary z-[60] w-full" style={{ transform: `scaleX(${progress / 100})`, transformOrigin: '0%' }}></div>
            <TopNavBar />
            <main className="max-w-container-max mx-auto px-gutter py-xl flex-grow w-full">
                <article className="max-w-[720px] mx-auto">
                    <div className="mb-sm flex gap-2 justify-between items-center">
                        <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 font-label-sm text-primary">Article</span>
                        {isAuthor && (
                            <div className="flex gap-2">
                                <Link to={`/edit/${blog.id}`} className="text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 transition-colors font-label-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                                </Link>
                                <button onClick={handleDelete} className="text-error hover:brightness-110 transition-colors font-label-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                                </button>
                            </div>
                        )}
                    </div>
                    <h1 className="font-headline-xl text-on-surface dark:text-white mb-md">{blog.title}</h1>
                    <div className="flex items-center gap-sm mb-lg border-y border-outline-variant dark:border-slate-800 py-md">
                        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center text-lg font-bold">
                            {blog.authorDetails?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-label-md font-semibold text-slate-800 dark:text-slate-200">{blog.authorDetails?.username}</div>
                            <div className="text-label-sm text-on-surface-variant dark:text-slate-400">{new Date(blog.createdAt).toLocaleDateString()} • 5 min read</div>
                        </div>
                    </div>
                    <figure className="mb-lg">
                        <img className="w-full h-[400px] object-cover rounded-xl shadow-lg" src={`https://picsum.photos/seed/post${blog.id}/1200/600`} alt={blog.title} />
                    </figure>
                    <div className="font-body-lg space-y-md leading-relaxed text-on-surface-variant dark:text-slate-300 whitespace-pre-wrap">
                        {blog.content}
                    </div>
                    <div className="mt-xl flex justify-between py-sm border-y border-outline-variant dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <div className="flex gap-sm">
                            <button className="flex items-center gap-2 hover:text-primary dark:hover:text-indigo-400"><span className="material-symbols-outlined">favorite</span> 0</button>
                            <button className="flex items-center gap-2 hover:text-primary dark:hover:text-indigo-400"><span className="material-symbols-outlined">chat_bubble</span> 0</button>
                        </div>
                        <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"><span className="material-symbols-outlined">share</span> Share</button>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPostPage;
