<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg group">
        <div class="absolute inset-0 bg-cover bg-center"
          style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCx5fQ_x9VzF9X9VIVClgWG3u94kH4syH_9IJJ3umeJDymqFVapZWIBBg1CC1mU8kTpF7YPMUVK2YNX4C_QEeurji1bkXyTxDcf6kMFO_MKuNHQ7a84aWuyp0Zp5Ki58tqkiNxdHgj5uX1LptDU3jfidsR_nFRWjeTK82T_JAmUyFX6yMhwU80JwRi0p2SRNSYY9kPRyrmcDotNmBnkOsQFBwSQrlcEH-Xtf2XnPowVZCwsoP94uLGbBboMnKk2mKPWFhWPeuc7WXM')">
        </div>
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent flex flex-col justify-center px-8 lg:px-12 text-white">
          <span class="bg-[#308ce8] px-3 py-1 rounded-full text-xs font-bold w-fit mb-4 uppercase">
            {{ featuredPromotion ? 'CHƯƠNG TRÌNH ĐANG DIỄN RA' : 'SỰ KIỆN LỚN NHẤT NĂM' }}
          </span>

          <h1 class="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            <template v-if="featuredPromotion">
              {{ featuredPromotion.name }}<br />
              <span class="text-amber-300">{{ maxDiscountHeadline }}</span>
            </template>
            <template v-else>
              Hội sách Online<br />Ưu đãi ngập tràn
            </template>
          </h1>

          <p class="text-sm lg:text-lg text-slate-200 mb-6 lg:mb-8 max-w-md line-clamp-2">
            {{
              featuredPromotion?.description ||
              'Khám phá hàng ngàn tựa sách từ văn học, kinh tế đến kỹ năng sống với mức giá ưu đãi nhất.'
            }}
          </p>

          <button @click="router.push(featuredPromotion ? '/promotions' : '/categories')"
            class="bg-[#308ce8] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl w-fit transition-transform hover:scale-105">
            Mua ngay
          </button>
        </div>
      </div>

      <div class="hidden lg:flex flex-col gap-4">
        <div class="flex-1 bg-blue-500 rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer"
          @click="router.push('/new-arrivals')">
          <div class="relative z-10">
            <h3 class="text-xl font-bold mb-2">Sách Mới Mỗi Tuần</h3>
            <p class="text-blue-100 text-sm mb-4">Cập nhật những đầu sách hot nhất thị trường.</p>
            <span class="text-xs font-bold underline">Xem thêm</span>
          </div>
          <BookOpen
            class="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform" />
        </div>
        <div class="flex-1 bg-amber-500 rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer"
          @click="router.push('/promotions')">
          <div class="relative z-10">
            <h3 class="text-xl font-bold mb-2">Khuyến Mãi & Voucher</h3>
            <p class="text-amber-100 text-sm mb-4">
              {{
                promotions.length > 0
                  ? `Đang có ${promotions.length} chương trình giảm giá hấp dẫn.`
                  : 'Săn mã giảm giá và hàng loạt đầu sách ưu đãi mỗi ngày.'
              }}
            </p>
            <span class="text-xs font-bold underline">Xem ngay</span>
          </div>
          <Award
            class="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform" />
        </div>
      </div>
    </section>

    <!-- Flash Sale / Sách Nổi Bật Section -->
    <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div class="flex flex-wrap items-center gap-4">
          <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bolt class="w-6 h-6 text-[#308ce8] fill-[#308ce8]" />
            Sách Nổi Bật
          </h2>

          <!-- Đồng hồ đếm ngược thật từ chương trình khuyến mãi đang hoạt động -->
          <div v-if="countdownTarget && !countdown.expired"
            class="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-lg font-bold text-sm">
            <span>Kết thúc trong:</span>
            <span v-if="countdown.days > 0" class="bg-red-600 text-white px-1.5 py-0.5 rounded">
              {{ countdown.days }}d
            </span>
            <span class="bg-red-600 text-white px-1.5 py-0.5 rounded">{{ pad(countdown.hours) }}</span> :
            <span class="bg-red-600 text-white px-1.5 py-0.5 rounded">{{ pad(countdown.minutes) }}</span> :
            <span class="bg-red-600 text-white px-1.5 py-0.5 rounded">{{ pad(countdown.seconds) }}</span>
          </div>
        </div>

        <router-link :to="promotions.length > 0 ? '/promotions' : '/categories'"
          class="text-[#308ce8] font-semibold text-sm hover:underline flex items-center gap-1">
          Xem tất cả
          <ChevronRight class="w-4 h-4" />
        </router-link>
      </div>

      <!-- Loading hoặc Trống -->
      <div v-if="isLoading" class="py-12 text-center text-slate-400">Đang tải dữ liệu sách...</div>
      <div v-else-if="featuredBooks.length === 0" class="py-12 text-center text-slate-400">
        Chưa có sách nào trong hệ thống.
      </div>

      <!-- Danh sách Sách Nổi Bật từ Database -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div v-for="book in featuredBooks" :key="book.bookId" @click="goToDetail(book.bookId)"
          class="group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300">
          <div
            class="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100 group-hover:shadow-xl transition-shadow">
            <img :src="book.image || 'https://placehold.co/300x450?text=No+Image'" :alt="book.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerpolicy="no-referrer" />

            <!-- Tag Danh mục góc trên bên trái -->
            <div v-if="book.category"
              class="absolute top-2 left-2 bg-[#308ce8] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              {{ book.category.categoryName }}
            </div>

            <!-- Nhãn % giảm giá góc trên bên phải -->
            <div v-if="book.hasDiscount"
              class="absolute top-2 right-2 bg-rose-600 text-white text-[11px] font-black px-2 py-1 rounded-lg shadow-md">
              -{{ book.discountPercent }}%
            </div>

            <!-- Nhãn hết hàng nếu quantity <= 0 -->
            <div v-if="book.quantity <= 0" class="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span class="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase">Hết hàng</span>
            </div>

            <div v-else
              class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent">
              <button @click.stop="addToCart(book)"
                class="w-full bg-[#308ce8] text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-600">
                Thêm vào giỏ
              </button>
            </div>
          </div>

          <h3 class="text-sm font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-[#308ce8] transition-colors">
            {{ book.title }}
          </h3>
          <p class="text-xs text-slate-500 mb-2 truncate">{{ book.author }}</p>

          <!-- Giá gốc & giá sau giảm -->
          <div class="flex flex-wrap items-baseline gap-2 mb-2">
            <template v-if="book.hasDiscount">
              <span class="text-rose-600 font-extrabold">{{ formatPrice(book.salePrice) }}</span>
              <span class="text-xs text-slate-400 line-through">{{ formatPrice(book.originalPrice) }}</span>
            </template>
            <template v-else>
              <span class="text-[#308ce8] font-bold">{{ formatPrice(book.price) }}</span>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section>
      <div class="flex items-center justify-between mb-8 px-2">
        <h2 class="text-2xl font-bold text-slate-900">Sách Bán Chạy</h2>
        <div class="flex gap-2">
          <button @click="prevBestSellers" :disabled="bestSellerPage === 0"
            class="p-2 border border-slate-200 rounded-full hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors">
            <ArrowLeft class="w-4 h-4" />
          </button>
          <button @click="nextBestSellers" :disabled="bestSellerPage >= maxBestSellerPage"
            class="p-2 border border-slate-200 rounded-full hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors">
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="bestSellers.length === 0"
        class="py-8 text-center text-slate-400 bg-white rounded-xl border border-slate-100">
        Chưa có dữ liệu sách bán chạy.
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="book in bestSellers" :key="book.bookId" @click="goToDetail(book.bookId)"
          class="bg-white p-3 rounded-xl border border-slate-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col">
          <div class="relative aspect-[2/3] rounded-lg bg-slate-100 mb-3 overflow-hidden">
            <img :src="book.image || 'https://placehold.co/300x450?text=No+Image'" :alt="book.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform" referrerpolicy="no-referrer" />

            <!-- Nhãn % giảm giá -->
            <span v-if="book.hasDiscount"
              class="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
              -{{ book.discountPercent }}%
            </span>
          </div>

          <h4 class="text-xs font-bold mb-1 line-clamp-2 h-8">{{ book.title }}</h4>
          <p class="text-[10px] text-slate-500 mb-2 truncate">{{ book.author }}</p>

          <div class="mt-auto">
            <template v-if="book.hasDiscount">
              <p class="text-[11px] text-slate-400 line-through leading-none">{{ formatPrice(book.originalPrice) }}</p>
              <p class="text-sm font-extrabold text-rose-600">{{ formatPrice(book.salePrice) }}</p>
            </template>
            <template v-else>
              <p class="text-sm font-bold text-[#308ce8]">{{ formatPrice(book.price) }}</p>
            </template>

            <div class="mt-2 flex items-center gap-1">
              <Star class="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span class="text-[10px] text-slate-500">5.0 | Kho: {{ book.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bolt, ChevronRight, Star, ArrowLeft, ArrowRight, BookOpen, Award } from 'lucide-vue-next';
import { BookService } from '../services/book.service';
import { PromotionService } from '../services/promotion.service';
import { applyPromotionsToBooks } from '../utils/promotion';

const router = useRouter();
const books = ref([]);
const promotions = ref([]);
const isLoading = ref(true);

const bestSellerPage = ref(0);
const BEST_SELLER_SIZE = 6;

// Mốc thời gian hiện tại cho đồng hồ đếm ngược thật
const nowTick = ref(Date.now());
let timer;

// Lấy danh sách sách và các chương trình khuyến mãi đang chạy từ Database
const fetchHomeData = async () => {
  isLoading.value = true;
  try {
    const [bookRes, promoRes] = await Promise.all([
      BookService.getAllBooks(),
      PromotionService.getActivePromotions().catch(() => ({ data: [] }))
    ]);

    const activeBooks = (bookRes.data || []).filter(b => b.status === true);
    promotions.value = Array.isArray(promoRes.data) ? promoRes.data : [];

    books.value = applyPromotionsToBooks(activeBooks, promotions.value);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu ngoài trang chủ:', error);
  } finally {
    isLoading.value = false;
  }
};

// Sự kiện nổi bật cho Banner
const featuredPromotion = computed(() => promotions.value[0] || null);

const maxDiscountHeadline = computed(() => {
  const discounted = books.value.filter(b => b.hasDiscount);
  if (discounted.length > 0) {
    const maxPct = Math.max(...discounted.map(b => b.discountPercent));
    return `Giảm đến ${maxPct}%`;
  }
  if (featuredPromotion.value) {
    return featuredPromotion.value.discountType === 'PERCENT'
      ? `Giảm đến ${Number(featuredPromotion.value.discountValue)}%`
      : `Giảm ngay ${formatPrice(featuredPromotion.value.discountValue)}`;
  }
  return 'Ưu đãi đặc biệt';
});

// Đồng hồ đếm ngược theo sự kiện sắp kết thúc sớm nhất
const countdownTarget = computed(() => {
  if (promotions.value.length === 0) return null;
  return Math.min(...promotions.value.map(p => new Date(p.endDate).getTime()));
});

const countdown = computed(() => {
  if (!countdownTarget.value) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const diff = countdownTarget.value - nowTick.value;
  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    expired: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
});

const pad = (n) => String(n).padStart(2, '0');

// Sách nổi bật: ưu tiên sách đang có khuyến mãi trước, sau đó đến sách mới nhất (tối đa 5 cuốn)
const featuredBooks = computed(() => {
  return [...books.value]
    .sort((a, b) => {
      if (a.hasDiscount !== b.hasDiscount) return a.hasDiscount ? -1 : 1;
      if (b.discountPercent !== a.discountPercent) return b.discountPercent - a.discountPercent;
      return b.bookId - a.bookId;
    })
    .slice(0, 5);
});

// Sách bán chạy (phân trang 6 cuốn mỗi lần bấm mũi tên)
const maxBestSellerPage = computed(() => {
  return Math.max(0, Math.ceil(books.value.length / BEST_SELLER_SIZE) - 1);
});

const bestSellers = computed(() => {
  const start = bestSellerPage.value * BEST_SELLER_SIZE;
  return books.value.slice(start, start + BEST_SELLER_SIZE);
});

const prevBestSellers = () => {
  if (bestSellerPage.value > 0) bestSellerPage.value--;
};

const nextBestSellers = () => {
  if (bestSellerPage.value < maxBestSellerPage.value) bestSellerPage.value++;
};

// Hàm định dạng tiền tệ VNĐ
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
};

// Chuyển sang trang chi tiết sản phẩm
const goToDetail = (bookId) => {
  router.push({ path: '/product-detail', query: { id: bookId } });
};

onMounted(() => {
  fetchHomeData();
  timer = setInterval(() => {
    nowTick.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const addToCart = (book) => {
  const finalPrice = book.hasDiscount ? book.salePrice : book.price;
  alert(`Đã thêm "${book.title}" (${formatPrice(finalPrice)}) vào giỏ hàng!`);
};
</script>