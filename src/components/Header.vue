<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 lg:px-8">
      <div class="flex items-center justify-between h-20 gap-8">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 shrink-0">
          <span class="text-2xl font-extrabold tracking-tighter text-[#308ce8]">HAKITAHU BOOK</span>
        </router-link>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl hidden md:block">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search class="w-5 h-5 text-slate-400 group-focus-within:text-[#308ce8] transition-colors" />
            </div>
            <input type="text" placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..."
              class="block w-full pl-11 pr-24 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-[#308ce8] focus:bg-white transition-all text-sm outline-none"
              v-model="searchQuery" @keydown.enter="handleSearch" />
            <button @click="handleSearch"
              class="absolute inset-y-1.5 right-1.5 px-4 bg-[#308ce8] text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
              Tìm kiếm
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 lg:gap-4">
          <!-- Nút chỉ hiện khi là Admin: Quay về trang Admin -->
          <router-link v-if="isAdmin" to="/admin/categories"
            class="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#ec5b13] hover:bg-[#d44d0c] rounded-xl shadow-md shadow-[#ec5b13]/20 transition-all">
            <LayoutDashboard class="w-4 h-4" />
            <span>Trang Quản Trị</span>
          </router-link>

          <router-link to="/cart" class="flex items-center gap-1 hover:text-[#308ce8] transition-colors relative">
            <ShoppingCart class="w-6 h-6" />
            <span
              class="absolute -top-2 -right-2 bg-[#308ce8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {{ cartItemsCount }}
            </span>
          </router-link>

          <div class="h-6 w-px bg-slate-200 mx-1"></div>

          <div v-if="isLoggedIn"
            class="relative group flex items-center gap-2 cursor-pointer pl-2">
            <span class="text-sm font-medium text-gray-700 hidden md:block">{{ currentUser?.fullName || 'Tài khoản' }}</span>
            <div
              class="w-9 h-9 rounded-full bg-[#308ce8]/10 flex items-center justify-center border border-[#308ce8]/20 overflow-hidden">
              <UserCircle class="h-5 w-5 text-[#308ce8]" />
            </div>

            <!-- Dropdown menu -->
            <div
              class="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              
              <!-- Tùy chọn chuyển sang trang Admin bên trong Dropdown -->
              <router-link v-if="isAdmin" to="/admin/categories"
                class="w-full text-left px-4 py-2.5 text-sm font-bold text-[#ec5b13] hover:bg-orange-50 flex items-center gap-2 border-b border-slate-100">
                <LayoutDashboard class="w-4 h-4" /> Bảng điều khiển Admin
              </router-link>

              <router-link to="/profile"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <User class="w-4 h-4" /> Thông tin tài khoản
              </router-link>
              <button @click="handleLogout"
                class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-slate-50">
                Đăng xuất
              </button>
            </div>
          </div>

          <div v-else class="flex items-center gap-2">
            <router-link to="/login"
              class="text-sm font-semibold px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">Đăng
              nhập</router-link>
            <router-link to="/register"
              class="text-sm font-semibold px-4 py-2 bg-[#308ce8]/10 text-[#308ce8] border border-[#308ce8]/20 rounded-lg hover:bg-[#308ce8] hover:text-white transition-all">Đăng
              ký</router-link>
          </div>
        </div>
      </div>

      <!-- Nav Menu -->
      <nav class="flex items-center gap-8 h-12 overflow-x-auto no-scrollbar whitespace-nowrap">
        <router-link to="/"
          class="text-sm font-semibold h-full flex items-center transition-all text-slate-600 hover:text-[#308ce8]"
          active-class="text-[#308ce8] border-b-2 border-[#308ce8]">Trang chủ</router-link>
        <router-link to="/categories"
          class="text-sm font-semibold h-full flex items-center transition-all text-slate-600 hover:text-[#308ce8]"
          active-class="text-[#308ce8] border-b-2 border-[#308ce8]">Danh mục Sách</router-link>
        <router-link to="/new-arrivals"
          class="text-sm font-semibold h-full flex items-center transition-all text-slate-600 hover:text-[#308ce8]"
          active-class="text-[#308ce8] border-b-2 border-[#308ce8]">Sách Mới</router-link>
        <router-link to="/promotions"
          class="text-sm font-semibold h-full flex items-center transition-all text-slate-600 hover:text-[#308ce8]"
          active-class="text-[#308ce8] border-b-2 border-[#308ce8]">Khuyến mãi</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search, ShoppingCart, UserCircle, User, LayoutDashboard } from 'lucide-vue-next';

const router = useRouter();
const searchQuery = ref('');
const isLoggedIn = ref(false);
const currentUser = ref(null);
const cartItemsCount = ref(0);

// Kiểm tra quyền Admin an toàn (xử lý cả chữ hoa và chữ thường)
const isAdmin = computed(() => {
  const role = (currentUser.value?.role || '').toLowerCase();
  return role === 'admin' || role === 'role_admin';
});

// Kiểm tra localStorage ngay khi Header xuất hiện
onMounted(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      isLoggedIn.value = true;
      currentUser.value = JSON.parse(userData);
    } catch (e) {
      console.error('Lỗi đọc dữ liệu người dùng:', e);
    }
  }
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/categories?q=${searchQuery.value}`);
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  isLoggedIn.value = false;
  currentUser.value = null;
  
  window.location.href = '/login';
};
</script>