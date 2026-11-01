<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <ShipperSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Header -->
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div class="relative w-full max-w-xl">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#308ce8]/20 outline-none"
                        placeholder="Tìm mã đơn hoặc khách hàng..." type="text" />
                </div>
            </header>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="flex flex-col gap-8 max-w-7xl mx-auto">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Đơn hàng cần giao</h2>
                        <p class="text-slate-500 font-medium">Quản lý các đơn hàng đang trong quá trình vận chuyển.</p>
                    </div>

                    <!-- Tabs -->
                    <div class="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        <button v-for="status in ['Tất cả', 'Đang giao', 'Hoàn thành', 'Đã hủy']" :key="status"
                            @click="statusFilter = status"
                            :class="['px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all', statusFilter === status ? 'bg-[#308ce8] text-white shadow-lg shadow-[#308ce8]/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200']">
                            {{ status }}
                        </button>
                    </div>

                    <!-- Table -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Mã đơn</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Khách hàng</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Tổng tiền</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Trạng thái</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="order in filteredOrders" :key="order.id"
                                    class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 font-bold text-[#308ce8]">#{{ order.id }}</td>
                                    <td class="px-6 py-4">
                                        <p class="font-bold text-slate-900">{{ order.customer }}</p>
                                        <p class="text-xs text-slate-500">{{ order.date }}</p>
                                    </td>
                                    <td class="px-6 py-4 font-bold text-slate-900">{{ formatPrice(order.total) }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider', order.status === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-600' : order.status === 'Đang giao' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600']">
                                            {{ order.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <div v-if="order.status === 'Đang giao'"
                                            class="flex items-center justify-end gap-2">
                                            <button @click="updateOrderStatus(order.id, 'Hoàn thành')"
                                                class="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-all">
                                                Hoàn thành
                                            </button>
                                            <button @click="updateOrderStatus(order.id, 'Đã hủy')"
                                                class="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-all">
                                                Hủy đơn
                                            </button>
                                        </div>
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
import { Search } from 'lucide-vue-next';
import ShipperSidebar from '../components/ShipperSidebar.vue';
import { ADMIN_ORDERS, formatPrice } from '../data/mockData';

const searchQuery = ref('');
const statusFilter = ref('Tất cả');
// Shipper chỉ thấy các đơn đang giao, đã hoàn thành hoặc đã hủy
const orders = ref(ADMIN_ORDERS.filter(o => ['Đang giao', 'Hoàn thành', 'Đã hủy'].includes(o.status)));

const filteredOrders = computed(() => {
    return orders.value.filter(o => {
        const matchSearch = o.id.toLowerCase().includes(searchQuery.value.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchStatus = statusFilter.value === 'Tất cả' || o.status === statusFilter.value;
        return matchSearch && matchStatus;
    });
});

const updateOrderStatus = (id, newStatus) => {
    const order = orders.value.find(o => o.id === id);
    if (order) {
        order.status = newStatus;
    }
};
</script>