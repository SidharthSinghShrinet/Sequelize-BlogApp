import { useState, useEffect } from 'react';
import { BlogApi } from '../api/client';
import toast from 'react-hot-toast';

export const useAllBlogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response: any = await BlogApi.getAllBlogs();
                const sorted = response.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBlogs(sorted);
            } catch (err) {
                toast.error("Failed to fetch blogs.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return { blogs, loading };
};

export const useBlog = (id: string | undefined) => {
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const response: any = await BlogApi.getBlogById(id);
                setBlog(response.data);
            } catch (err: any) {
                setError(err);
                toast.error("Failed to fetch blog.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    return { blog, loading, error };
};
