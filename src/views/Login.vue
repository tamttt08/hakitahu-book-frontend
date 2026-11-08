<template>
    <!-- 1. Thẻ div ngoài cùng: Phóng to full width, thêm thuộc tính chèn ảnh -->
    <div class="w-full min-h-[80vh] py-16 flex items-center justify-center bg-[#f6f7f8] bg-cover bg-center bg-no-repeat"
        style="background-image: url('/src/assets/images/background-login.jpg');">

        <!-- 2. Khối form trắng -->
        <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10">
            <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">Đăng nhập HAKITAHU BOOK</h2>

            <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">{{ error }}</div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <input v-model="formData.username" type="text" placeholder="Tên đăng nhập" required
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />

                <!-- Khu vực input mật khẩu đã được bọc lại để gắn icon -->
                <div class="relative w-full">
                    <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu"
                        required
                        class="w-full px-4 py-2 pr-10 border rounded focus:outline-none focus:border-blue-500 transition-colors" />

                    <!-- Nút con mắt -->
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors">
                        <EyeOff v-if="showPassword" class="w-5 h-5" />
                        <Eye v-else class="w-5 h-5" />
                    </button>
                </div>

                <!-- Link Quên mật khẩu -->
                <div class="flex justify-end mt-1 mb-2">
                    <router-link to="/forgot-password" class="text-sm text-blue-600 hover:underline">
                        Quên mật khẩu?
                    </router-link>
                </div>

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
        <!-- <div class="absolute inset-0 bg-black/30"></div> -->
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, EyeOff } from 'lucide-vue-next'; // Import icon con mắt
import { AuthService } from '../services/auth.service';

const router = useRouter();
const formData = reactive({ username: '', password: '' });
const error = ref('');
const showPassword = ref(false); // Biến kiểm soát ẩn/hiện mật khẩu

const handleSubmit = async () => {
    error.value = '';
    try {
        const response = await AuthService.login(formData);

        const token = response.data?.token || response.token;
        const user = response.data?.user || response.user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Kiểm tra Role để phân luồng trang web
        // Đưa về chữ thường (toLowerCase) để so sánh không bị lỗi hoa/thường
        const userRole = (user.role || 'user').toLowerCase(); 

        if (userRole === 'admin') {
            window.location.href = '/admin';
        } else if (userRole === 'shipper') {
            window.location.href = '/shipper';
        } else {
            window.location.href = '/'; // Khách hàng bình thường về Trang chủ BookO
        }
        
    } catch (err) {
        error.value = err.response?.data || 'Sai thông tin đăng nhập!';
    }
};

const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
};
</script>
<style scoped>
/* Ẩn biểu tượng con mắt mặc định của trình duyệt Edge/IE */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}
</style>