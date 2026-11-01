<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <AdminSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div class="relative w-full max-w-xl">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/50 outline-none"
                        placeholder="Tìm kiếm mã đơn hàng..." type="text" />
                </div>
                <button @click="router.push('/')"
                    class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#ec5b13] transition-colors">Về cửa
                    hàng</button>
            </header>

            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="flex flex-col gap-8 max-w-7xl mx-auto">
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Đơn hàng</h2>

                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                        <div class="flex gap-2 border-b border-slate-100 pb-2">
                            <button v-for="tab in ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Hoàn thành']" :key="tab"
                                @click="activeTab = tab"
                                :class="['px-5 py-2.5 rounded-xl font-bold text-sm transition-all', activeTab === tab ? 'bg-[#ec5b13] text-white' : 'text-slate-600 hover:bg-slate-100']">
                                {{ tab }}
                            </button>
                        </div>

                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-100">
                                    <th class="px-4 py-4 font-bold text-slate-400 text-xs uppercase">Mã đơn hàng</th>
                                    <th class="px-4 py-4 font-bold text-slate-400 text-xs uppercase">Ngày đặt</th>
                                    <th class="px-4 py-4 font-bold text-slate-400 text-xs uppercase">Tổng tiền</th>
                                    <th class="px-4 py-4 font-bold text-slate-400 text-xs uppercase">Trạng thái</th>
                                    <th class="px-4 py-4 font-bold text-slate-400 text-xs uppercase text-right">Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="order in filteredOrders" :key="order.id"
                                    class="hover:bg-slate-50 transition-all">
                                    <td class="px-4 py-5 font-bold text-[#ec5b13]">#{{ order.id }}</td>
                                    <td class="px-4 py-5 text-slate-500 font-medium">{{ order.date }}</td>
                                    <td class="px-4 py-5 font-bold text-slate-900">{{ formatPrice(order.total) }}</td>
                                    <td class="px-4 py-5">
                                        <span
                                            :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase', order.statusColor === 'green' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600']">
                                            {{ order.status }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-5 text-right">
                                        <button
                                            class="text-[#ec5b13] font-bold text-xs hover:underline flex items-center gap-1 justify-end w-full">
                                            Xem chi tiết
                                            <ChevronRight class="w-3 h-3" />
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
import { Search, ChevronRight } from 'lucide-vue-next';
import AdminSidebar from '../components/AdminSidebar.vue';
import { ADMIN_ORDERS, formatPrice } from '../data/mockData';

const router = useRouter();
const searchQuery = ref('');
const activeTab = ref('Tất cả');
const orders = ref(ADMIN_ORDERS || []);

const filteredOrders = computed(() => {
    return orders.value.filter(o => {
        const matchSearch = o.id.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchTab = activeTab.value === 'Tất cả' || o.status === activeTab.value;
        return matchSearch && matchTab;
    });
});
</script>