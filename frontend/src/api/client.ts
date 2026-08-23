import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const getApiBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    if (envUrl) {
        return envUrl;
    }
    if (typeof window !== 'undefined') {
        const isHttps = window.location.protocol === 'https:';
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
            return `http://${host}:9000/api/v1`;
        }
        // Fallback for production deployment
        return isHttps ? `https://api.showoff4u.in/api/v1` : `http://${host}:9000/api/v1`;
    }
    return 'https://api.showoff4u.in/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
    status: number;
    data?: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
    _retryCount?: number;
    retry?: boolean;
}

const MAX_RETRIES = 3;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError) => {
        const config = error.config as CustomAxiosConfig | undefined;
        let status = 500;
        let message = 'An error occurred';
        let data: any = null;

        if (error.response) {
            status = error.response.status;
            data = error.response.data;
            message = (data as any)?.message || error.message;

            if (status === 401) {
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        } else if (error.request) {
            message = 'No response from server';
        } else {
            message = error.message;
        }

        // Retry logic for transient network errors, TLS handshakes, or 502/503/504 gateway glitches
        const isTransientError = !error.response || [502, 503, 504].includes(status);
        const isSafeOrExplicitRetry = config && (config.method?.toLowerCase() === 'get' || config.retry === true);

        if (config && isTransientError && isSafeOrExplicitRetry) {
            config._retryCount = (config._retryCount || 0) + 1;

            if (config._retryCount <= MAX_RETRIES) {
                const backoffMs = Math.min(1000 * Math.pow(2, config._retryCount - 1) + Math.random() * 250, 4000);
                console.warn(`[Axios Interceptor] Request to ${config.url} failed (${error.code || error.message}). Attempt ${config._retryCount}/${MAX_RETRIES}. Retrying in ${Math.round(backoffMs)}ms...`);
                
                toast.loading(`Connection issue detected. Retrying request (${config._retryCount}/${MAX_RETRIES})...`, {
                    id: `retry-${config.url || 'req'}`,
                    duration: backoffMs + 800,
                });

                await new Promise((resolve) => setTimeout(resolve, backoffMs));
                return apiClient(config);
            }
        }

        throw new ApiError(status, message, data);
    }
);

export const UserApi = {
    register: (data: any) => {
        if (data instanceof FormData) {
            return apiClient.post('/users/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        return apiClient.post('/users/register', data);
    },
    login: (data: any) => apiClient.post('/users/login', data),
    logout: () => apiClient.get('/users/logout'),
    getMe: () => apiClient.get('/users/me'),
    updateProfile: (data: any) => {
        if (data instanceof FormData) {
            return apiClient.put('/users/update', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        return apiClient.put('/users/update', data);
    },
    deleteAccount: () => apiClient.delete('/users/delete'),
    getPublicProfile: (username: string) => apiClient.get(`/users/profile/${username}`),
    forgotPassword: (email: string) => apiClient.post('/users/forgot-password', { email }),
    resetPassword: (data: any) => apiClient.post('/users/reset-password', data),
};

export const BlogApi = {
    upload: (formdata: FormData) => apiClient.post('/blogs/upload', formdata, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    createBlog: (data: any) => apiClient.post('/blogs/create-blog', data),
    getAllBlogs: (params?: any) => apiClient.get('/blogs/get-all-blogs', { params }),
    getUserBlogs: () => apiClient.get('/blogs/get-user-blogs'),
    getBlogById: (id: string | number) => apiClient.get(`/blogs/blog/${id}`),
    updateBlog: (id: string | number, data: any) => apiClient.put(`/blogs/update-blog/${id}`, data),
    deleteBlog: (id: string | number) => apiClient.delete(`/blogs/delete-blog/${id}`),
    deleteAllBlogs: () => apiClient.delete('/blogs/delete-all'),
    getDeletedBlogs: () => apiClient.get('/blogs/deleted-blogs'),
    testAiPrompt: (data: { title: string }) => apiClient.post('/blogs/test-ai-prompt', data),
    getAnalytics: () => apiClient.get('/blogs/analytics'),
    getCategoryCounts: () => apiClient.get('/blogs/category-counts'),
    toggleLike: (id: string | number) => apiClient.post(`/blogs/${id}/like`),
    getLikes: (id: string | number) => apiClient.get(`/blogs/${id}/likes`),
};

export const ProjectApi = {
    createProject: (data: FormData) => apiClient.post('/projects', data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    getAllProjects: () => apiClient.get('/projects'),
    getUserProjects: () => apiClient.get('/projects/user'),
    getProjectById: (id: string | number) => apiClient.get(`/projects/${id}`),
    updateProject: (id: string | number, data: FormData) => apiClient.put(`/projects/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    deleteProject: (id: string | number) => apiClient.delete(`/projects/${id}`),
    fetchGithubReadme: (githubUrl: string) => apiClient.get('/projects/github-readme', {
        params: { githubUrl }
    }),
};

export const BookmarkApi = {
    toggleBookmark: (data: { blogId?: number; projectId?: number }) => apiClient.post('/bookmarks/toggle', data),
    getBookmarks: () => apiClient.get('/bookmarks'),
};

export const CommentApi = {
    createComment: (data: { content: string; blogId?: number; projectId?: number; parentId?: number }) =>
        apiClient.post('/comments', data),
    getBlogComments: (blogId: string | number) => apiClient.get(`/comments/blog/${blogId}`),
    getProjectComments: (projectId: string | number) => apiClient.get(`/comments/project/${projectId}`),
    deleteComment: (id: number) => apiClient.delete(`/comments/${id}`),
};

