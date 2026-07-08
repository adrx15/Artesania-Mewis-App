import axios from 'axios';

// Asegúrate de que NO tenga una barra '/' al final de la ruta base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    // CAMBIO AQUÍ: Asegúrate de que sea '/products' y no '/products/'
    getAll: (category?: string) => api.get(`/products${category ? `?category=${category}` : ''}`),
    getById: (id: string) => api.get(`/products/${id}`),
    search: (query: string) => api.get(`/products/search?query=${query}`),
    getMostViewed: () => api.get('/products/analytics/most-viewed'),
};

export const suggestionService = {
    create: (data: { clientName: string; email: string; message: string }) => api.post('/suggestions', data),
    getAll: () => api.get('/suggestions'),
    markAsRead: (id: string) => api.patch(`/suggestions/${id}/read`),
};

export default api;