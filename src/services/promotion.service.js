import axios from 'axios';

const API_URL = 'http://localhost:8081/api/promotions';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const PromotionService = {
    getAllPromotions() {
        return axios.get(API_URL, getAuthHeader());
    },
    getActivePromotions() {
        return axios.get(`${API_URL}/active`);
    },
    createPromotion(data) {
        return axios.post(API_URL, data, getAuthHeader());
    },
    updatePromotion(id, data) {
        return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    },
    deletePromotion(id) {
        return axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }
};