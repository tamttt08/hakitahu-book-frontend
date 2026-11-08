<template>
    <aside class="w-72 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 sticky top-0">
        <div class="p-6 flex items-center gap-3">
            <div
                class="w-10 h-10 bg-[#ec5b13] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#ec5b13]/20">
                <BookOpen class="w-6 h-6" />
            </div>
            <div>
                <h1 class="text-xl font-black tracking-tight text-[#ec5b13]">HAKITAHU BOOK ADMIN</h1>
                <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Hệ thống quản trị</p>
            </div>
        </div>

        <nav class="flex-1 px-4 mt-4 space-y-1 overflow-y-auto no-scrollbar">
            <router-link to="/admin/products" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                active-class="bg-[#ec5b13]/10 text-[#ec5b13] border border-[#ec5b13]/20 font-bold"
                :class="route.path === '/admin/products' ? '' : 'text-slate-600 hover:bg-slate-100 font-semibold'">
                <Book class="w-5 h-5" /> Quản lý Sách
            </router-link>
            <router-link to="/admin/categories"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                active-class="bg-[#ec5b13]/10 text-[#ec5b13] border border-[#ec5b13]/20 font-bold"
                :class="route.path === '/admin/categories' ? '' : 'text-slate-600 hover:bg-slate-100 font-semibold'">
                <LayoutGrid class="w-5 h-5" /> Danh mục
            </router-link>
            <router-link to="/admin/orders" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                active-class="bg-[#ec5b13]/10 text-[#ec5b13] border border-[#ec5b13]/20 font-bold"
                :class="route.path === '/admin/orders' ? '' : 'text-slate-600 hover:bg-slate-100 font-semibold'">
                <ShoppingCart class="w-5 h-5" /> Đơn hàng
            </router-link>
            <router-link to="/admin/users" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                active-class="bg-[#ec5b13]/10 text-[#ec5b13] border border-[#ec5b13]/20 font-bold"
                :class="route.path === '/admin/users' ? '' : 'text-slate-600 hover:bg-slate-100 font-semibold'">
                <Users class="w-5 h-5" /> Khách hàng
            </router-link>

            <div class="pt-4 pb-2">
                <p class="px-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Cài đặt</p>
            </div>
            <router-link to="/admin/config" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                active-class="bg-[#ec5b13]/10 text-[#ec5b13] border border-[#ec5b13]/20 font-bold"
                :class="route.path === '/admin/config' ? '' : 'text-slate-600 hover:bg-slate-100 font-semibold'">
                <Settings class="w-5 h-5" /> Cấu hình hệ thống
            </router-link>
        </nav>

        <div class="p-4 mt-auto border-t border-slate-200">
            <div class="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    <div class="w-full h-full bg-[#ec5b13] flex items-center justify-center text-white font-bold">{{
                        currentUser?.avatar || 'AD' }}</div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold truncate">{{ currentUser?.fullName || 'Admin User' }}</p>
                    <p class="text-[10px] text-slate-500 truncate font-medium">{{ currentUser?.email || 'admin@booko.vn'
                        }}</p>
                </div>
                <button @click="handleLogout" class="text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut class="w-5 h-5" />
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { BookOpen, Book, LayoutGrid, ShoppingCart, Users, Settings, LogOut } from 'lucide-vue-next';
import { AuthService } from '../services/auth.service';

const route = useRoute();
const router = useRouter();
const currentUser = JSON.parse(localStorage.getItem('user')) || {};

const handleLogout = () => {
    AuthService.logout();
    router.push('/login');
};
</script>