import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { UserApi, BookmarkApi } from '../api/client';
import toast from 'react-hot-toast';

interface User {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    profileImage?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedUser: User) => void;
    bookmarkedBlogIds: Set<number>;
    bookmarkedProjectIds: Set<number>;
    isBlogBookmarked: (id: number) => boolean;
    isProjectBookmarked: (id: number) => boolean;
    toggleBlogBookmark: (id: number) => Promise<void>;
    toggleProjectBookmark: (id: number) => Promise<void>;
    refreshBookmarks: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookmarkedBlogIds, setBookmarkedBlogIds] = useState<Set<number>>(new Set());
    const [bookmarkedProjectIds, setBookmarkedProjectIds] = useState<Set<number>>(new Set());

    const fetchBookmarks = async () => {
        try {
            const response: any = await BookmarkApi.getBookmarks();
            const blogsList = response.data.blogs || [];
            const projectsList = response.data.projects || [];
            setBookmarkedBlogIds(new Set(blogsList.map((b: any) => b.id)));
            setBookmarkedProjectIds(new Set(projectsList.map((p: any) => p.id)));
        } catch (error) {
            console.error("Failed to fetch bookmarks:", error);
        }
    };

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response: any = await UserApi.getMe();
                setUser(response.data);
                if (response.data) {
                    await fetchBookmarks();
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
            setBookmarkedBlogIds(new Set());
            setBookmarkedProjectIds(new Set());
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = async (data: any) => {
        await UserApi.login(data);
        const response: any = await UserApi.getMe();
        setUser(response.data);
        if (response.data) {
            await fetchBookmarks();
        }
    };

    const register = async (data: any) => {
        await UserApi.register(data);
    };

    const logout = async () => {
        try {
            await UserApi.logout();
        } finally {
            setUser(null);
            setBookmarkedBlogIds(new Set());
            setBookmarkedProjectIds(new Set());
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const isBlogBookmarked = (id: number) => bookmarkedBlogIds.has(id);
    const isProjectBookmarked = (id: number) => bookmarkedProjectIds.has(id);

    const toggleBlogBookmark = async (id: number) => {
        try {
            const response: any = await BookmarkApi.toggleBookmark({ blogId: id });
            const newSet = new Set(bookmarkedBlogIds);
            if (response.data.bookmarked) {
                newSet.add(id);
                toast.success("Saved to bookmarks!");
            } else {
                newSet.delete(id);
                toast.success("Removed from bookmarks!");
            }
            setBookmarkedBlogIds(newSet);
        } catch (error) {
            toast.error("Failed to toggle bookmark.");
        }
    };

    const toggleProjectBookmark = async (id: number) => {
        try {
            const response: any = await BookmarkApi.toggleBookmark({ projectId: id });
            const newSet = new Set(bookmarkedProjectIds);
            if (response.data.bookmarked) {
                newSet.add(id);
                toast.success("Saved to bookmarks!");
            } else {
                newSet.delete(id);
                toast.success("Removed from bookmarks!");
            }
            setBookmarkedProjectIds(newSet);
        } catch (error) {
            toast.error("Failed to toggle bookmark.");
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            bookmarkedBlogIds,
            bookmarkedProjectIds,
            isBlogBookmarked,
            isProjectBookmarked,
            toggleBlogBookmark,
            toggleProjectBookmark,
            refreshBookmarks: fetchBookmarks
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
