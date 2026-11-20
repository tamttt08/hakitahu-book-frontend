<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
    <!-- 1. HERO BANNER (Tự động cập nhật theo sự kiện nổi bật nhất trong DB) -->
    <section
      class="relative rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-slate-800 via-slate-700 to-teal-700 text-white"
    >
      <div
        class="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
        style="background-image: url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80')"
      ></div>

      <div class="relative z-10 px-8 py-12 sm:px-14 sm:py-16 max-w-2xl space-y-5">
        <span
          class="inline-block bg-[#308ce8] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm"
        >
          {{ featuredPromotion ? 'CHƯƠNG TRÌNH ĐANG DIỄN RA' : 'SỰ KIỆN LỚN NHẤT NĂM' }}
        </span>

        <h1 class="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
          <template v-if="featuredPromotion">
            {{ featuredPromotion.name }}
            <span class="block text-amber-300 mt-1">{{ maxDiscountHeadline }}</span>
          </template>
          <template v-else>
            Hội sách Online
            <span class="block mt-1">Ưu đãi ngập tràn</span>
          </template>
        </h1>

        <p class="text-slate-100/90 text-sm sm:text-base leading-relaxed">
          {{
            featuredPromotion?.description ||
            'Khám phá hàng ngàn tựa sách từ văn học, kinh tế đến kỹ năng sống với mức giá ưu đãi nhất tại HAKITAHU BOOK.'
          }}
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-3">
          <button
            @click="scrollToSection('flash-sale-section')"
            class="bg-[#308ce8] hover:bg-blue-600 text-white font-bold px-7 py-3 rounded-full shadow-md transition-all"
          >
            Mua ngay
          </button>
          <button
            v-if="vouchers.length > 0"
            @click="scrollToSection('voucher-section')"
            class="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full border border-white/25 transition-all"
          >
            Săn {{ vouchers.length }} mã Voucher
          </button>
        </div>
      </div>
    </section>

    <!-- Trạng thái lỗi chung -->
    <div
      v-if="errorMessage"
      class="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center space-y-3"
    >
      <p class="font-semibold">{{ errorMessage }}</p>
      <button
        @click="fetchPromotionData"
        class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl"
      >
        Thử tải lại
      </button>
    </div>

    <!-- 2. KHO MÃ GIẢM GIÁ (VOUCHERS TỪ DB) -->
    <section id="voucher-section" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-orange-100 text-[#ec5b13] flex items-center justify-center">
            <Ticket class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-900">Kho Mã Giảm Giá</h2>
            <p class="text-xs sm:text-sm text-slate-500">
              Lưu mã ngay và áp dụng ở bước thanh toán để được giảm thêm trên tổng đơn hàng
            </p>
          </div>
        </div>
        <span v-if="!isLoading" class="text-xs font-bold text-slate-500">
          Hiện có <span class="text-[#ec5b13]">{{ vouchers.length }}</span> mã khả dụng
        </span>
      </div>

      <!-- Loading Voucher -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="n in 3"
          :key="n"
          class="h-36 bg-white rounded-2xl border border-slate-200 animate-pulse p-5"
        ></div>
      </div>

      <!-- Chưa có voucher -->
      <div
        v-else-if="vouchers.length === 0"
        class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm"
      >
        Hiện tại chưa có mã giảm giá nào đang hoạt động. Quay lại sau nhé!
      </div>

      <!-- Danh sách thẻ Voucher -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="v in vouchers"
          :key="v.voucherId"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex"
        >
          <!-- Cột trái màu cam nổi bật -->
          <div
            class="w-28 sm:w-32 bg-gradient-to-br from-[#ec5b13] to-orange-500 text-white p-4 flex flex-col items-center justify-center text-center shrink-0 border-r-2 border-dashed border-white/60"
          >
            <span class="text-[10px] font-bold uppercase tracking-wider opacity-90">VOUCHER</span>
            <span class="text-xl sm:text-2xl font-black mt-1 leading-none">
              {{ v.discountType === 'PERCENT' ? `-${Number(v.discountValue)}%` : formatShortMoney(v.discountValue) }}
            </span>
            <span class="text-[10px] mt-1.5 px-2 py-0.5 bg-black/15 rounded-full font-semibold">
              Còn {{ Math.max(0, v.quantity - (v.usedCount || 0)) }} lượt
            </span>
          </div>

          <!-- Cột phải thông tin & nút Copy -->
          <div class="p-4 flex-1 flex flex-col justify-between min-w-0 space-y-2.5">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono font-extrabold text-slate-900 text-base truncate">
                  {{ v.code }}
                </span>
                <button
                  @click="copyCode(v.code)"
                  :class="copiedCode === v.code
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-[#308ce8]/10 text-[#308ce8] hover:bg-[#308ce8] hover:text-white border-transparent'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shrink-0"
                >
                  <Check v-if="copiedCode === v.code" class="w-3.5 h-3.5" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedCode === v.code ? 'Đã chép' : 'Sao chép' }}</span>
                </button>
              </div>

              <p class="text-xs text-slate-600 mt-1">
                Đơn tối thiểu <span class="font-bold text-slate-800">{{ formatPrice(v.minOrderValue) }}</span>
                <span v-if="v.discountType === 'PERCENT' && v.maxDiscount">
                  • Giảm tối đa <span class="font-bold text-slate-800">{{ formatPrice(v.maxDiscount) }}</span>
                </span>
              </p>
            </div>

            <!-- Thanh tiến độ lượt dùng + HSD -->
            <div class="space-y-1">
              <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-[#ec5b13] rounded-full transition-all"
                  :style="{ width: `${getUsagePercent(v)}%` }"
                ></div>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Đã dùng {{ getUsagePercent(v) }}%</span>
                <span>HSD: {{ formatDate(v.endDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FLASH SALE / CHƯƠNG TRÌNH GIẢM GIÁ SẢN PHẨM (TỪ BẢNG PROMOTIONS) -->
    <section
      id="flash-sale-section"
      class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6"
    >
      <!-- Header Flash Sale + Đồng hồ đếm ngược -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-rose-50 text-[#ec5b13] flex items-center justify-center shrink-0">
            <Zap class="w-6 h-6 fill-[#ec5b13]" />
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900">
              {{ activePromotionObj ? activePromotionObj.name : 'Flash Sale & Sách Giảm Giá' }}
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              {{
                activePromotionObj?.description ||
                'Săn ngay các đầu sách đang được áp dụng giảm giá trực tiếp trong dịp khuyến mãi'
              }}
            </p>
          </div>
        </div>

        <!-- Đồng hồ đếm ngược thời gian kết thúc -->
        <div
          v-if="countdownTarget && !countdown.expired"
          class="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-2xl self-start lg:self-auto"
        >
          <Clock class="w-4 h-4 text-amber-400 shrink-0" />
          <span class="text-xs font-semibold text-slate-300 mr-1">Kết thúc sau:</span>
          <div class="flex items-center gap-1 font-mono font-extrabold text-sm">
            <span v-if="countdown.days > 0" class="bg-[#ec5b13] px-2 py-0.5 rounded-md">
              {{ countdown.days }}d
            </span>
            <span class="bg-white/15 px-2 py-0.5 rounded-md">{{ pad(countdown.hours) }}</span>
            <span>:</span>
            <span class="bg-white/15 px-2 py-0.5 rounded-md">{{ pad(countdown.minutes) }}</span>
            <span>:</span>
            <span class="bg-white/15 px-2 py-0.5 rounded-md">{{ pad(countdown.seconds) }}</span>
          </div>
        </div>
      </div>

      <!-- Bộ lọc chọn từng chương trình dịp lễ (hiện khi có từ 2 chương trình trở lên) -->
      <div v-if="promotions.length > 1" class="flex flex-wrap items-center gap-2">
        <button
          @click="selectedPromotionId = 'ALL'"
          :class="selectedPromotionId === 'ALL'
            ? 'bg-[#308ce8] text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all"
        >
          Tất cả ưu đãi ({{ allDiscountedBooks.length }})
        </button>

        <button
          v-for="p in promotions"
          :key="p.promotionId"
          @click="selectedPromotionId = p.promotionId"
          :class="selectedPromotionId === p.promotionId
            ? 'bg-[#308ce8] text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>{{ p.name }}</span>
          <span class="opacity-80 text-[11px]">
            ({{ p.discountType === 'PERCENT' ? `-${Number(p.discountValue)}%` : `-${formatShortMoney(p.discountValue)}` }})
          </span>
        </button>
      </div>

      <!-- Loading sản phẩm -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="n in 4"
          :key="n"
          class="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
        >
          <div class="aspect-[3/4] bg-slate-200"></div>
          <div class="p-4 space-y-3">
            <div class="h-3 w-1/3 bg-slate-200 rounded"></div>
            <div class="h-4 w-5/6 bg-slate-200 rounded"></div>
            <div class="h-5 w-1/2 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Không có sách giảm giá -->
      <div
        v-else-if="displayedBooks.length === 0"
        class="py-12 text-center text-slate-500 space-y-3"
      >
        <p class="text-sm font-medium">Hiện chưa có sản phẩm nào nằm trong chương trình giảm giá.</p>
        <router-link
          to="/new-arrivals"
          class="inline-block px-5 py-2.5 bg-[#308ce8] hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Khám phá Sách Mới Cập Nhật
        </router-link>
      </div>

      <!-- Lưới sản phẩm đang giảm giá (4 cột) -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="item in displayedBooks"
          :key="item.book.bookId"
          @click="goToDetail(item.book.bookId)"
          class="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
        >
          <!-- Ảnh bìa + Nhãn giảm giá -->
          <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden">
            <img
              :src="item.book.image || 'https://placehold.co/300x400?text=HAKITAHU+BOOK'"
              :alt="item.book.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerpolicy="no-referrer"
            />

            <!-- Badge phần trăm giảm -->
            <span
              class="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md"
            >
              -{{ item.discountPercent }}%
            </span>

            <!-- Badge tên dịp lễ -->
            <span
              class="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg truncate"
            >
              {{ item.promotionName }}
            </span>

            <div
              v-if="item.book.quantity <= 0"
              class="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <span class="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase">
                Hết hàng
              </span>
            </div>
          </div>

          <!-- Thông tin sách & Giá gốc / Giá sale -->
          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <p class="text-[11px] font-extrabold text-[#308ce8] uppercase tracking-wide mb-1">
                {{ item.book.category?.categoryName || 'ƯU ĐÃI' }}
              </p>
              <h3
                class="text-base font-bold text-slate-800 line-clamp-2 group-hover:text-[#308ce8] transition-colors"
              >
                {{ item.book.title }}
              </h3>
              <p class="text-xs text-slate-500 mt-1 truncate">
                {{ item.book.author || 'Đang cập nhật tác giả' }}
              </p>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
              <div>
                <span class="block text-xs text-slate-400 line-through">
                  {{ formatPrice(item.originalPrice) }}
                </span>
                <span class="text-lg font-black text-rose-600 leading-tight">
                  {{ formatPrice(item.salePrice) }}
                </span>
              </div>

              <button
                @click.stop="addToCart(item)"
                :disabled="item.book.quantity <= 0"
                title="Thêm vào giỏ hàng"
                class="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0"
              >
                <ShoppingCart class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nút Xem thêm (mỗi lần +8 sản phẩm) -->
      <div v-if="!isLoading && filteredBooks.length > visibleCount" class="text-center pt-2">
        <button
          @click="visibleCount += PAGE_SIZE"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 hover:border-[#308ce8] hover:text-[#308ce8] text-slate-700 font-bold text-sm rounded-xl transition-all"
        >
          <span>Xem thêm {{ Math.min(PAGE_SIZE, filteredBooks.length - visibleCount) }} sản phẩm giảm giá</span>
          <ChevronDown class="w-4 h-4" />
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Zap, Ticket, Copy, Check, Clock, ShoppingCart, Sparkles, ChevronDown } from 'lucide-vue-next';
import { VoucherService } from '../services/voucher.service';
import { PromotionService } from '../services/promotion.service';

const router = useRouter();

const PAGE_SIZE = 8;
const vouchers = ref([]);
const promotions = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const selectedPromotionId = ref('ALL');
const visibleCount = ref(PAGE_SIZE);
const copiedCode = ref('');

// Đồng hồ đếm ngược
const nowTick = ref(Date.now());
let tickTimer = null;

const fetchPromotionData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [voucherRes, promoRes] = await Promise.all([
      VoucherService.getActiveVouchers(),
      PromotionService.getActivePromotions()
    ]);
    vouchers.value = Array.isArray(voucherRes.data) ? voucherRes.data : [];
    promotions.value = Array.isArray(promoRes.data) ? promoRes.data : [];
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu khuyến mãi:', error);
    errorMessage.value = 'Không thể tải danh sách khuyến mãi từ máy chủ. Vui lòng thử lại!';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPromotionData();
  tickTimer = setInterval(() => {
    nowTick.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(tickTimer);
});

watch(selectedPromotionId, () => {
  visibleCount.value = PAGE_SIZE;
});

// Tính giá sau giảm cho 1 sách trong 1 chương trình
const calculateDiscountedItem = (book, promo) => {
  const originalPrice = Number(book.price || 0);
  const value = Number(promo.discountValue || 0);
  let salePrice = originalPrice;

  if (promo.discountType === 'PERCENT') {
    salePrice = Math.max(0, Math.round((originalPrice * (100 - value)) / 100));
  } else {
    salePrice = Math.max(0, originalPrice - value);
  }

  const discountPercent =
    originalPrice > 0 ? Math.max(1, Math.round(((originalPrice - salePrice) / originalPrice) * 100)) : 0;

  return {
    book,
    originalPrice,
    salePrice,
    discountPercent,
    promotionId: promo.promotionId,
    promotionName: promo.name,
    endDate: promo.endDate
  };
};

// Gom toàn bộ sách đang giảm giá (nếu 1 sách thuộc nhiều chương trình thì giữ mức giá thấp nhất)
const allDiscountedBooks = computed(() => {
  const bestByBookId = new Map();

  promotions.value.forEach((promo) => {
    (promo.books || []).forEach((book) => {
      if (book.status === false) return;
      const item = calculateDiscountedItem(book, promo);
      const existing = bestByBookId.get(book.bookId);
      if (!existing || item.salePrice < existing.salePrice) {
        bestByBookId.set(book.bookId, item);
      }
    });
  });

  return Array.from(bestByBookId.values()).sort((a, b) => b.discountPercent - a.discountPercent);
});

// Chương trình đang chọn ở thanh tab lọc
const activePromotionObj = computed(() => {
  if (selectedPromotionId.value === 'ALL') {
    return promotions.value.length === 1 ? promotions.value[0] : null;
  }
  return promotions.value.find((p) => p.promotionId === selectedPromotionId.value) || null;
});

// Danh sách sách hiển thị theo bộ lọc chương trình
const filteredBooks = computed(() => {
  if (selectedPromotionId.value === 'ALL') {
    return allDiscountedBooks.value;
  }
  const promo = promotions.value.find((p) => p.promotionId === selectedPromotionId.value);
  if (!promo) return [];
  return (promo.books || [])
    .filter((b) => b.status !== false)
    .map((b) => calculateDiscountedItem(b, promo));
});

const displayedBooks = computed(() => filteredBooks.value.slice(0, visibleCount.value));

// Sự kiện nổi bật cho Banner chính
const featuredPromotion = computed(() => promotions.value[0] || null);

const maxDiscountHeadline = computed(() => {
  if (allDiscountedBooks.value.length > 0) {
    const maxPct = Math.max(...allDiscountedBooks.value.map((i) => i.discountPercent));
    return `Giảm đến ${maxPct}%`;
  }
  if (featuredPromotion.value) {
    return featuredPromotion.value.discountType === 'PERCENT'
      ? `Giảm đến ${Number(featuredPromotion.value.discountValue)}%`
      : `Giảm ngay ${formatPrice(featuredPromotion.value.discountValue)}`;
  }
  return 'Ưu đãi đặc biệt';
});

// Thời gian đích cho đồng hồ đếm ngược (ưu tiên sự kiện đang chọn hoặc sự kiện sắp kết thúc sớm nhất)
const countdownTarget = computed(() => {
  if (activePromotionObj.value?.endDate) {
    return new Date(activePromotionObj.value.endDate).getTime();
  }
  if (promotions.value.length > 0) {
    return Math.min(...promotions.value.map((p) => new Date(p.endDate).getTime()));
  }
  return null;
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

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    copiedCode.value = code;
    setTimeout(() => {
      if (copiedCode.value === code) copiedCode.value = '';
    }, 2000);
  } catch (e) {
    alert(`Mã giảm giá của bạn là: ${code}`);
  }
};

const getUsagePercent = (v) => {
  if (!v.quantity) return 0;
  return Math.min(100, Math.round(((v.usedCount || 0) / v.quantity) * 100));
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
};

const formatShortMoney = (amount) => {
  const num = Number(amount || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}Tr`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return `${num}đ`;
};

const formatDate = (val) => {
  if (!val) return '-';
  return new Date(val).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const goToDetail = (bookId) => {
  router.push({ path: '/product-detail', query: { id: bookId } });
};

const addToCart = (item) => {
  alert(`Đã thêm "${item.book.title}" (giá ưu đãi ${formatPrice(item.salePrice)}) vào giỏ hàng!`);
};
</script>