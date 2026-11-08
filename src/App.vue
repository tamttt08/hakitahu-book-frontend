<template>
  <div class="min-h-screen flex flex-col">
    <Header v-if="!isAuthLayout" />

    <!-- Chỉ áp dụng thu hẹp (max-w-7xl) nếu KHÔNG phải admin/shipper VÀ KHÔNG phải các trang cần full viền -->
    <main class="flex-1 w-full" :class="{ 'max-w-7xl mx-auto px-4 lg:px-8 py-6': !isAuthLayout && !isFullWidthPage }">
      <router-view />
    </main>

    <Footer v-if="!isAuthLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const route = useRoute();

// 1. Logic ẩn Header/Footer (Dành cho khu vực quản trị)
const isAuthLayout = computed(() => {
  return route.path.startsWith('/admin') || route.path.startsWith('/shipper');
});

// 2. Logic bung full viền màn hình (Dành cho các trang có ảnh nền rộng)
const isFullWidthPage = computed(() => {
  return ['/login', '/register', '/forgot-password', '/reset-password'].includes(route.path);
});
</script>