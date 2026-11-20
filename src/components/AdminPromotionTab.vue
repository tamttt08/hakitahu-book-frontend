<template>
  <div>
    <!-- Thanh tìm kiếm & Nút tạo mới -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div class="relative w-full sm:w-96">
        <Search class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input v-model="searchQuery" type="text" placeholder="Tìm chương trình (VD: Sale 20/11, Black Friday)..."
          class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/30 focus:border-[#ec5b13] outline-none transition-all" />
      </div>

      <button @click="openAddModal"
        class="flex items-center gap-2 bg-[#ec5b13] hover:bg-[#d44d0c] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#ec5b13]/25 transition-all">
        <Plus class="w-5 h-5" /> Tạo chương trình giảm giá
      </button>
    </div>

    <!-- Bảng danh sách chương trình giảm giá -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th class="py-4 px-6">CHƯƠNG TRÌNH</th>
            <th class="py-4 px-6">MỨC GIẢM</th>
            <th class="py-4 px-6">SẢN PHẨM ÁP DỤNG</th>
            <th class="py-4 px-6">THỜI GIAN</th>
            <th class="py-4 px-6">TRẠNG THÁI</th>
            <th class="py-4 px-6 text-right">THAO TÁC</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm">
          <tr v-if="isLoading">
            <td colspan="6" class="py-10 text-center text-slate-400">Đang tải danh sách chương trình...</td>
          </tr>
          <tr v-else-if="filteredPromotions.length === 0">
            <td colspan="6" class="py-10 text-center text-slate-400">Chưa có chương trình giảm giá nào.</td>
          </tr>
          <tr v-else v-for="p in filteredPromotions" :key="p.promotionId" class="hover:bg-slate-50/60 transition-colors">
            <td class="py-4 px-6 max-w-xs">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles class="w-5 h-5" />
                </div>
                <div class="min-w-0">
                  <p class="font-extrabold text-slate-900 truncate">{{ p.name }}</p>
                  <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ p.description || 'Không có mô tả' }}</p>
                </div>
              </div>
            </td>

            <td class="py-4 px-6">
              <span class="font-extrabold text-rose-600 text-base">
                {{ p.discountType === 'PERCENT' ? `-${Number(p.discountValue)}%` : `-${formatPrice(p.discountValue)}` }}
              </span>
              <span class="block text-[11px] text-slate-400 font-semibold">
                {{ p.discountType === 'PERCENT' ? 'Giảm phần trăm' : 'Giảm trực tiếp' }}
              </span>
            </td>

            <td class="py-4 px-6">
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-[#308ce8] text-xs font-bold">
                {{ p.books?.length || 0 }} đầu sách
              </span>
            </td>

            <td class="py-4 px-6 text-xs text-slate-600 space-y-1">
              <div><span class="text-slate-400">Từ:</span> <span class="font-semibold">{{ formatDateTime(p.startDate) }}</span></div>
              <div><span class="text-slate-400">Đến:</span> <span class="font-semibold">{{ formatDateTime(p.endDate) }}</span></div>
            </td>

            <td class="py-4 px-6">
              <span :class="getStatusInfo(p).badgeClass"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold">
                <span>•</span>
                <span>{{ getStatusInfo(p).label }}</span>
              </span>
            </td>

            <td class="py-4 px-6 text-right">
              <div class="flex justify-end gap-1">
                <button @click="openEditModal(p)" title="Chỉnh sửa"
                  class="p-2 text-slate-400 hover:text-[#ec5b13] hover:bg-[#ec5b13]/10 rounded-lg transition-colors">
                  <Edit3 class="w-5 h-5" />
                </button>
                <button @click="handleDelete(p)" title="Xóa chương trình"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tạo / Cập nhật Chương trình giảm giá -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">
            {{ isEditing ? 'Cập nhật chương trình giảm giá' : 'Tạo chương trình giảm giá dịp lễ' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-5 max-h-[84vh] overflow-y-auto">
          <!-- Thông tin chương trình -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-bold text-slate-700 mb-1">
                Tên chương trình <span class="text-red-500">*</span>
              </label>
              <input v-model="form.name" type="text" required placeholder="VD: Siêu Sale Ngày Nhà Giáo 20/11"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-bold text-slate-700 mb-1">Mô tả ngắn</label>
              <input v-model="form.description" type="text" placeholder="VD: Giảm sâu hàng loạt đầu sách văn học và kỹ năng..."
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">
                Loại giảm giá <span class="text-red-500">*</span>
              </label>
              <select v-model="form.discountType" required
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none">
                <option value="PERCENT">Giảm theo phần trăm (%)</option>
                <option value="FIXED">Giảm tiền cố định (VNĐ)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">
                {{ form.discountType === 'PERCENT' ? 'Mức giảm (%)' : 'Số tiền giảm (VNĐ)' }}
                <span class="text-red-500">*</span>
              </label>
              <input v-model.number="form.discountValue" type="number" required min="1"
                :max="form.discountType === 'PERCENT' ? 100 : undefined"
                :placeholder="form.discountType === 'PERCENT' ? 'VD: 20' : 'VD: 30000'"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">
                Thời gian bắt đầu <span class="text-red-500">*</span>
              </label>
              <input v-model="form.startDate" type="datetime-local" required
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">
                Thời gian kết thúc <span class="text-red-500">*</span>
              </label>
              <input v-model="form.endDate" type="datetime-local" required
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
            </div>
          </div>

          <!-- Khu vực chọn sản phẩm áp dụng -->
          <div class="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label class="text-sm font-extrabold text-slate-800">
                Chọn sách áp dụng <span class="text-red-500">*</span>
                <span class="ml-1.5 text-xs font-bold text-[#ec5b13]">(Đã chọn {{ form.bookIds.length }} cuốn)</span>
              </label>

              <div class="flex items-center gap-2">
                <button type="button" @click="selectAllFilteredBooks"
                  class="text-xs font-bold text-[#308ce8] hover:underline">
                  Chọn tất cả đang lọc
                </button>
                <span class="text-slate-300">|</span>
                <button type="button" @click="deselectAllFilteredBooks"
                  class="text-xs font-bold text-slate-500 hover:text-red-600 hover:underline">
                  Bỏ chọn đang lọc
                </button>
              </div>
            </div>

            <!-- Bộ lọc tìm sách trong Modal -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input v-model="bookSearch" type="text" placeholder="Tìm nhanh tên sách, tác giả..."
                class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-[#ec5b13] outline-none" />
              <select v-model="bookCategoryFilter"
                class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-[#ec5b13] outline-none">
                <option value="">Tất cả danh mục</option>
                <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
                  {{ cat.categoryName }}
                </option>
              </select>
            </div>

            <!-- Danh sách sách để tick chọn -->
            <div class="max-h-60 overflow-y-auto divide-y divide-slate-100 bg-white rounded-xl border border-slate-200">
              <div v-if="filteredModalBooks.length === 0" class="p-6 text-center text-xs text-slate-400">
                Không có cuốn sách nào khớp bộ lọc.
              </div>
              <label v-for="book in filteredModalBooks" :key="book.bookId"
                class="flex items-center gap-3 p-2.5 hover:bg-orange-50/40 cursor-pointer transition-colors">
                <input type="checkbox" :value="book.bookId" v-model="form.bookIds"
                  class="w-4 h-4 accent-[#ec5b13] rounded cursor-pointer shrink-0" />
                <img :src="book.image || 'https://placehold.co/40x56?text=Book'" :alt="book.title"
                  class="w-9 h-12 object-cover rounded-md border border-slate-200 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">{{ book.title }}</p>
                  <p class="text-[11px] text-slate-400 truncate">
                    {{ book.category?.categoryName || 'Chưa phân loại' }} • {{ book.author }}
                  </p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-[11px] text-slate-400 line-through">{{ formatPrice(book.price) }}</p>
                  <p class="text-xs font-extrabold text-rose-600">{{ formatPrice(calcPreviewSalePrice(book.price)) }}</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Bật / Tắt trạng thái -->
          <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span class="text-sm font-bold text-slate-700 block">Kích hoạt chương trình</span>
              <span class="text-xs text-slate-400">Tắt để dừng giảm giá ngay lập tức mà không cần xóa sự kiện</span>
            </div>
            <input type="checkbox" v-model="form.status" class="w-5 h-5 accent-[#ec5b13] cursor-pointer" />
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" @click="showModal = false"
              class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
              Hủy bỏ
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-5 py-2.5 text-sm font-bold text-white bg-[#ec5b13] hover:bg-[#d44d0c] rounded-xl shadow-lg shadow-[#ec5b13]/25 disabled:opacity-50">
              {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật chương trình' : 'Tạo chương trình') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Edit3, Trash2, Sparkles } from 'lucide-vue-next';
import { PromotionService } from '../services/promotion.service';
import { BookService } from '../services/book.service';
import { CategoryService } from '../services/category.service';

const promotions = ref([]);
const allBooks = ref([]);
const categories = ref([]);

const searchQuery = ref('');
const bookSearch = ref('');
const bookCategoryFilter = ref('');

const isLoading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const form = ref({
  promotionId: null,
  name: '',
  description: '',
  discountType: 'PERCENT',
  discountValue: 15,
  startDate: '',
  endDate: '',
  status: true,
  bookIds: []
});

const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    const [promoRes, bookRes, catRes] = await Promise.all([
      PromotionService.getAllPromotions(),
      BookService.getAllBooks(),
      CategoryService.getAllCategories()
    ]);

    promotions.value = Array.isArray(promoRes.data) ? promoRes.data : [];
    const rawBooks = Array.isArray(bookRes.data) ? bookRes.data : (Array.isArray(bookRes) ? bookRes : []);
    allBooks.value = rawBooks.filter(b => b.status !== false);
    const rawCats = Array.isArray(catRes.data) ? catRes.data : (Array.isArray(catRes) ? catRes : []);
    categories.value = rawCats.filter(c => c.status !== false);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu chương trình khuyến mãi:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchInitialData);

const filteredPromotions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return promotions.value;
  return promotions.value.filter(p =>
    p.name?.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  );
});

const filteredModalBooks = computed(() => {
  const q = bookSearch.value.toLowerCase().trim();
  return allBooks.value.filter(b => {
    const matchCat = !bookCategoryFilter.value || b.category?.categoryId === Number(bookCategoryFilter.value);
    const matchText = !q ||
      b.title?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q);
    return matchCat && matchText;
  });
});

const selectAllFilteredBooks = () => {
  const set = new Set(form.value.bookIds);
  filteredModalBooks.value.forEach(b => set.add(b.bookId));
  form.value.bookIds = Array.from(set);
};

const deselectAllFilteredBooks = () => {
  const removeIds = new Set(filteredModalBooks.value.map(b => b.bookId));
  form.value.bookIds = form.value.bookIds.filter(id => !removeIds.has(id));
};

const calcPreviewSalePrice = (price) => {
  const p = Number(price || 0);
  const val = Number(form.value.discountValue || 0);
  if (form.value.discountType === 'PERCENT') {
    return Math.max(0, Math.round((p * (100 - val)) / 100));
  }
  return Math.max(0, p - val);
};

const toDateTimeLocal = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const toIsoLocalDateTime = (val) => {
  if (!val) return null;
  return val.length === 16 ? `${val}:00` : val;
};

const formatDateTime = (val) => {
  if (!val) return '-';
  return new Date(val).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
};

const getStatusInfo = (p) => {
  const now = new Date();
  const start = new Date(p.startDate);
  const end = new Date(p.endDate);

  if (p.status === false) return { label: 'Đã ngưng', badgeClass: 'bg-slate-100 text-slate-500' };
  if (now > end) return { label: 'Đã kết thúc', badgeClass: 'bg-red-50 text-red-600' };
  if (now < start) return { label: 'Sắp diễn ra', badgeClass: 'bg-blue-50 text-[#308ce8]' };
  return { label: 'Đang diễn ra', badgeClass: 'bg-emerald-50 text-emerald-600' };
};

const openAddModal = () => {
  isEditing.value = false;
  bookSearch.value = '';
  bookCategoryFilter.value = '';

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  form.value = {
    promotionId: null,
    name: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: 15,
    startDate: toDateTimeLocal(now),
    endDate: toDateTimeLocal(nextWeek),
    status: true,
    bookIds: []
  };
  showModal.value = true;
};

const openEditModal = (p) => {
  isEditing.value = true;
  bookSearch.value = '';
  bookCategoryFilter.value = '';

  form.value = {
    promotionId: p.promotionId,
    name: p.name,
    description: p.description || '',
    discountType: p.discountType,
    discountValue: Number(p.discountValue),
    startDate: toDateTimeLocal(p.startDate),
    endDate: toDateTimeLocal(p.endDate),
    status: p.status !== false,
    bookIds: (p.books || []).map(b => b.bookId)
  };
  showModal.value = true;
};

const submitForm = async () => {
  if (form.value.bookIds.length === 0) {
    alert('Vui lòng chọn ít nhất 1 cuốn sách áp dụng khuyến mãi!');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description?.trim() || '',
      discountType: form.value.discountType,
      discountValue: form.value.discountValue,
      startDate: toIsoLocalDateTime(form.value.startDate),
      endDate: toIsoLocalDateTime(form.value.endDate),
      status: form.value.status,
      bookIds: form.value.bookIds
    };

    if (isEditing.value) {
      await PromotionService.updatePromotion(form.value.promotionId, payload);
    } else {
      await PromotionService.createPromotion(payload);
    }

    showModal.value = false;
    await fetchInitialData();
  } catch (error) {
    console.error('Lỗi khi lưu chương trình khuyến mãi:', error);
    const msg = error.response?.data?.message || error.response?.data || 'Không thể lưu chương trình!';
    alert(typeof msg === 'string' ? msg : 'Dữ liệu không hợp lệ!');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (p) => {
  if (!confirm(`Cậu có chắc muốn xóa chương trình "${p.name}" không?`)) return;
  try {
    await PromotionService.deletePromotion(p.promotionId);
    await fetchInitialData();
  } catch (error) {
    console.error('Lỗi khi xóa chương trình:', error);
    alert('Không thể xóa chương trình khuyến mãi này!');
  }
};
</script>