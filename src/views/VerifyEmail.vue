<template>
    <div class="max-w-md mx-auto my-20 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div v-if="status === 'loading'" class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-slate-200 border-t-[#308ce8] rounded-full animate-spin"></div>
            <h2 class="text-xl font-bold text-slate-800">Đang xác thực tài khoản...</h2>
            <p class="text-slate-500 text-sm">Vui lòng đợi trong giây lát.</p>
        </div>

        <div v-else-if="status === 'success'" class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900">Xác thực thành công!</h2>
            <p class="text-slate-500 text-sm">Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <button @click="router.push('/login')"
                class="mt-4 w-full bg-[#308ce8] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all">
                Đến trang Đăng nhập
            </button>
        </div>

        <div v-else class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900">Xác thực thất bại</h2>
            <p class="text-slate-500 text-sm">Đường link xác thực không hợp lệ hoặc đã hết hạn.</p>
            <button @click="router.push('/')"
                class="mt-4 w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all">
                Về trang chủ
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'; // Bật import axios

const route = useRoute();
const router = useRouter();
const status = ref('loading'); 

onMounted(async () => {
  const token = route.query.token;
  
  if (!token) {
    status.value = 'error';
    return;
  }

  try {
    // Gọi API xuống Spring Boot (nhớ sửa lại port và URL cho khớp với Backend của cậu)
    await axios.get(`http://localhost:8081/api/auth/verify?token=${token}`);
    status.value = 'success';
  } catch (error) {
    console.error(error);
    status.value = 'error';
  }
});
</script>