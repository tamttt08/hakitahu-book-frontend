<template>
  <div class="max-w-5xl mx-auto px-4 py-8 mt-4">
    <!-- Back Link -->
    <div class="mb-6">
      <button @click="router.push('/')"
        class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#308ce8] transition-colors group">
        <ArrowLeft class="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Tiếp tục mua sắm
      </button>
    </div>

    <!-- Page Title & Search -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <h2 class="text-3xl font-black text-slate-900 tracking-tight">Lịch sử đơn hàng</h2>
      <div class="relative w-full md:w-80 group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="w-4 h-4 text-slate-400 group-focus-within:text-[#308ce8] transition-colors" />
        </div>
        <input type="text" placeholder="Tìm mã đơn, tên sách..." v-model="searchQuery"
          class="block w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#308ce8] focus:border-transparent transition-all outline-none text-sm" />
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap no-scrollbar">
      <button v-for="tab in tabs" :key="tab" @click="activeOrderTab = tab"
        :class="['pb-4 text-sm transition-colors border-b-2', activeOrderTab === tab ? 'font-bold border-[#308ce8] text-[#308ce8]' : 'font-semibold text-slate-500 hover:text-[#308ce8] border-transparent']">
        {{ tab }}
      </button>
    </div>

    <!-- Orders List -->
    <div class="space-y-6">
      <div v-if="filteredOrders.length > 0">
        <div v-for="order in filteredOrders" :key="order.id"
          class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6 transition-all hover:shadow-md">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-slate-50 gap-4">
            <div class="flex items-center gap-4">
              <div
                :class="['p-2 rounded-lg', order.statusColor === 'amber' ? 'bg-amber-50 text-amber-500' : order.statusColor === 'green' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500']">
                <Truck v-if="order.statusColor === 'amber'" class="w-5 h-5" />
                <CheckCircle v-else-if="order.statusColor === 'green'" class="w-5 h-5" />
                <XCircle v-else class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900">Đơn hàng #{{ order.id }}</h3>
                <p class="text-xs text-slate-500">Đặt lúc: {{ order.date }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                :class="['px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider', order.statusColor === 'amber' ? 'bg-amber-50 text-amber-600' : order.statusColor === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600']">
                {{ order.status }}
              </span>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-20 h-28 bg-slate-100 rounded-lg overflow-hidden shadow-inner">
              <img :alt="order.mainItem.title" class="w-full h-full object-cover" :src="order.mainItem.image"
                referrerpolicy="no-referrer" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 mb-1 truncate">{{ order.mainItem.title }}</p>
              <p class="text-xs text-slate-500 mb-2">Tác giả: {{ order.mainItem.author }}</p>
              <p v-if="order.otherItemsCount" class="text-sm text-slate-400 italic">Và {{ order.otherItemsCount }} sản
                phẩm khác...</p>
              <p v-else class="text-sm text-slate-400 italic">Số lượng: {{ order.quantity }}</p>
            </div>
            <div class="text-right flex flex-col justify-between h-full">
              <p
                :class="['text-lg font-black', order.status === 'Đã hủy' ? 'text-slate-400 line-through' : 'text-[#308ce8]']">
                {{ formatPrice(order.total) }}
              </p>
              <button
                class="mt-4 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-[#308ce8] hover:text-white transition-all flex items-center justify-center gap-2">
                Xem chi tiết
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBasket class="w-12 h-12 text-slate-400" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">Chưa có đơn hàng nào</h3>
        <p class="text-slate-500 max-w-xs mx-auto text-sm mb-8">Bạn chưa có đơn hàng nào trong trạng thái này. Hãy tiếp
          tục khám phá kho sách của BookO nhé!</p>
        <button @click="router.push('/')"
          class="inline-flex items-center px-6 py-3 bg-[#308ce8] text-white font-bold rounded-xl shadow-lg shadow-[#308ce8]/20 hover:bg-blue-600 transition-all">
          Khám phá ngay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Search, Truck, CheckCircle, XCircle, ChevronRight, ShoppingBasket } from 'lucide-vue-next';
import { formatPrice } from '../data/mockData';

const router = useRouter();
const searchQuery = ref('');
const activeOrderTab = ref('Tất cả');
const tabs = ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'];

// Dữ liệu mẫu đơn hàng (Mock data)
const allOrders = [
  {
    id: 'ORD12345', date: '15/10/2023, 14:30', status: 'Đang giao', statusColor: 'amber', total: 450000,
    mainItem: { title: 'Đắc Nhân Tâm (Bìa Cứng)', author: 'Dale Carnegie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8g-d5fLWv_Jd9hw0bdguMstDJUzn6iKvLCjPooFYUMwjLWMCKhrcWHvuPRbO934PxiNvQmIFcjROwB5heSyZ1mAeCORRZ-iM1HKugVn9-aONrZxH2vqirkwak1ZecUg8rK8q_bBqPiLO9EzdNe_zFSK0--vwbUoKjIIc7-sBufCCPDkmhOKdFU6PL9oJMASAE_kj--21fGajFqgURjcLstyZdIDn7i4-La0e_fkAaVRMMYs5GY1nnhXslL4CxdiexjowNcMHRWI0' },
    otherItemsCount: 2
  },
  {
    id: 'ORD12344', date: '10/10/2023, 09:15', status: 'Đã hoàn thành', statusColor: 'green', total: 210000,
    mainItem: { title: 'Nhà Giả Kim', author: 'Paulo Coelho', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8nFMQxCPVC0YCgAQKrTNoCws5E8GsqBsMZsnAtfqZh87uBDDYpKk7Hy3JMsD5oc3lCMz6_EI42Xr9lfkIzLDYm1JzGVmYrINt66VPMq847giUBNkatqVmcUv75Ofqp-f55rCWI_Df_wITVlBUxkHSEgUs4VadMdBDvf7_flKURxWPJ7Msl421iYAaqXrNTbGIhGHJKiODumVDHLcc2GcdhOW9PDZRNibV4-i-BRg1kuj2MGzQy5PWR80nkTz90Avg5RHK0xcEhw' },
    quantity: 1
  },
  {
    id: 'ORD12340', date: '01/10/2023, 20:45', status: 'Đã hủy', statusColor: 'red', total: 185000,
    mainItem: { title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiiwI-bWKAurGTp6x8ioWFMHhnFJpYIegcy7_yG8BPWb_lMc0Sl2fP-0Hk4-CtsCB9kX5OX64MkXISgKDfnEfsw3eBqimt1yWoFKMXIWVtRbEmY_AM_PnQ7JiNM0HCDSMsUeSaYLHPQoL8LB3px8rtOApLfTuA9aPAgcL55aUxrJhvP4Gmmpk6sj2isDRJfnB54s8Gdu3iCxIs4GvQ5qBOi56ngW-JiB51hqeYiEyG8-gpkiUFpz6Hps9l4ZtKzdrAT-W93jBgT_o' },
    quantity: 1
  }
];

const filteredOrders = computed(() => {
  return allOrders.filter(order => {
    const matchesTab = activeOrderTab.value === 'Tất cả' || order.status === activeOrderTab.value;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.mainItem.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesTab && matchesSearch;
  });
});
</script>