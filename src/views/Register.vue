<template>
  <!-- 1. Thẻ div ngoài cùng: Phóng to full width, thêm thuộc tính chèn ảnh -->
  <div class="w-full min-h-[80vh] py-16 flex items-center justify-center bg-[#f6f7f8] bg-cover bg-center bg-no-repeat"
    style="background-image: url('/src/assets/images/background-login.jpg');">

    <!-- 2. Khối form trắng của cậu giữ nguyên bên trong -->
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10">
      <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">Đăng ký HAKITAHU BOOK</h2>

      <div v-if="message" class="mb-4 p-3 bg-green-100 text-green-700 rounded">{{ message }}</div>
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">{{ error }}</div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input v-model="formData.username" type="text" placeholder="Tên đăng nhập" required
          class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />

        <!-- Khu vực input mật khẩu được bọc lại để gắn icon -->
        <div class="relative w-full">
          <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu" required
            class="w-full px-4 py-2 pr-10 border rounded focus:outline-none focus:border-blue-500 transition-colors" />

          <!-- Nút con mắt -->
          <button type="button" @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors">
            <EyeOff v-if="showPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>

        <input v-model="formData.email" type="email" placeholder="Email" required
          class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
        <input v-model="formData.fullName" type="text" placeholder="Họ và tên" required
          class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Đăng
          ký</button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Đã có tài khoản? <router-link to="/login" class="text-blue-600 hover:underline">Đăng nhập</router-link>
      </p>
    </div>
    <!-- 3. (Tùy chọn) Thêm lớp phủ mờ màu đen để chữ trên form nổi bật hơn nếu ảnh nền quá sáng -->
    <!-- <div class="absolute inset-0 bg-black/30"></div> -->
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, EyeOff } from 'lucide-vue-next'; // Import icon con mắt
import { AuthService } from '../services/auth.service';

const router = useRouter();
const formData = reactive({ username: '', password: '', email: '', fullName: '' });
const message = ref('');
const error = ref('');
const showPassword = ref(false); // Biến kiểm soát trạng thái ẩn/hiện mật khẩu

const handleSubmit = async () => {
  message.value = '';
  error.value = '';
  try {
    const res = await AuthService.register(formData);
    message.value = res;
    setTimeout(() => router.push('/login'), 3000);
  } catch (err) {
    error.value = err.response?.data || 'Đăng ký thất bại!';
  }
};
</script>
<style scoped>
/* Ẩn biểu tượng con mắt mặc định của trình duyệt Edge/IE */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}
</style>