import api from './api';

export const AuthService = {
    async login(data) {
        const response = await api.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    async register(data) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    async verifyEmail(token) {
        const response = await api.get(`/auth/verify?token=${token}`);
        return response.data;
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};