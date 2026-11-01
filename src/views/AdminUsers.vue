<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <AdminSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div class="relative w-full max-w-xl">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/50 outline-none"
                        placeholder="Tìm kiếm người dùng..." type="text" />
                </div>
                <button @click="router.push('/')"
                    class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#ec5b13] transition-colors">Về cửa
                    hàng</button>
            </header>

            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="flex flex-col gap-8 max-w-7xl mx-auto">
                    <div class="flex justify-between items-center">
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Người dùng</h2>
                        <button
                            class="flex items-center gap-2 bg-[#ec5b13] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ec5b13]/90 shadow-lg shadow-[#ec5b13]/25">
                            <Plus class="w-5 h-5" /> Thêm người dùng
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Người dùng</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Vai trò</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Trạng thái</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="user in filteredUsers" :key="user.id"
                                    class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                                                {{ user.avatar }}
                                            </div>
                                            <div>
                                                <div class="text-sm font-bold text-slate-900">{{ user.fullName }}</div>
                                                <div class="text-xs text-slate-500">{{ user.email }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            :class="['px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border', user.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100']">
                                            {{ user.role === 'admin' ? 'Quản trị viên' : user.role === 'shipper' ?
                                            'Shipper' : 'Khách hàng' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            :class="['flex items-center gap-1.5 text-sm font-bold', user.status === 'Đang hoạt động' ? 'text-emerald-600' : 'text-red-600']">
                                            <span
                                                :class="['w-2 h-2 rounded-full', user.status === 'Đang hoạt động' ? 'bg-emerald-500' : 'bg-red-500']"></span>
                                            {{ user.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button
                                            class="p-2 text-slate-400 hover:text-[#ec5b13] hover:bg-[#ec5b13]/10 rounded-lg">
                                            <Edit3 class="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Plus, Edit3 } from 'lucide-vue-next';
import AdminSidebar from '../components/AdminSidebar.vue';
import { MOCK_USERS } from '../data/mockData';

const router = useRouter();
const searchQuery = ref('');
const users = ref(MOCK_USERS || []);

const filteredUsers = computed(() => {
    return users.value.filter(u =>
        u.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
</script>