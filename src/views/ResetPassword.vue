<template>
    <div class="min-h-screen flex items-center justify-center bg-[#f6f7f8]">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">Tạo mật khẩu mới</h2>

            <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{{ error }}</div>
            <div v-if="successMsg" class="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">{{ successMsg }}</div>

            <form v-if="!successMsg" @submit.prevent="handleReset" class="space-y-4">
                <input v-model="password" type="password" placeholder="Mật khẩu mới" required
                    class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[#308ce8]" />
                <input v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu mới" required
                    class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[#308ce8]" />
                <button type="submit"
                    class="w-full bg-[#308ce8] text-white py-2 rounded-xl hover:bg-blue-600 transition">
                    Xác nhận đổi mật khẩu
                </button>
            </form>
            <div v-else class="mt-4 text-center">
                <router-link to="/login" class="px-4 py-2 bg-[#308ce8] text-white rounded-xl inline-block">Đăng nhập
                    ngay</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const successMsg = ref('');

const handleReset = async () => {
    if (password.value !== confirmPassword.value) {
        error.value = 'Mật khẩu xác nhận không khớp!';
        return;
    }
    error.value = '';
    try {
        const res = await axios.post('http://localhost:8081/api/auth/reset-password', {
            token: route.query.token,
            newPassword: password.value
        });
        successMsg.value = res.data;
    } catch (err) {
        error.value = err.response?.data || 'Link hết hạn hoặc không hợp lệ!';
    }
};
</script>