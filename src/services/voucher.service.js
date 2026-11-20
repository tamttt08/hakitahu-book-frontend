import axios from 'axios';

const API_URL = 'http://localhost:8081/api/vouchers';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const VoucherService = {
    getAllVouchers() {
        return axios.get(API_URL, getAuthHeader());
    },
    getActiveVouchers() {
        return axios.get(`${API_URL}/active`);
    },
    createVoucher(data) {
        return axios.post(API_URL, data, getAuthHeader());
    },
    updateVoucher(id, data) {
        return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    },
    deleteVoucher(id) {
        return axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }
};