<template>
    <!-- 1. Thẻ div ngoài cùng: Phóng to full width, thêm thuộc tính chèn ảnh -->
    <div class="w-full min-h-[80vh] py-16 flex items-center justify-center bg-[#f6f7f8] bg-cover bg-center bg-no-repeat"
        style="background-image: url('/src/assets/images/background-login.jpg');">

        <!-- 2. Khối form trắng của cậu giữ nguyên bên trong -->
        <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10">
            <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">Quên mật khẩu</h2>
            <p class="text-sm text-center text-gray-500 mb-6">Nhập email của bạn để nhận link khôi phục</p>

            <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{{ error }}</div>
            <div v-if="successMsg" class="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">{{ successMsg }}</div>

            <form @submit.prevent="handleForgot" class="space-y-4">
                <input v-model="email" type="email" placeholder="Nhập địa chỉ email" required
                    class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-[#308ce8]" />
                <button type="submit" :disabled="isLoading"
                    class="w-full bg-[#308ce8] text-white py-2 rounded-xl hover:bg-blue-600 transition disabled:opacity-50">
                    {{ isLoading ? 'Đang gửi...' : 'Gửi link khôi phục' }}
                </button>
            </form>
            <div class="mt-4 text-center">
                <router-link to="/login" class="text-sm text-[#308ce8] hover:underline">Quay lại đăng nhập</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const error = ref('');
const successMsg = ref('');
const isLoading = ref(false);

const handleForgot = async () => {
    error.value = ''; successMsg.value = ''; isLoading.value = true;
    try {
        const res = await axios.post('http://localhost:8081/api/auth/forgot-password', { email: email.value });
        successMsg.value = res.data;
    } catch (err) {
        error.value = err.response?.data || 'Có lỗi xảy ra!';
    } finally {
        isLoading.value = false;
    }
};
</script>