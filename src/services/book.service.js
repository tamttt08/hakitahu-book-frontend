import axios from 'axios';

const API_URL = 'http://localhost:8081/api/books';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const BookService = {
    getAllBooks() {
        return axios.get(API_URL);
    },
    getBookById(id) {
        return axios.get(`${API_URL}/${id}`);
    },
    createBook(data) {
        return axios.post(API_URL, data, getAuthHeader());
    },
    updateBook(id, data) {
        return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    },
    deleteBook(id) {
        return axios.delete(`${API_URL}/${id}`, getAuthHeader());
    },
    uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('token');
        return axios.post('http://localhost:8081/api/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};