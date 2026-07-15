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
    getAll: (category?: string) => api.get(`/products${category ? `?category=${category}` : ''}`),
    getById: (id: string) => api.get(`/products/${id}`),
    search: (query: string) => api.get(`/products/search?query=${query}`),
    getMostViewed: () => api.get('/products/analytics/most-viewed'),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data), // <-- AGREGADO PARA EL UPDATE
    delete: (id: string) => api.delete(`/products/${id}`),               // <-- AGREGADO PARA EL DELETE
};

export const suggestionService = {
    create: (data: { clientName: string; email: string; message: string }) => api.post('/suggestions', data),
    getAll: () => api.get('/suggestions'),
    markAsRead: (id: string) => api.patch(`/suggestions/${id}/read`),
};

export default api;