<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <AdminSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Header -->
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div class="relative w-full max-w-xl">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/50 outline-none"
                        placeholder="Tìm kiếm sách, tác giả..." type="text" />
                </div>
                <button @click="router.push('/')"
                    class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#ec5b13] transition-colors">Về cửa
                    hàng</button>
            </header>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="flex flex-col gap-8 max-w-7xl mx-auto">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Sách</h2>
                            <p class="text-slate-500 font-medium">Danh mục sách hiện có trong hệ thống</p>
                        </div>
                        <button
                            class="flex items-center gap-2 bg-[#ec5b13] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ec5b13]/90 shadow-lg shadow-[#ec5b13]/25">
                            <Plus class="w-5 h-5" /> Thêm sách mới
                        </button>
                    </div>

                    <!-- Filters -->
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
                        <select v-model="categoryFilter"
                            class="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-semibold outline-none">
                            <option value="Tất cả thể loại">Tất cả thể loại</option>
                            <option v-for="cat in CATEGORIES_LIST" :key="cat.name" :value="cat.name">{{ cat.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Table -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hình ảnh</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Thông tin sách</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Giá bán</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Kho</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="book in filteredBooks" :key="book.id"
                                    class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden shadow-sm">
                                            <img :src="book.image" :alt="book.title" class="w-full h-full object-cover"
                                                referrerpolicy="no-referrer" />
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="text-sm font-bold text-slate-900 block">{{ book.title }}</span>
                                        <span class="text-xs text-slate-500 font-medium">{{ book.author }}</span>
                                    </td>
                                    <td class="px-6 py-4 font-bold text-sm text-[#ec5b13]">{{ formatPrice(book.price) }}
                                    </td>
                                    <td class="px-6 py-4 text-sm font-medium">{{ book.stock || 50 }}</td>
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
import { BEST_SELLERS, CATEGORY_BOOKS, CATEGORIES_LIST, formatPrice } from '../data/mockData';

const router = useRouter();
const searchQuery = ref('');
const categoryFilter = ref('Tất cả thể loại');

// Gộp data mock cho mục đích hiển thị Admin
const books = ref([...BEST_SELLERS, ...CATEGORY_BOOKS]);

const filteredBooks = computed(() => {
    return books.value.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchCat = categoryFilter.value === 'Tất cả thể loại' || (b.category || 'Văn học') === categoryFilter.value;
        return matchSearch && matchCat;
    });
});
</script>