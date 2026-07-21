import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBlogImageUrl } from '../hooks/useBlogs';
import ShareModal from './ShareModal';

interface BlogCardProps {
    post: {
        id: number;
        title: string;
        content: string;
        thumbnail?: string;
        createdAt: string;
        category?: string;
        likesCount?: number;
        authorDetails?: {
            id: number;
            username: string;
            email?: string;
        };
    };
    isOwnerCard?: boolean;
    onDelete?: () => void;
    layout?: 'grid' | 'list';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, isOwnerCard = false, onDelete, layout = 'grid' }) => {
    const { user, isBlogBookmarked, toggleBlogBookmark } = useAuth();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const navigate = useNavigate();

    const username = post.authorDetails?.username || 'Developer';
    const authorInitial = username.charAt(0).toUpperCase();
    const formattedDate = new Date(post.createdAt).toLocaleDateString();
    const authorId = post.authorDetails?.id;
    
    // Strip HTML tags for clean description excerpt
    const plainTextContent = post.content.replace(/<[^>]*>?/gm, '');
    const excerpt = plainTextContent.substring(0, 150) + (plainTextContent.length > 150 ? '...' : '');

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const postAuthorUsername = post.authorDetails?.username;
        if (!postAuthorUsername) return;

        if (user && user.username === postAuthorUsername) {
            navigate('/library');
        } else {
            navigate(`/user/${postAuthorUsername}`);
        }
    };

    if (layout === 'list') {
        return (
            <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-indigo-500/30 hover:translate-x-1.5 transition-all duration-300 flex flex-col sm:flex-row p-4 gap-5 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-5 items-center w-full min-w-0">
                    {/* Thumbnail Cover image */}
                    <div className="h-28 w-full sm:w-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 relative border border-slate-50 dark:border-slate-800/50">
                        <img 
                            src={getBlogImageUrl(post.content, post.title, post.id, post.thumbnail)} 
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                            alt={post.title} 
                        />
                        {post.category && (
                            <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur-sm text-[8px] font-bold px-1.5 py-0.5 rounded text-white uppercase tracking-wider font-mono">
                                {post.category}
                            </div>
                        )}
                        {/* Bookmark Overlay Button */}
                        {user && !isOwnerCard && (
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleBlogBookmark(post.id);
                                }}
                                className={`absolute top-2 right-2 p-1.5 rounded-full border shadow-sm flex items-center justify-center transition-all duration-200 z-10 hover:scale-105 ${
                                    isBlogBookmarked(post.id)
                                        ? 'bg-purple-600 border-purple-600 text-white dark:bg-purple-600 dark:border-purple-600'
                                        : 'bg-white border-slate-100 text-slate-500 hover:text-purple-600 hover:border-purple-200/50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-indigo-400'
                                }`}
                                title={isBlogBookmarked(post.id) ? "Remove Bookmark" : "Save for Later"}
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {isBlogBookmarked(post.id) ? 'bookmark' : 'bookmark_border'}
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Text content details */}
                    <div className="flex flex-col gap-2 flex-grow min-w-0 text-left w-full sm:w-auto">
                        <div 
                            onClick={handleAuthorClick}
                            className="flex items-center gap-2 cursor-pointer hover:text-primary dark:hover:text-indigo-400 group/author inline-flex self-start"
                        >
                            <div className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold group-hover/author:brightness-105">
                                {authorInitial}
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-450 transition-colors">
                                Posted by <span className="font-semibold text-slate-750 dark:text-slate-350 group-hover/author:underline">{username}</span> • {formattedDate}
                            </span>
                        </div>
                        
                        <Link to={`/post/${post.id}`}>
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors line-clamp-1 leading-snug">
                                {post.title}
                            </h4>
                        </Link>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {excerpt}
                        </p>
                    </div>
                </div>

                {/* Actions container */}
                {isOwnerCard && (
                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                        <Link 
                            to={`/edit/${post.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-[10px] font-bold py-1.5 px-3 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center gap-1 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <span className="material-symbols-outlined text-xs">edit</span>
                            Edit
                        </Link>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onDelete) onDelete();
                            }}
                            className="text-rose-500 hover:text-rose-600 transition-colors text-[10px] font-bold py-1.5 px-3 border border-rose-100/50 dark:border-rose-950/20 rounded-xl flex items-center gap-1 hover:bg-rose-50/10 bg-rose-50/5 dark:bg-rose-950/5"
                        >
                            <span className="material-symbols-outlined text-xs">delete</span>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <Link 
                to={`/post/${post.id}`} 
                className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl overflow-hidden border border-outline-variant/30 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 transition-all group flex flex-col h-full"
            >
                <div className="h-48 overflow-hidden relative shrink-0 bg-slate-100 dark:bg-slate-950">
                    <img 
                        src={getBlogImageUrl(post.content, post.title, post.id, post.thumbnail)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={post.title} 
                    />
                    
                    {/* Article indicator */}
                    <div className="absolute top-sm left-sm px-2 py-1 bg-surface/80 dark:bg-slate-950/80 backdrop-blur-md rounded font-label-sm text-primary">
                        Article
                    </div>

                    {/* Bookmark Overlay Button */}
                    {user && !isOwnerCard && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleBlogBookmark(post.id);
                            }}
                            className={`absolute top-sm right-sm p-1.5 rounded-full border shadow-sm flex items-center justify-center transition-all duration-200 z-10 hover:scale-105 ${
                                isBlogBookmarked(post.id)
                                    ? 'bg-purple-600 border-purple-600 text-white dark:bg-purple-600 dark:border-purple-600'
                                    : 'bg-white border-slate-100 text-slate-500 hover:text-purple-600 hover:border-purple-200/50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-indigo-400'
                            }`}
                            title={isBlogBookmarked(post.id) ? "Remove Bookmark" : "Save for Later"}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {isBlogBookmarked(post.id) ? 'bookmark' : 'bookmark_border'}
                            </span>
                        </button>
                    )}

                    {/* Category tag */}
                    {post.category && (
                        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/60 backdrop-blur-sm text-[9px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider font-mono">
                            {post.category}
                        </div>
                    )}
                </div>

                <div className="p-sm flex flex-col flex-grow justify-between gap-sm">
                    <div className="flex flex-col gap-sm">
                        <div 
                            onClick={handleAuthorClick}
                            className="flex items-center gap-2 cursor-pointer hover:text-primary dark:hover:text-indigo-400 group/author inline-flex self-start"
                        >
                            <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold group-hover/author:brightness-105">
                                {authorInitial}
                            </div>
                            <span className="text-label-sm text-on-surface-variant dark:text-slate-400 transition-colors">
                                <span className="group-hover/author:underline font-semibold">{username}</span> • {formattedDate}
                            </span>
                        </div>
                        
                        <h2 className="font-headline-md text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                        </h2>
                        
                        <p className="font-body-md text-on-surface-variant dark:text-slate-400 line-clamp-3 leading-relaxed">
                            {excerpt}
                        </p>
                    </div>

                    {isOwnerCard && (
                        <div className="flex items-center gap-2 border-t border-slate-100/85 dark:border-slate-800/50 pt-3 mt-1 justify-end">
                            <Link 
                                to={`/edit/${post.id}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-[10px] font-bold py-1 px-2.5 border border-slate-200/50 dark:border-slate-800 rounded-lg flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-xs">edit</span>
                                Edit
                            </Link>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onDelete) onDelete();
                                }}
                                className="text-rose-500 hover:text-rose-600 transition-colors text-[10px] font-bold py-1 px-2.5 border border-rose-100/50 dark:border-rose-950/20 rounded-lg flex items-center gap-1 hover:bg-rose-50/10"
                            >
                                <span className="material-symbols-outlined text-xs">delete</span>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </Link>

            <ShareModal
                title={post.title}
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`}
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />
        </>
    );
};

export default BlogCard;
