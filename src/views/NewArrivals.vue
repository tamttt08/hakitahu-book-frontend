<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Tiêu đề trang -->
    <div class="space-y-2">
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
        Sách Mới Cập Nhật
      </h1>
      <p class="text-slate-500 text-sm sm:text-base max-w-2xl">
        Khám phá những tựa sách mới nhất, nóng hổi vừa được lên kệ tại HAKITAHU BOOK. Cập nhật tri thức mỗi ngày.
      </p>
    </div>

    <!-- Thanh bộ lọc sắp xếp & đếm số lượng -->
    <div class="bg-white px-4 py-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2.5">
        <button
          @click="sortBy = 'newest'"
          :class="sortBy === 'newest'
            ? 'bg-[#308ce8] text-white shadow-sm shadow-[#308ce8]/30'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
        >
          <span>Mới nhất</span>
          <ChevronDown class="w-4 h-4" />
        </button>

        <button
          @click="sortBy = 'price-asc'"
          :class="sortBy === 'price-asc'
            ? 'bg-[#308ce8] text-white shadow-sm shadow-[#308ce8]/30'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
        >
          <span>Giá tăng dần</span>
          <ArrowUp class="w-4 h-4" />
        </button>

        <button
          @click="sortBy = 'price-desc'"
          :class="sortBy === 'price-desc'
            ? 'bg-[#308ce8] text-white shadow-sm shadow-[#308ce8]/30'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
        >
          <span>Giá giảm dần</span>
          <ArrowDown class="w-4 h-4" />
        </button>

        <button
          @click="sortBy = 'bestseller'"
          :class="sortBy === 'bestseller'
            ? 'bg-[#308ce8] text-white shadow-sm shadow-[#308ce8]/30'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
        >
          <span>Bán chạy</span>
          <Star class="w-4 h-4" />
        </button>
      </div>

      <p class="text-sm text-slate-500 font-medium">
        Hiển thị <span class="font-bold text-slate-800">{{ displayedBooks.length }}</span> trong số
        <span class="font-bold text-slate-800">{{ books.length }}</span> sản phẩm
      </p>
    </div>

    <!-- Trạng thái Loading (8 thẻ) -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
        <div class="aspect-[3/4] bg-slate-200"></div>
        <div class="p-4 space-y-3">
          <div class="h-3 w-1/3 bg-slate-200 rounded"></div>
          <div class="h-4 w-5/6 bg-slate-200 rounded"></div>
          <div class="h-5 w-1/2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Trạng thái lỗi / Chưa có dữ liệu -->
    <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-8 text-center space-y-3">
      <p class="font-semibold">{{ errorMessage }}</p>
      <button @click="fetchNewArrivals" class="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700">
        Thử tải lại
      </button>
    </div>

    <div v-else-if="displayedBooks.length === 0" class="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500">
      Hiện chưa có đầu sách mới nào được cập nhật.
    </div>

    <!-- Lưới Sách Mới (4 cột) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="book in displayedBooks"
        :key="book.bookId"
        @click="goToDetail(book.bookId)"
        class="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      >
        <!-- Ảnh bìa + Badge MỚI + Badge giảm giá -->
        <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden">
          <img
            :src="book.image || 'https://placehold.co/300x400?text=HAKITAHU+BOOK'"
            :alt="book.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerpolicy="no-referrer"
          />

          <span class="absolute top-3 left-3 bg-[#308ce8] text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            MỚI
          </span>

          <!-- Badge % giảm giá nếu sách đang thuộc chương trình khuyến mãi -->
          <span
            v-if="book.hasDiscount"
            class="absolute top-3 right-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md"
          >
            -{{ book.discountPercent }}%
          </span>

          <!-- Tag tên chương trình sale (nếu có) -->
          <span
            v-if="book.hasDiscount && book.promotionName"
            class="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg truncate"
          >
            {{ book.promotionName }}
          </span>

          <div v-if="book.quantity <= 0" class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span class="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase">
              Hết hàng
            </span>
          </div>
        </div>

        <!-- Thông tin sách -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <p class="text-[11px] font-extrabold text-[#308ce8] uppercase tracking-wide mb-1">
              {{ book.category?.categoryName || 'SÁCH MỚI' }}
            </p>
            <h3 class="text-base font-bold text-slate-800 line-clamp-2 group-hover:text-[#308ce8] transition-colors">
              {{ book.title }}
            </h3>
            <p class="text-xs text-slate-500 mt-1 truncate">
              {{ book.author || 'Đang cập nhật tác giả' }}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
            <div>
              <template v-if="book.hasDiscount">
                <span class="block text-xs text-slate-400 line-through">
                  {{ formatPrice(book.originalPrice) }}
                </span>
                <span class="text-lg font-extrabold text-rose-600 leading-tight">
                  {{ formatPrice(book.salePrice) }}
                </span>
              </template>
              <template v-else>
                <span class="text-lg font-extrabold text-[#ec5b13]">
                  {{ formatPrice(book.price) }}
                </span>
              </template>
              <p class="text-[11px] text-slate-400 mt-0.5">Còn {{ book.quantity ?? 0 }} cuốn</p>
            </div>

            <button
              @click.stop="addToCart(book)"
              :disabled="book.quantity <= 0"
              title="Thêm vào giỏ hàng"
              class="p-2.5 rounded-xl bg-[#308ce8]/10 text-[#308ce8] hover:bg-[#308ce8] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0"
            >
              <ShoppingCart class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nút Xem thêm mỗi lần +8 sản phẩm -->
    <div v-if="!isLoading && sortedBooks.length > visibleCount" class="text-center pt-4">
      <button
        @click="loadMore"
        class="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-[#308ce8] hover:text-[#308ce8] text-slate-700 font-bold text-sm rounded-xl shadow-sm transition-all"
      >
        <span>Xem thêm {{ Math.min(PAGE_SIZE, sortedBooks.length - visibleCount) }} sản phẩm</span>
        <span class="text-xs font-semibold text-slate-400">
          (còn {{ sortedBooks.length - visibleCount }})
        </span>
        <ChevronDown class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDown, ArrowUp, ArrowDown, Star, ShoppingCart } from 'lucide-vue-next';
import { BookService } from '../services/book.service';
import { PromotionService } from '../services/promotion.service';
import { applyPromotionsToBooks } from '../utils/promotion';

const router = useRouter();

const PAGE_SIZE = 8;

const books = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const sortBy = ref('newest');
const visibleCount = ref(PAGE_SIZE);

const loadMore = () => {
  visibleCount.value += PAGE_SIZE;
};

watch(sortBy, () => {
  visibleCount.value = PAGE_SIZE;
});

const fetchNewArrivals = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [bookRes, promoRes] = await Promise.all([
      BookService.getAllBooks(),
      PromotionService.getActivePromotions().catch(() => ({ data: [] }))
    ]);

    const rawBooks = Array.isArray(bookRes.data) ? bookRes.data : (Array.isArray(bookRes) ? bookRes : []);
    const activeBooks = rawBooks.filter((b) => b.status !== false);
    const activePromos = Array.isArray(promoRes.data) ? promoRes.data : [];

    // Gắn giá giảm từ chương trình khuyến mãi đang hoạt động vào từng cuốn sách
    books.value = applyPromotionsToBooks(activeBooks, activePromos);
  } catch (error) {
    console.error('Lỗi khi tải danh sách sách mới:', error);
    errorMessage.value = 'Không thể tải danh sách sách mới từ máy chủ. Vui lòng thử lại!';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchNewArrivals);

const sortedBooks = computed(() => {
  const list = [...books.value];

  if (sortBy.value === 'newest') {
    list.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return (b.bookId || 0) - (a.bookId || 0);
    });
  } else if (sortBy.value === 'price-asc') {
    list.sort((a, b) => (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0));
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0));
  } else if (sortBy.value === 'bestseller') {
    list.sort((a, b) => {
      const soldA = a.soldQuantity ?? a.sold ?? 0;
      const soldB = b.soldQuantity ?? b.sold ?? 0;
      if (soldB !== soldA) return soldB - soldA;
      return (a.quantity ?? 9999) - (b.quantity ?? 9999);
    });
  }

  return list;
});

const displayedBooks = computed(() => sortedBooks.value.slice(0, visibleCount.value));

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
};

const goToDetail = (bookId) => {
  router.push({ path: '/product-detail', query: { id: bookId } });
};

const addToCart = (book) => {
  const finalPrice = book.hasDiscount ? book.salePrice : book.price;
  alert(`Đã thêm "${book.title}" (${formatPrice(finalPrice)}) vào giỏ hàng!`);
};
</script>