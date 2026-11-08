<template>
    <div class="min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
        <div class="w-12 h-12 border-4 border-[#308ce8]/20 border-t-[#308ce8] rounded-full animate-spin mb-4"></div>
        <h2 class="text-xl font-bold text-slate-700">Đang xử lý đăng nhập Google...</h2>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const token = route.query.token;

  if (token) {
    // 1. Lưu token vào localStorage
    localStorage.setItem('token', token);
    
    try {
      // 2. Gọi API lấy dữ liệu user thật từ Database
      const res = await axios.get('http://localhost:8081/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = res.data;
      
      // 3. Lưu toàn bộ dữ liệu user vào localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // 4. Kiểm tra Role để phân luồng điều hướng
      const userRole = (userData.role || 'user').toLowerCase();

      if (userRole === 'admin' || userRole === 'role_admin') {
        router.push('/admin/products');
      } else if (userRole === 'shipper' || userRole === 'role_shipper') {
        router.push('/shipper');
      } else {
        router.push('/');
      }

    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu:", error);
      router.push('/login');
    }
  } else {
    router.push('/login');
  }
});
</script>