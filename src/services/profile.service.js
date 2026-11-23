import axios from 'axios';

const API_URL = 'http://localhost:8081/api/profile';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const ProfileService = {
    getMyProfile() {
        return axios.get(API_URL, getAuthHeader());
    },
    updateMyProfile(data) {
        return axios.put(API_URL, data, getAuthHeader());
    }
};