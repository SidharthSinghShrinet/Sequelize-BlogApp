import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { BlogApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useBlog, getBlogImageUrl, calculateReadingTime } from '../hooks/useBlogs';
import CommentSection from '../components/CommentSection';
import LikedUsersModal from '../components/LikedUsersModal';
import ShareModal from '../components/ShareModal';
import toast from 'react-hot-toast';

const BlogPostPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isBlogBookmarked, toggleBlogBookmark } = useAuth();
    
    const [progress, setProgress] = useState(0);
    const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { blog, loading, error, likesCount, isLiked, toggleLike } = useBlog(id);

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

    const handleShareClick = async () => {
        const shareUrl = window.location.href;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: `Check out "${blog.title}" on ShowOff!`,
                    url: shareUrl,
                });
                return;
            } catch (err: any) {
                if (err.name === 'AbortError') return;
            }
        }
        setIsShareModalOpen(true);
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
                        <div className="flex items-center gap-4">
                            {user && (
                                <button 
                                    onClick={() => toggleBlogBookmark(blog.id)}
                                    className="text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 transition-colors font-label-md flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {isBlogBookmarked(blog.id) ? 'bookmark' : 'bookmark_border'}
                                    </span>
                                    {isBlogBookmarked(blog.id) ? 'Saved' : 'Save'}
                                </button>
                            )}
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
                    </div>
                    <h1 className="font-headline-xl text-on-surface dark:text-white mb-md">{blog.title}</h1>
                    <div className="flex items-center gap-sm mb-lg border-y border-outline-variant dark:border-slate-800 py-md">
                        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center text-lg font-bold">
                            {blog.authorDetails?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-label-md font-semibold text-slate-800 dark:text-slate-200">{blog.authorDetails?.username}</div>
                            <div className="text-label-sm text-on-surface-variant dark:text-slate-400">{new Date(blog.createdAt).toLocaleDateString()} • {calculateReadingTime(blog.content)} min read</div>
                        </div>
                    </div>
                    <figure className="mb-lg">
                        <img className="w-full h-52 sm:h-80 md:h-[420px] object-cover rounded-xl shadow-lg" src={getBlogImageUrl(blog.content, blog.title, blog.id, blog.thumbnail)} alt={blog.title} />
                    </figure>
                    <div 
                        className="font-body-lg text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none leading-relaxed font-normal"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    
                    {/* Action buttons (Likes & Comments & Share) */}
                    <div className="mt-xl flex flex-wrap items-center justify-between py-sm border-y border-outline-variant dark:border-slate-800 text-slate-600 dark:text-slate-400 gap-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-1">
                                <button 
                                    onClick={() => {
                                        if (!user) {
                                            toast.error("Please login to like this blog post");
                                            return;
                                        }
                                        toggleLike();
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                                        isLiked 
                                            ? 'bg-rose-500 text-white font-bold shadow-sm' 
                                            : 'text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400'
                                    }`}
                                    title={isLiked ? "Unlike post" : "Like post"}
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${isLiked ? 'fill-1' : ''}`}>
                                        favorite
                                    </span>
                                    <span className="text-xs font-semibold">{isLiked ? 'Liked' : 'Like'}</span>
                                </button>

                                <button
                                    onClick={() => setIsLikedModalOpen(true)}
                                    className="px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:underline transition-colors flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 ml-1"
                                    title="View list of people who liked this post"
                                >
                                    <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleShareClick}
                                className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-primary dark:hover:text-indigo-400 transition-colors text-xs font-semibold"
                                title="Share article"
                            >
                                <span className="material-symbols-outlined text-[18px]">share</span> Share
                            </button>
                        </div>
                    </div>
                    
                    <CommentSection targetType="blog" targetId={blog.id} authorId={blog.author} />
                </article>

                {/* Liked Users Modal */}
                <LikedUsersModal 
                    blogId={blog.id} 
                    isOpen={isLikedModalOpen} 
                    onClose={() => setIsLikedModalOpen(false)} 
                />

                {/* Article Share Modal */}
                <ShareModal
                    title={blog.title}
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                />
            </main>
            <Footer />
        </div>
    );
};

export default BlogPostPage;
