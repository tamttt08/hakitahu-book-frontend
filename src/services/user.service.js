import axios from 'axios';

const API_URL = 'http://localhost:8081/api/users';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const UserService = {
    getAllUsers() {
        return axios.get(API_URL, getAuthHeader());
    },
    createUser(data) {
        return axios.post(API_URL, data, getAuthHeader());
    },
    updateUser(id, data) {
        return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    },
    deleteUser(id) {
        return axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }
};