<template>
    <div class="min-h-screen flex items-center justify-center bg-[#f6f7f8]">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">Đăng nhập BookO</h2>

            <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">{{ error }}</div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <input v-model="formData.username" type="text" placeholder="Tên đăng nhập" required
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
                <input v-model="formData.password" type="password" placeholder="Mật khẩu" required
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
                <button type="submit"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Đăng nhập</button>
            </form>

            <div class="mt-4 flex items-center justify-between">
                <span class="border-b w-1/5 lg:w-1/4"></span>
                <span class="text-xs text-center text-gray-500 uppercase">Hoặc đăng nhập bằng</span>
                <span class="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <button @click="handleGoogleLogin"
                class="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition flex items-center justify-center gap-2">
                Google
            </button>

            <p class="mt-4 text-center text-sm text-gray-600">
                Chưa có tài khoản? <router-link to="/register" class="text-blue-600 hover:underline">Đăng ký
                    ngay</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../services/auth.service';

const router = useRouter();
const formData = reactive({ username: '', password: '' });
const error = ref('');

const handleSubmit = async () => {
    error.value = '';
    try {
        const response = await AuthService.login(formData);
        
        // 1. Lưu thông tin xác thực vào bộ nhớ cục bộ
        // (Lưu ý: điều chỉnh response.data.token tùy thuộc vào cấu trúc JSON backend trả về)
        localStorage.setItem('token', response.data?.token || response.token);
        localStorage.setItem('user', JSON.stringify(response.data?.user || response.user));

        // 2. Dùng window.location.href thay vì router.push('/') để Header re-render và nhận diện localStorage
        window.location.href = '/';
    } catch (err) {
        error.value = err.response?.data || 'Sai thông tin đăng nhập!';
    }
};

const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
};
</script>