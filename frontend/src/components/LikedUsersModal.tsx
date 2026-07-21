import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogApi } from '../api/client';
import toast from 'react-hot-toast';

interface UserDetail {
    id: number;
    username: string;
    email?: string;
    profileImage?: string;
}

interface LikedUsersModalProps {
    blogId: number | string;
    isOpen: boolean;
    onClose: () => void;
}

const LikedUsersModal: React.FC<LikedUsersModalProps> = ({ blogId, isOpen, onClose }) => {
    const [users, setUsers] = useState<UserDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isOpen || !blogId) return;

        const fetchLikedUsers = async () => {
            setLoading(true);
            try {
                const response: any = await BlogApi.getLikes(blogId);
                if (response.success && response.data?.likedUsers) {
                    setUsers(response.data.likedUsers);
                } else {
                    setUsers([]);
                }
            } catch (err: any) {
                console.error("Failed to fetch liked users:", err);
                toast.error("Failed to load liked users.");
            } finally {
                setLoading(false);
            }
        };

        fetchLikedUsers();
    }, [blogId, isOpen]);

    // Handle escape key press to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-all scale-100 flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-500 fill-1">favorite</span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Liked by {users.length > 0 ? `(${users.length})` : ''}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Content List */}
                <div className="p-4 overflow-y-auto flex-grow divide-y divide-slate-100 dark:divide-slate-800/60">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-slate-500 font-medium">Loading likes...</span>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-[24px]">favorite_border</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No likes yet</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Be the first developer to like this blog post!</p>
                        </div>
                    ) : (
                        users.map((u) => (
                            <div key={u.id} className="py-3 flex items-center justify-between first:pt-1 last:pb-1">
                                <Link 
                                    to={`/user/${u.username}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 group/user flex-grow min-w-0"
                                >
                                    {u.profileImage ? (
                                        <img 
                                            src={u.profileImage} 
                                            alt={u.username} 
                                            className="w-10 h-10 rounded-full object-cover shadow-sm group-hover/user:scale-105 transition-transform shrink-0" 
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover/user:scale-105 transition-transform shrink-0">
                                            {u.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover/user:text-primary dark:group-hover/user:text-indigo-400 transition-colors truncate">
                                            {u.username}
                                        </span>
                                        {u.email && (
                                            <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                                {u.email}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <Link
                                    to={`/user/${u.username}`}
                                    onClick={onClose}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors shrink-0"
                                >
                                    View Profile
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LikedUsersModal;
