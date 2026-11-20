<template>
    <div class="flex min-h-screen bg-[#f8f9fa]">
        <AdminSidebar />

        <main class="flex-1 p-8 min-w-0">
            <!-- Header chung của trang -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 class="text-2xl font-extrabold text-slate-900">Quản lý Khuyến mãi</h1>
                    <p class="text-xs text-slate-500 mt-1">
                        Quản lý mã giảm giá đơn hàng (Voucher) và chương trình giảm giá sản phẩm theo dịp lễ
                    </p>
                </div>
                <router-link to="/" class="text-sm font-bold text-slate-700 hover:text-[#ec5b13] transition-colors">
                    Về cửa hàng
                </router-link>
            </div>

            <!-- Thanh chuyển 2 Tab: Voucher & Sale sản phẩm -->
            <div class="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 pb-3">
                <button @click="activeTab = 'vouchers'" :class="activeTab === 'vouchers'
                    ? 'bg-[#ec5b13] text-white shadow-md shadow-[#ec5b13]/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
                    <Ticket class="w-4 h-4" />
                    <span>Mã giảm giá (Voucher)</span>
                </button>

                <button @click="activeTab = 'promotions'" :class="activeTab === 'promotions'
                    ? 'bg-[#ec5b13] text-white shadow-md shadow-[#ec5b13]/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
                    <Sparkles class="w-4 h-4" />
                    <span>Giảm giá sản phẩm</span>
                </button>
            </div>

            <!-- TAB 1: QUẢN LÝ VOUCHER -->
            <div v-if="activeTab === 'vouchers'">
                <!-- Thanh tìm kiếm & Nút thêm Voucher -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div class="relative w-full sm:w-96">
                        <Search class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input v-model="searchQuery" type="text" placeholder="Tìm theo mã voucher (VD: SALE10)..."
                            class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/30 focus:border-[#ec5b13] outline-none transition-all" />
                    </div>
                    <button @click="openAddModal"
                        class="flex items-center gap-2 bg-[#ec5b13] hover:bg-[#d44d0c] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#ec5b13]/25 transition-all">
                        <Plus class="w-5 h-5" /> Thêm mã giảm giá
                    </button>
                </div>

                <!-- Bảng danh sách Voucher -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th class="py-4 px-6">MÃ VOUCHER</th>
                                <th class="py-4 px-6">MỨC GIẢM & ĐIỀU KIỆN</th>
                                <th class="py-4 px-6">LƯỢT DÙNG</th>
                                <th class="py-4 px-6">THỜI GIAN ÁP DỤNG</th>
                                <th class="py-4 px-6">TRẠNG THÁI</th>
                                <th class="py-4 px-6 text-right">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm">
                            <tr v-if="isLoading">
                                <td colspan="6" class="py-10 text-center text-slate-400">Đang tải danh sách khuyến mãi...</td>
                            </tr>
                            <tr v-else-if="filteredVouchers.length === 0">
                                <td colspan="6" class="py-10 text-center text-slate-400">Chưa có mã khuyến mãi nào phù hợp.</td>
                            </tr>
                            <tr v-else v-for="v in filteredVouchers" :key="v.voucherId"
                                class="hover:bg-slate-50/60 transition-colors">
                                <!-- Mã Voucher -->
                                <td class="py-4 px-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-xl bg-orange-50 text-[#ec5b13] flex items-center justify-center shrink-0">
                                            <Ticket class="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span class="font-extrabold text-slate-900 tracking-wide font-mono text-base">
                                                {{ v.code }}
                                            </span>
                                            <span class="block text-[11px] font-bold uppercase text-slate-400">
                                                {{ v.discountType === 'PERCENT' ? 'Giảm theo %' : 'Giảm tiền trực tiếp' }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <!-- Mức giảm & Điều kiện -->
                                <td class="py-4 px-6">
                                    <div class="font-extrabold text-[#ec5b13]">
                                        {{ v.discountType === 'PERCENT' ? `Giảm ${Number(v.discountValue)}%` : `Giảm ${formatPrice(v.discountValue)}` }}
                                    </div>
                                    <div class="text-xs text-slate-500 mt-0.5 space-y-0.5">
                                        <p>Đơn tối thiểu: <span class="font-semibold text-slate-700">{{ formatPrice(v.minOrderValue) }}</span></p>
                                        <p v-if="v.discountType === 'PERCENT' && v.maxDiscount">
                                            Giảm tối đa: <span class="font-semibold text-slate-700">{{ formatPrice(v.maxDiscount) }}</span>
                                        </p>
                                    </div>
                                </td>

                                <!-- Lượt sử dụng -->
                                <td class="py-4 px-6">
                                    <div class="w-28 space-y-1.5">
                                        <div class="flex justify-between text-xs font-bold text-slate-700">
                                            <span>{{ v.usedCount || 0 }} / {{ v.quantity }}</span>
                                            <span class="text-slate-400">{{ getUsagePercent(v) }}%</span>
                                        </div>
                                        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div class="h-full bg-[#ec5b13] rounded-full transition-all"
                                                :style="{ width: `${getUsagePercent(v)}%` }"></div>
                                        </div>
                                    </div>
                                </td>

                                <!-- Thời gian -->
                                <td class="py-4 px-6 text-xs text-slate-600 space-y-1">
                                    <div><span class="text-slate-400">Từ:</span> <span class="font-semibold">{{ formatDateTime(v.startDate) }}</span></div>
                                    <div><span class="text-slate-400">Đến:</span> <span class="font-semibold">{{ formatDateTime(v.endDate) }}</span></div>
                                </td>

                                <!-- Trạng thái thực tế -->
                                <td class="py-4 px-6">
                                    <span :class="getVoucherStatusInfo(v).badgeClass"
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold">
                                        <span>•</span>
                                        <span>{{ getVoucherStatusInfo(v).label }}</span>
                                    </span>
                                </td>

                                <!-- Thao tác -->
                                <td class="py-4 px-6 text-right">
                                    <div class="flex justify-end gap-1">
                                        <button @click="openEditModal(v)" title="Chỉnh sửa"
                                            class="p-2 text-slate-400 hover:text-[#ec5b13] hover:bg-[#ec5b13]/10 rounded-lg transition-colors">
                                            <Edit3 class="w-5 h-5" />
                                        </button>
                                        <button @click="handleDelete(v)" title="Xóa mã"
                                            class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 class="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Modal Thêm / Cập nhật Voucher -->
                <div v-if="showModal"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
                        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 class="text-lg font-bold text-slate-800">
                                {{ isEditing ? 'Cập nhật mã khuyến mãi' : 'Tạo mã khuyến mãi mới' }}
                            </h3>
                            <button @click="showModal = false"
                                class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
                        </div>

                        <form @submit.prevent="submitForm" class="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">
                                        Mã Voucher <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="form.code"
                                        @input="form.code = form.code.toUpperCase().replace(/\s+/g, '')" type="text"
                                        required placeholder="VD: SALE20, HAKITAHU50K"
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold uppercase focus:border-[#ec5b13] outline-none" />
                                </div>

                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">
                                        Loại giảm giá <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.discountType" required
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none">
                                        <option value="PERCENT">Phần trăm (%)</option>
                                        <option value="FIXED">Số tiền cố định (VNĐ)</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">
                                        {{ form.discountType === 'PERCENT' ? 'Mức giảm (%)' : 'Số tiền giảm (VNĐ)' }}
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.number="form.discountValue" type="number" required min="1"
                                        :max="form.discountType === 'PERCENT' ? 100 : undefined"
                                        :placeholder="form.discountType === 'PERCENT' ? 'VD: 15' : 'VD: 50000'"
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                                </div>

                                <div v-if="form.discountType === 'PERCENT'">
                                    <label class="block text-sm font-bold text-slate-700 mb-1">Giảm tối đa (VNĐ)</label>
                                    <input v-model.number="form.maxDiscount" type="number" min="0"
                                        placeholder="Bỏ trống nếu không giới hạn"
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                                </div>

                                <div v-else>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">
                                        Tổng lượt sử dụng <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.number="form.quantity" type="number" required min="1"
                                        placeholder="VD: 100"
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">Giá trị đơn tối thiểu (VNĐ)</label>
                                    <input v-model.number="form.minOrderValue" type="number" min="0"
                                        placeholder="VD: 100000"
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                                </div>

                                <div v-if="form.discountType === 'PERCENT'">
                                    <label class="block text-sm font-bold text-slate-700 mb-1">
                                        Tổng lượt sử dụng <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.number="form.quantity" type="number" required min="1"
                                        placeholder="VD: 100"
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">
                                        Ngày bắt đầu <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="form.startDate" type="datetime-local" required
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                                </div>

                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">
                                        Ngày kết thúc <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="form.endDate" type="datetime-local" required
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                <div>
                                    <span class="text-sm font-bold text-slate-700 block">Kích hoạt mã khuyến mãi</span>
                                    <span class="text-xs text-slate-400">Tắt để tạm ngưng áp dụng mã này ngoài cửa hàng</span>
                                </div>
                                <input type="checkbox" v-model="form.status"
                                    class="w-5 h-5 accent-[#ec5b13] cursor-pointer" />
                            </div>

                            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" @click="showModal = false"
                                    class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
                                    Hủy bỏ
                                </button>
                                <button type="submit" :disabled="isSubmitting"
                                    class="px-5 py-2.5 text-sm font-bold text-white bg-[#ec5b13] hover:bg-[#d44d0c] rounded-xl shadow-lg shadow-[#ec5b13]/25 disabled:opacity-50">
                                    {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mã') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- TAB 2: QUẢN LÝ GIẢM GIÁ SẢN PHẨM (SALE DỊP LỄ) -->
            <AdminPromotionTab v-else />
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Edit3, Trash2, Ticket, Sparkles } from 'lucide-vue-next';
import AdminPromotionTab from '../components/AdminPromotionTab.vue';
import AdminSidebar from '../components/AdminSidebar.vue';
import { VoucherService } from '../services/voucher.service';

const vouchers = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const activeTab = ref('vouchers');

const form = ref({
    voucherId: null,
    code: '',
    discountType: 'PERCENT',
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: null,
    quantity: 50,
    startDate: '',
    endDate: '',
    status: true
});

const fetchVouchers = async () => {
    isLoading.value = true;
    try {
        const res = await VoucherService.getAllVouchers();
        vouchers.value = res.data || [];
    } catch (error) {
        console.error('Lỗi khi tải danh sách voucher:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchVouchers);

const filteredVouchers = computed(() => {
    const q = searchQuery.value.toLowerCase().trim();
    if (!q) return vouchers.value;
    return vouchers.value.filter(v =>
        v.code?.toLowerCase().includes(q) ||
        v.discountType?.toLowerCase().includes(q)
    );
});

// Định dạng Date sang chuỗi YYYY-MM-DDTHH:mm cho input datetime-local
const toDateTimeLocal = (dateInput) => {
    const d = dateInput ? new Date(dateInput) : new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Đảm bảo có đủ giây (:00) khi gửi xuống Spring Boot LocalDateTime
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

const getUsagePercent = (v) => {
    if (!v.quantity) return 0;
    return Math.min(100, Math.round(((v.usedCount || 0) / v.quantity) * 100));
};

const getVoucherStatusInfo = (v) => {
    const now = new Date();
    const start = new Date(v.startDate);
    const end = new Date(v.endDate);

    if (v.status === false) {
        return { label: 'Đã ngưng', badgeClass: 'bg-slate-100 text-slate-500' };
    }
    if ((v.usedCount || 0) >= v.quantity) {
        return { label: 'Hết lượt', badgeClass: 'bg-amber-50 text-amber-700' };
    }
    if (now > end) {
        return { label: 'Hết hạn', badgeClass: 'bg-red-50 text-red-600' };
    }
    if (now < start) {
        return { label: 'Sắp diễn ra', badgeClass: 'bg-blue-50 text-[#308ce8]' };
    }
    return { label: 'Đang hoạt động', badgeClass: 'bg-emerald-50 text-emerald-600' };
};

const openAddModal = () => {
    isEditing.value = false;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    form.value = {
        voucherId: null,
        code: '',
        discountType: 'PERCENT',
        discountValue: 10,
        minOrderValue: 0,
        maxDiscount: 50000,
        quantity: 50,
        startDate: toDateTimeLocal(now),
        endDate: toDateTimeLocal(nextWeek),
        status: true
    };
    showModal.value = true;
};

const openEditModal = (v) => {
    isEditing.value = true;
    form.value = {
        voucherId: v.voucherId,
        code: v.code,
        discountType: v.discountType,
        discountValue: Number(v.discountValue),
        minOrderValue: Number(v.minOrderValue || 0),
        maxDiscount: v.maxDiscount != null ? Number(v.maxDiscount) : null,
        quantity: v.quantity,
        startDate: toDateTimeLocal(v.startDate),
        endDate: toDateTimeLocal(v.endDate),
        status: v.status !== false
    };
    showModal.value = true;
};

const submitForm = async () => {
    isSubmitting.value = true;
    try {
        const payload = {
            code: form.value.code.trim().toUpperCase(),
            discountType: form.value.discountType,
            discountValue: form.value.discountValue,
            minOrderValue: form.value.minOrderValue || 0,
            maxDiscount: form.value.discountType === 'PERCENT' && form.value.maxDiscount ? form.value.maxDiscount : null,
            quantity: form.value.quantity,
            startDate: toIsoLocalDateTime(form.value.startDate),
            endDate: toIsoLocalDateTime(form.value.endDate),
            status: form.value.status
        };

        if (isEditing.value) {
            await VoucherService.updateVoucher(form.value.voucherId, payload);
        } else {
            await VoucherService.createVoucher(payload);
        }

        showModal.value = false;
        await fetchVouchers();
    } catch (error) {
        console.error('Lỗi khi lưu voucher:', error);
        const msg = error.response?.data?.message || error.response?.data || 'Không thể lưu mã khuyến mãi!';
        alert(typeof msg === 'string' ? msg : 'Dữ liệu không hợp lệ!');
    } finally {
        isSubmitting.value = false;
    }
};

const handleDelete = async (v) => {
    if (!confirm(`Cậu có chắc muốn xóa mã "${v.code}" không?`)) return;
    try {
        await VoucherService.deleteVoucher(v.voucherId);
        await fetchVouchers();
    } catch (error) {
        console.error('Lỗi khi xóa voucher:', error);
        alert(error.response?.data || 'Không thể xóa mã khuyến mãi này!');
    }
};
</script>