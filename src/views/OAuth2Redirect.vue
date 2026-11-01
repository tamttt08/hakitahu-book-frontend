<template>
    <div class="min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
        <div class="w-12 h-12 border-4 border-[#308ce8]/20 border-t-[#308ce8] rounded-full animate-spin mb-4"></div>
        <h2 class="text-xl font-bold text-slate-700">Đang xử lý đăng nhập Google...</h2>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();

onMounted(async () => {
  const token = route.query.token;

  if (token) {
    // 1. Lưu token để dùng làm chìa khóa gọi API
    localStorage.setItem('token', token);
    
    try {
      // 2. Gọi API lấy dữ liệu thật từ Database thay vì tự dịch JWT
      const res = await axios.get('http://localhost:8081/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 3. Lưu toàn bộ dữ liệu chuẩn vào bộ nhớ và chuyển hướng
      localStorage.setItem('user', JSON.stringify(res.data));
      window.location.href = '/';
    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu:", error);
      window.location.href = '/login';
    }
  } else {
    window.location.href = '/login';
  }
});
</script>