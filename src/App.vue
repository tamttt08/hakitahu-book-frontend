<template>
  <div class="min-h-screen flex flex-col">
    <Header v-if="!isAuthLayout" />
    <main class="flex-1 w-full" :class="{ 'max-w-7xl mx-auto px-4 lg:px-8 py-6': !isAuthLayout }">
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
// Ẩn Header/Footer khi ở trang Login, Register hoặc Admin
const isAuthLayout = computed(() => {
  return ['/login', '/register'].includes(route.path) || route.path.startsWith('/admin') || route.path.startsWith('/shipper');
});
</script>