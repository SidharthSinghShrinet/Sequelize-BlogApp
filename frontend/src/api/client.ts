import axios, { AxiosError } from 'axios';

export const API_BASE_URL = 'http://localhost:9000/api/v1';

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

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
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

