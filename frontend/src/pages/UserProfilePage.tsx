import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserApi, BlogApi } from '../api/client';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<any>(null);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    useEffect(() => {
        const fetchProfileAndBlogs = async () => {
            if (!username) return;
            setLoadingProfile(true);
            setLoadingBlogs(true);
            try {
                // Fetch public profile details
                const profileRes: any = await UserApi.getPublicProfile(username);
                const userProfile = profileRes.data;
                setProfile(userProfile);
                setLoadingProfile(false);

                // Fetch public blogs published by this user using the resolved user ID
                const blogsRes: any = await BlogApi.getAllBlogs({ authorId: userProfile.id, all: true });
                setBlogs(blogsRes.data || []);
            } catch (error: any) {
                console.error(error);
                toast.error("Failed to load user profile or publications.");
            } finally {
                setLoadingProfile(false);
                setLoadingBlogs(false);
            }
        };

        fetchProfileAndBlogs();
    }, [username]);

    if (loadingProfile) {
        return (
            <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 transition-colors duration-300">
                <TopNavBar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 transition-colors duration-300">
                <TopNavBar />
                <main className="flex-grow flex flex-col items-center justify-center py-20 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-350 dark:text-slate-600 mb-2">person_off</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">User Not Found</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">This profile may have been deactivated or does not exist.</p>
                    <Link to="/blogs" className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md">
                        Back to Explore
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const displayName = profile.username || 'Developer';
    const initial = displayName.charAt(0).toUpperCase();
    const joinedDate = new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 transition-colors duration-300">
            <TopNavBar />

            <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-12">
                <div className="max-w-6xl mx-auto flex flex-col gap-10">
                    
                    {/* Public Profile Card Header */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        {/* Big Avatar */}
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center font-extrabold text-4xl text-primary uppercase select-none shadow-sm shrink-0">
                            {profile.profileImage ? (
                                <img src={profile.profileImage} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                initial
                            )}
                        </div>
                        
                        {/* Identity & Basic Info */}
                        <div className="flex-grow flex flex-col justify-center min-w-0">
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{displayName}</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase font-bold tracking-wider font-mono">ShowOff Creator</p>
                            
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-slate-500 dark:text-slate-400 justify-center sm:justify-start">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">mail</span>
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">calendar_today</span>
                                    <span>Joined on {joinedDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">article</span>
                                    <span>{blogs.length} publications</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Respective Blogs section */}
                    <div className="flex flex-col gap-6">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Publications</h3>
                            <p className="text-xs text-slate-550 dark:text-slate-450 mt-0.5">Explore articles shared by {displayName}.</p>
                        </div>

                        {loadingBlogs ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                                <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-700 mb-3">article</span>
                                <h4 className="text-base font-bold text-slate-850 dark:text-slate-300 mb-1">No publications yet</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-550 max-w-xs">This author has not published any blog posts yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog.id} post={blog} />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserProfilePage;
