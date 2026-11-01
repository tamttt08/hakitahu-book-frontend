<template>
  <div class="flex-grow flex items-center justify-center py-12 px-4">
    <section class="max-w-2xl w-full text-center bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-50">
      <div class="mb-8 flex justify-center">
        <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <Check class="w-12 h-12 text-green-500" stroke-width="3" />
        </div>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
      <div class="text-gray-600 leading-relaxed mb-10 max-w-md mx-auto">
        <p>Cảm ơn <span class="font-semibold text-gray-900">bạn</span> đã tin tưởng lựa chọn <span
            class="text-[#308ce8] font-medium">BookO</span>.</p>
        <p class="mt-2">Đơn hàng của bạn đang được xử lý và sẽ sớm được giao. Bộ phận chăm sóc khách hàng sẽ liên hệ với
          bạn trong thời gian sớm nhất.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="router.push('/')"
          class="px-8 py-3 bg-[#308ce8] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center">
          Tiếp tục mua sắm
        </button>
        <!-- Nút này sẽ dẫn vào trang Cá nhân (Lịch sử đơn hàng) ở phần sau -->
        <button @click="router.push('/profile')"
          class="px-8 py-3 bg-white text-gray-600 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all inline-flex items-center justify-center">
          Xem lịch sử đơn hàng
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Check } from 'lucide-vue-next';

const router = useRouter();
</script>