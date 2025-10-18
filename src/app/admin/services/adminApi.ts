import axios from 'axios';
import { getAuthToken } from '@/app/admin/services/auth';

const API_BASE_URL = process.env.API;

// Attach Authorization header if token exists
axios.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = getAuthToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

// Admin API servisleri
export const adminApi = {
    // Blogs CRUD
    blogs: {
        getAll: () => axios.get(`${API_BASE_URL}/blogs`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/blogs/getById/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/blogs`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/blogs/update/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/blogs/${id}`),
    },

    // Projects CRUD
    projects: {
        getAll: () => axios.get(`${API_BASE_URL}/projects`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/projects/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/projects`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/projects/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/projects/${id}`),
    },

    // Education CRUD
    education: {
        getAll: () => axios.get(`${API_BASE_URL}/education`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/education/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/education`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/education/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/education/${id}`),
    },

    // Experience CRUD
    experience: {
        getAll: () => axios.get(`${API_BASE_URL}/experience`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/experience/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/experience`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/experience/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/experience/${id}`),
        updateDetails: (id: string, action: string, detail: string) =>
            axios.put(`${API_BASE_URL}/experience/${id}/details`, { action, detail }),
    },

    // Tech Stack CRUD
    techStack: {
        getAll: () => axios.get(`${API_BASE_URL}/techStack`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/techStack/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/techStack`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/techStack/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/techStack/${id}`),
    },

    // Social Links CRUD
    social: {
        getAll: () => axios.get(`${API_BASE_URL}/socials`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/socials/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/socials`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/socials/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/socials/${id}`),
    },

    // User Information CRUD
    userInfo: {
        getAll: () => axios.get(`${API_BASE_URL}/userInformation`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/userInformation/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/userInformation`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/userInformation/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/userInformation/${id}`),
    },

    // Users CRUD
    users: {
        getAll: () => axios.get(`${API_BASE_URL}/users`),
        getById: (id: string) => axios.get(`${API_BASE_URL}/users/${id}`),
        create: (data: any) => axios.post(`${API_BASE_URL}/users/register`, data),
        login: (data: { username: string; password: string }) =>
            axios.post(`${API_BASE_URL}/users/login`, data),
        update: (id: string, data: any) => axios.put(`${API_BASE_URL}/users/${id}`, data),
        delete: (id: string) => axios.delete(`${API_BASE_URL}/users/${id}`),
    },
};

// Utility functions
export const handleApiError = (error: any) => {
    if (error.response) {
        return error.response.data.message || error.response.data.error || 'API Error';
    } else if (error.request) {
        return 'Network Error - Please check your connection';
    } else {
        return 'An unexpected error occurred';
    }
};

export const showSuccessMessage = (message: string) => {
    // Bu fonksiyon toast notification için kullanılabilir
    console.log('Success:', message);
};

export const showErrorMessage = (message: string) => {
    // Bu fonksiyon toast notification için kullanılabilir
    console.error('Error:', message);
};
