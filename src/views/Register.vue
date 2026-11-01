<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f6f7f8]">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">Đăng ký HAKITAHU BOOK</h2>
      
      <div v-if="message" class="mb-4 p-3 bg-green-100 text-green-700 rounded">{{ message }}</div>
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">{{ error }}</div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input v-model="formData.username" type="text" placeholder="Tên đăng nhập" required class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
        <input v-model="formData.password" type="password" placeholder="Mật khẩu" required class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
        <input v-model="formData.email" type="email" placeholder="Email" required class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
        <input v-model="formData.fullName" type="text" placeholder="Họ và tên" required class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" />
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Đăng ký</button>
      </form>
      
      <p class="mt-4 text-center text-sm text-gray-600">
        Đã có tài khoản? <router-link to="/login" class="text-blue-600 hover:underline">Đăng nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../services/auth.service';

const router = useRouter();
const formData = reactive({ username: '', password: '', email: '', fullName: '' });
const message = ref('');
const error = ref('');

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