<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 mb-6">
      <router-link to="/" class="hover:text-[#308ce8] text-slate-600 font-medium">Trang chủ</router-link>
      <ChevronRight class="w-4 h-4" />
      <span class="text-slate-500">Danh mục</span>
      <ChevronRight class="w-4 h-4" />
      <span class="text-slate-900 font-medium">Tất cả sách</span>
    </nav>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Filter -->
      <aside class="w-full lg:w-64 flex-shrink-0 space-y-8">
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Thể loại</h3>
          <div class="space-y-1">
            <button v-for="cat in CATEGORIES_LIST" :key="cat.name" @click="selectedCategory = cat.name"
              :class="['w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group', selectedCategory === cat.name ? 'bg-[#308ce8]/10 text-[#308ce8] font-medium' : 'hover:bg-slate-100 text-slate-600']">
              <span class="flex items-center gap-3">
                <!-- Icon mapping sẽ được xử lý đơn giản ở Vue -->
                <LayoutGrid v-if="cat.name === 'Tất cả sách'" class="w-5 h-5" />
                <Book v-else class="w-5 h-5" />
                {{ cat.name }}
              </span>
              <span v-if="cat.count"
                :class="['text-xs px-2 py-0.5 rounded-full', selectedCategory === cat.name ? 'bg-[#308ce8] text-white' : 'text-slate-400 group-hover:text-slate-600']">
                {{ cat.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Price Range -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Khoảng giá (VNĐ)</h3>
          <div class="px-2">
            <input type="range" min="0" max="1000000" step="50000" v-model="priceRange"
              class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#308ce8]" />
            <div class="flex justify-between mt-3 text-xs font-medium text-slate-600">
              <span>0đ</span>
              <span>{{ formatPrice(priceRange) }}</span>
            </div>
          </div>
        </div>

        <!-- Rating Filter -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Đánh giá</h3>
          <div class="space-y-3">
            <label v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="rating-filter" :checked="selectedRating === rating"
                @change="selectedRating = rating"
                class="rounded-full text-[#308ce8] focus:ring-[#308ce8] w-5 h-5 bg-slate-100 border-slate-300" />
              <div class="flex text-amber-400">
                <Star v-for="i in 5" :key="i" :class="['w-4 h-4', i <= rating ? 'fill-amber-400' : 'text-slate-300']" />
              </div>
              <span class="text-sm text-slate-600 group-hover:text-[#308ce8] transition-colors">Từ {{ rating }}
                sao</span>
            </label>
            <button @click="selectedRating = 0" class="text-xs text-[#308ce8] font-bold hover:underline">
              Xóa bộ lọc đánh giá
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <section class="flex-1">
        <!-- Sorting & View Options -->
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div>
            <h2 class="text-lg font-bold">{{ selectedCategory }} <span
                class="text-slate-400 font-normal text-sm ml-2">({{ filteredBooks.length }} sản phẩm)</span></h2>
          </div>
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <span class="text-sm text-slate-500 whitespace-nowrap">Sắp xếp:</span>
            <select v-model="activeFilter"
              class="text-sm border-slate-200 bg-transparent rounded-lg focus:ring-[#308ce8] focus:border-[#308ce8] flex-1 sm:w-48 py-1.5 outline-none">
              <option>Mới nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
              <option>Bán chạy</option>
            </select>
          </div>
        </div>

        <!-- Book Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="book in filteredBooks" :key="book.id"
            class="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group cursor-pointer transform hover:-translate-y-1">
            <div class="relative aspect-[3/4] overflow-hidden bg-slate-100">
              <img :src="book.image" :alt="book.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerpolicy="no-referrer" />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button @click.stop="addToCart(book)"
                  class="bg-white text-slate-900 p-3 rounded-full hover:bg-[#308ce8] hover:text-white transition-colors">
                  <ShoppingCart class="w-5 h-5" />
                </button>
                <button
                  class="bg-white text-slate-900 p-3 rounded-full hover:bg-[#308ce8] hover:text-white transition-colors">
                  <Heart class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div class="p-4">
              <p class="text-xs text-[#308ce8] font-bold uppercase tracking-wide mb-1">{{ book.category }}</p>
              <h3 class="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-[#308ce8] transition-colors">{{
                book.title }}</h3>
              <p class="text-sm text-slate-500 mb-3">{{ book.author }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-[#308ce8]">{{ formatPrice(book.price) }}</span>
                <div class="flex items-center text-amber-400 text-sm">
                  <Star class="w-4 h-4 fill-amber-400" />
                  <span class="ml-1 font-bold text-slate-700">{{ book.rating || 4.5 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronRight, Star, LayoutGrid, Book, ShoppingCart, Heart } from 'lucide-vue-next';
import { CATEGORY_BOOKS, CATEGORIES_LIST, formatPrice } from '../data/mockData';

const selectedCategory = ref('Tất cả sách');
const priceRange = ref(1000000);
const selectedRating = ref(0);
const activeFilter = ref('Mới nhất');

const filteredBooks = computed(() => {
  return CATEGORY_BOOKS.filter(book => {
    const matchesCategory = selectedCategory.value === 'Tất cả sách' || book.category === selectedCategory.value;
    const matchesPrice = book.price <= priceRange.value;
    const matchesRating = (book.rating || 0) >= selectedRating.value;
    return matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    if (activeFilter.value === 'Giá tăng dần') return a.price - b.price;
    if (activeFilter.value === 'Giá giảm dần') return b.price - a.price;
    return 0; // Mặc định Mới nhất
  });
});

const addToCart = (book) => {
  alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
};
</script>