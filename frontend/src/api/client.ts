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
    register: (data: any) => apiClient.post('/users/register', data),
    login: (data: any) => apiClient.post('/users/login', data),
    logout: () => apiClient.get('/users/logout'),
    getMe: () => apiClient.get('/users/me'),
    updateProfile: (data: any) => apiClient.put('/users/update', data),
    deleteAccount: () => apiClient.delete('/users/delete'),
};

export const BlogApi = {
    createBlog: (data: any) => apiClient.post('/blogs/create-blog', data),
    getAllBlogs: () => apiClient.get('/blogs/get-all-blogs'),
    getUserBlogs: () => apiClient.get('/blogs/get-user-blogs'),
    getBlogById: (id: string | number) => apiClient.get(`/blogs/blog/${id}`),
    updateBlog: (id: string | number, data: any) => apiClient.put(`/blogs/update-blog/${id}`, data),
    deleteBlog: (id: string | number) => apiClient.delete(`/blogs/delete-blog/${id}`),
    deleteAllBlogs: () => apiClient.delete('/blogs/delete-all'),
    getDeletedBlogs: () => apiClient.get('/blogs/deleted-blogs'),
};
