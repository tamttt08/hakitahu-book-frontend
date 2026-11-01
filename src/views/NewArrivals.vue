<template>
    <div class="space-y-8">
        <!-- Page Header -->
        <div class="flex flex-col gap-2">
            <h1 class="text-slate-900 text-4xl lg:text-5xl font-black leading-tight tracking-tight">Sách Mới Cập Nhật
            </h1>
            <p class="text-slate-500 text-lg max-w-2xl">Khám phá những tựa sách mới nhất, nóng hổi vừa được lên kệ tại
                BookO. Cập nhật tri thức mỗi ngày.</p>
        </div>

        <!-- Toolbar -->
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div class="flex flex-wrap gap-2">
                <button v-for="filter in ['Mới nhất', 'Giá tăng dần', 'Giá giảm dần', 'Bán chạy']" :key="filter"
                    @click="activeFilter = filter"
                    :class="['flex h-10 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-semibold transition-all', activeFilter === filter ? 'bg-[#308ce8] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200']">
                    {{ filter }}
                    <ChevronRight v-if="filter === 'Mới nhất'" class="w-4 h-4 rotate-90" />
                    <ArrowRight v-if="filter === 'Giá tăng dần'" class="w-4 h-4 -rotate-90" />
                    <ArrowRight v-if="filter === 'Giá giảm dần'" class="w-4 h-4 rotate-90" />
                    <Star v-if="filter === 'Bán chạy'" class="w-4 h-4" />
                </button>
            </div>
            <div class="text-slate-500 text-sm font-medium">
                Hiển thị {{ filteredNewArrivals.length }} trong số {{ NEW_ARRIVALS.length }} sản phẩm
            </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div v-for="book in filteredNewArrivals" :key="book.id" @click="goToDetail(book)"
                class="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div class="relative w-full aspect-[3/4] overflow-hidden">
                    <div
                        class="absolute top-3 left-3 z-10 bg-[#308ce8] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Mới</div>
                    <img :src="book.image" :alt="book.title"
                        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        referrerpolicy="no-referrer" />
                    <div
                        class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                        <button @click.stop="addToCart(book)"
                            class="bg-white text-[#308ce8] font-bold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 text-sm">
                            <ShoppingCart class="w-4 h-4" /> Thêm vào giỏ
                        </button>
                    </div>
                </div>
                <div class="p-4 flex flex-col gap-1 flex-1">
                    <h3 class="text-slate-900 text-base font-bold leading-snug line-clamp-2">{{ book.title }}</h3>
                    <p class="text-slate-500 text-xs font-medium italic">{{ book.author }}</p>
                    <div class="mt-auto pt-3 flex items-center justify-between">
                        <span class="text-[#308ce8] font-black text-lg">{{ formatPrice(book.price) }}</span>
                        <span class="text-slate-400 text-xs line-through">{{ formatPrice(book.oldPrice) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-2 mt-12 mb-8">
            <button
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#308ce8] hover:border-[#308ce8] transition-all">
                <ArrowLeft class="w-4 h-4" />
            </button>
            <button
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-[#308ce8] text-white font-bold">1</button>
            <button
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#308ce8] hover:border-[#308ce8] transition-all">2</button>
            <button
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#308ce8] hover:border-[#308ce8] transition-all">3</button>
            <div class="w-10 h-10 flex items-center justify-center text-slate-400">...</div>
            <button
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#308ce8] hover:border-[#308ce8] transition-all">12</button>
            <button
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#308ce8] hover:border-[#308ce8] transition-all">
                <ArrowRight class="w-4 h-4" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronRight, ArrowRight, ArrowLeft, Star, ShoppingCart } from 'lucide-vue-next';
import { NEW_ARRIVALS, formatPrice } from '../data/mockData';

const router = useRouter();
const activeFilter = ref('Mới nhất');

const filteredNewArrivals = computed(() => {
    return [...NEW_ARRIVALS].sort((a, b) => {
        if (activeFilter.value === 'Giá tăng dần') return a.price - b.price;
        if (activeFilter.value === 'Giá giảm dần') return b.price - a.price;
        return 0;
    });
});

const addToCart = (book) => {
    alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
};

const goToDetail = (book) => {
    router.push('/product-detail');
};
</script>