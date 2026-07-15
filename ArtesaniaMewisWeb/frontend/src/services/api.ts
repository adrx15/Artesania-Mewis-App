/// <reference types="vite/client" />
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://artesania-mewis-app-2.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    getAll: (category?: string) =>
        api.get(`/api/products${category ? `?category=${category}` : ''}`),

    getById: (id: string) =>
        api.get(`/api/products/${id}`),

    search: (query: string) =>
        api.get(`/api/products/search?query=${query}`),

    getMostViewed: () =>
        api.get('/api/products/analytics/most-viewed'),

    create: (data: any) =>
        api.post('/api/products', data),

    update: (id: string, data: any) =>
        api.put(`/api/products/${id}`, data),

    delete: (id: string) =>
        api.delete(`/api/products/${id}`),
};

export const suggestionService = {
    create: (data:any) =>
        api.post('/api/suggestions', data),

    getAll: () =>
        api.get('/api/suggestions'),

    markAsRead: (id: string) =>
        api.patch(`/api/suggestions/${id}/read`),
};



export default api;