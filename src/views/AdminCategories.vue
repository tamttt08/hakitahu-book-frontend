<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <AdminSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div class="relative w-full max-w-xl">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/50 outline-none"
                        placeholder="Tìm kiếm danh mục..." type="text" />
                </div>
                <button @click="router.push('/')"
                    class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#ec5b13] transition-colors">Về cửa
                    hàng</button>
            </header>

            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="flex flex-col gap-8 max-w-7xl mx-auto">
                    <div class="flex justify-between items-center">
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Danh mục Sách</h2>
                        <button
                            class="flex items-center gap-2 bg-[#ec5b13] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ec5b13]/90 shadow-lg shadow-[#ec5b13]/25">
                            <Plus class="w-5 h-5" /> Thêm danh mục mới
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Tên danh mục</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Số
                                        lượng sách</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Trạng thái</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="cat in filteredCategories" :key="cat.name || cat"
                                    class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 font-bold text-slate-900">{{ cat.name || cat }}</td>
                                    <td class="px-6 py-4 text-center">
                                        <span
                                            class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{{
                                            cat.count || 0 }} cuốn</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Hoạt động
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button
                                            class="p-2 text-slate-400 hover:text-[#ec5b13] hover:bg-[#ec5b13]/10 rounded-lg">
                                            <Edit3 class="w-5 h-5" />
                                        </button>
                                        <button
                                            class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 class="w-5 h-5" />
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
import { Search, Plus, Edit3, Trash2 } from 'lucide-vue-next';
import AdminSidebar from '../components/AdminSidebar.vue';
import { CATEGORIES_LIST } from '../data/mockData';

const router = useRouter();
const searchQuery = ref('');
const categories = ref(CATEGORIES_LIST || []);

const filteredCategories = computed(() => {
    return categories.value.filter(cat =>
        (cat.name || cat).toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
</script>