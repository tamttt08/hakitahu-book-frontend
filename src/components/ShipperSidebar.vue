<template>
    <aside class="w-72 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 sticky top-0">
        <div class="p-6 flex items-center gap-3">
            <div
                class="w-10 h-10 bg-[#308ce8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#308ce8]/20">
                <Truck class="w-6 h-6" />
            </div>
            <div>
                <h1 class="text-xl font-black tracking-tight text-[#308ce8]">BookO Shipper</h1>
                <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Hệ thống giao hàng</p>
            </div>
        </div>

        <nav class="flex-1 px-4 mt-4 space-y-1 overflow-y-auto no-scrollbar">
            <router-link to="/shipper/orders" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                active-class="bg-[#308ce8]/10 text-[#308ce8] border border-[#308ce8]/20 font-bold"
                :class="route.path === '/shipper/orders' ? '' : 'text-slate-600 hover:bg-slate-100 font-semibold'">
                <ShoppingCart class="w-5 h-5" /> Đơn hàng
            </router-link>

            <div class="pt-4 pb-2">
                <p class="px-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Cài đặt</p>
            </div>

            <router-link to="/shipper/config" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                active-class="bg-[#308ce8]/10 text-[#308ce8] border border-[#308ce8]/20 font-bold"
                :class="route.path === '/shipper/config' ? '' : 'text-slate-600 hover:bg-slate-100 font-semibold'">
                <Settings class="w-5 h-5" /> Cấu hình hệ thống
            </router-link>
        </nav>

        <div class="p-4 mt-auto border-t border-slate-200">
            <div class="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    <div class="w-full h-full flex items-center justify-center bg-[#308ce8] text-white font-bold">
                        {{ currentUser?.avatar || 'SH' }}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-900 truncate">{{ currentUser?.fullName || 'Shipper User' }}
                    </p>
                    <p class="text-[10px] font-medium text-slate-500 truncate">Shipper</p>
                </div>
                <button @click="handleLogout"
                    class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <LogOut class="w-5 h-5" />
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { Truck, ShoppingCart, Settings, LogOut } from 'lucide-vue-next';
import { AuthService } from '../services/auth.service';

const route = useRoute();
const router = useRouter();
const currentUser = JSON.parse(localStorage.getItem('user')) || {};

const handleLogout = () => {
    AuthService.logout();
    router.push('/login');
};
</script>