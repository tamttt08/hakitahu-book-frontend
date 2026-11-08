import axios from 'axios';

const API_URL = 'http://localhost:8081/api/categories'; // Cậu chỉnh lại port nếu Backend chạy port khác nhé

// Lấy token từ localStorage để chứng minh quyền Admin
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const CategoryService = {
    // R - Đọc danh sách
    getAllCategories() {
        return axios.get(API_URL); 
    },
    // C - Thêm mới
    createCategory(data) {
        return axios.post(API_URL, data, getAuthHeader());
    },
    // U - Cập nhật
    updateCategory(id, data) {
        return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    },
    // D - Xóa
    deleteCategory(id) {
        return axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }
};