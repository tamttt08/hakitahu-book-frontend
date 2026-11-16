<template>
  <div class="py-6 space-y-6">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500">
      <router-link to="/" class="hover:text-[#308ce8] transition-colors">Trang chủ</router-link>
      <ChevronRight class="w-4 h-4 text-slate-400" />
      <span>Danh mục</span>
      <ChevronRight class="w-4 h-4 text-slate-400" />
      <span class="font-bold text-slate-800">{{ currentCategoryName }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <!-- Cột trái: Bộ lọc (Sidebar) -->
      <aside class="lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <!-- 1. Thể loại -->
        <div>
          <h3 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">THỂ LOẠI</h3>
          <div class="space-y-1.5">
            <!-- Nút Tất cả sách -->
            <button @click="selectCategory(null)"
              :class="selectedCategoryId === null ? 'bg-[#308ce8]/10 text-[#308ce8] font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all">
              <div class="flex items-center gap-2.5">
                <LayoutGrid class="w-4 h-4" />
                <span>Tất cả sách</span>
              </div>
              <span :class="selectedCategoryId === null ? 'bg-[#308ce8] text-white' : 'text-slate-400'"
                class="text-xs px-2 py-0.5 rounded-full font-bold">
                {{ books.length }}
              </span>
            </button>

            <!-- Danh sách Danh mục từ Database -->
            <button v-for="cat in categories" :key="cat.categoryId"
              @click="selectCategory(cat.categoryId)"
              :class="selectedCategoryId === cat.categoryId ? 'bg-[#308ce8]/10 text-[#308ce8] font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all">
              <div class="flex items-center gap-2.5 truncate">
                <Book class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ cat.categoryName }}</span>
              </div>
              <span :class="selectedCategoryId === cat.categoryId ? 'bg-[#308ce8] text-white px-2 py-0.5 rounded-full' : 'text-slate-400'"
                class="text-xs font-bold">
                {{ getBookCountByCategory(cat.categoryId) }}
              </span>
            </button>
          </div>
        </div>

        <!-- 2. Khoảng giá -->
        <div>
          <h3 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">KHOẢNG GIÁ (VNĐ)</h3>
          <input type="range" min="0" max="1000000" step="10000" v-model.number="maxPrice"
            class="w-full accent-[#308ce8] cursor-pointer" />
          <div class="flex justify-between text-xs font-bold text-slate-700 mt-2">
            <span>0đ</span>
            <span class="text-[#308ce8]">{{ formatPrice(maxPrice) }}</span>
          </div>
        </div>

        <!-- Nút Xóa bộ lọc nếu đang tìm kiếm -->
        <div v-if="searchKeyword || selectedCategoryId !== null || maxPrice < 1000000" class="pt-2 border-t border-slate-100">
          <button @click="resetFilters"
            class="w-full py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Đặt lại bộ lọc
          </button>
        </div>
      </aside>

      <!-- Cột phải: Danh sách sản phẩm -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Thanh tiêu đề & Sắp xếp -->
        <div class="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-baseline gap-2">
            <h1 class="text-lg font-extrabold text-slate-800">{{ currentCategoryName }}</h1>
            <span class="text-sm text-slate-400">({{ filteredBooks.length }} sản phẩm)</span>
            <span v-if="searchKeyword" class="text-xs bg-blue-50 text-[#308ce8] px-2.5 py-1 rounded-lg font-semibold">
              Từ khóa: "{{ searchKeyword }}"
            </span>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-sm text-slate-500 whitespace-nowrap">Sắp xếp:</span>
            <select v-model="sortBy"
              class="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#308ce8]">
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name-asc">Tên: A - Z</option>
            </select>
          </div>
        </div>

        <!-- Trạng thái Loading / Rỗng -->
        <div v-if="isLoading" class="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100">
          Đang tải danh sách sách...
        </div>

        <div v-else-if="filteredBooks.length === 0" class="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-3">
          <p class="text-slate-500 font-medium">Không tìm thấy cuốn sách nào phù hợp với bộ lọc hiện tại.</p>
          <button @click="resetFilters" class="text-sm font-bold text-[#308ce8] hover:underline">
            Xem tất cả sách
          </button>
        </div>

        <!-- Lưới hiển thị Sách (3 cột) -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="book in filteredBooks" :key="book.bookId"
            @click="goToDetail(book.bookId)"
            class="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
            
            <!-- Ảnh bìa -->
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden">
              <img :src="book.image || 'https://placehold.co/300x400?text=No+Image'" :alt="book.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerpolicy="no-referrer" />
              
              <!-- Nhãn hết hàng -->
              <div v-if="book.quantity <= 0" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span class="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase">Hết hàng</span>
              </div>
            </div>

            <!-- Nội dung thẻ sách -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p class="text-xs font-extrabold text-[#308ce8] uppercase tracking-wide mb-1">
                  {{ book.category?.categoryName || 'CHƯA PHÂN LOẠI' }}
                </p>
                <h3 class="text-base font-bold text-slate-800 line-clamp-2 group-hover:text-[#308ce8] transition-colors">
                  {{ book.title }}
                </h3>
                <p class="text-xs text-slate-500 mt-1">{{ book.author }}</p>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span class="text-lg font-extrabold text-[#ec5b13]">{{ formatPrice(book.price) }}</span>
                  <p class="text-[11px] text-slate-400">Kho: {{ book.quantity }}</p>
                </div>

                <button @click.stop="addToCart(book)" :disabled="book.quantity <= 0"
                  class="p-2.5 rounded-xl bg-[#308ce8]/10 text-[#308ce8] hover:bg-[#308ce8] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors">
                  <ShoppingCart class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRight, LayoutGrid, Book, ShoppingCart } from 'lucide-vue-next';
import { BookService } from '../services/book.service';
import { CategoryService } from '../services/category.service';

const route = useRoute();
const router = useRouter();

const books = ref([]);
const categories = ref([]);
const isLoading = ref(true);

// Các biến trạng thái bộ lọc
const selectedCategoryId = ref(null);
const maxPrice = ref(1000000);
const sortBy = ref('newest');
const searchKeyword = ref('');

// Tải dữ liệu thật từ Database
const fetchCategoriesAndBooks = async () => {
  isLoading.value = true;
  try {
    const [booksRes, categoriesRes] = await Promise.all([
      BookService.getAllBooks(),
      CategoryService.getAllCategories()
    ]);

    // Chỉ lấy sách và danh mục đang hoạt động (status === true)
    books.value = (booksRes.data || []).filter(b => b.status === true);
    categories.value = (categoriesRes.data || []).filter(c => c.status === true);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu trang danh mục:', error);
  } finally {
    isLoading.value = false;
  }
};

// Đồng bộ tham số trên URL (?q=... hoặc ?catId=...)
const syncFromRouteQuery = () => {
  searchKeyword.value = route.query.q ? String(route.query.q).trim() : '';
  if (route.query.catId) {
    selectedCategoryId.value = Number(route.query.catId);
  }
};

onMounted(() => {
  syncFromRouteQuery();
  fetchCategoriesAndBooks();
});

watch(() => route.query, () => {
  syncFromRouteQuery();
});

// Đếm số lượng sách của từng danh mục
const getBookCountByCategory = (catId) => {
  return books.value.filter(b => b.category?.categoryId === catId).length;
};

// Tên danh mục đang chọn để hiển thị trên tiêu đề & Breadcrumb
const currentCategoryName = computed(() => {
  if (selectedCategoryId.value === null) return 'Tất cả sách';
  const found = categories.value.find(c => c.categoryId === selectedCategoryId.value);
  return found ? found.categoryName : 'Tất cả sách';
});

// Danh sách sách sau khi Lọc (Thể loại + Giá + Từ khóa) và Sắp xếp
const filteredBooks = computed(() => {
  let result = books.value.filter(book => {
    // 1. Lọc theo danh mục
    const matchCategory = selectedCategoryId.value === null || book.category?.categoryId === selectedCategoryId.value;
    // 2. Lọc theo giá
    const matchPrice = (book.price || 0) <= maxPrice.value;
    // 3. Lọc theo từ khóa tìm kiếm trên Header
    const q = searchKeyword.value.toLowerCase();
    const matchKeyword = !q || 
      book.title?.toLowerCase().includes(q) || 
      book.author?.toLowerCase().includes(q);

    return matchCategory && matchPrice && matchKeyword;
  });

  // 4. Sắp xếp
  if (sortBy.value === 'newest') {
    result.sort((a, b) => b.bookId - a.bookId);
  } else if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === 'name-asc') {
    result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  return result;
});

const selectCategory = (catId) => {
  selectedCategoryId.value = catId;
};

const resetFilters = () => {
  selectedCategoryId.value = null;
  maxPrice.value = 1000000;
  sortBy.value = 'newest';
  searchKeyword.value = '';
  router.replace({ path: '/categories', query: {} });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
};

const goToDetail = (bookId) => {
  router.push(`/product/${bookId}`);
};

const addToCart = (book) => {
  alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
};
</script>