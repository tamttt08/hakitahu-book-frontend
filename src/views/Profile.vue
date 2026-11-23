<template>
  <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <!-- Breadcrumbs -->
    <nav class="flex mb-8 text-sm font-medium text-slate-500">
      <ol class="flex items-center space-x-2">
        <li><router-link to="/" class="hover:text-[#308ce8] transition-colors">Trang chủ</router-link></li>
        <li class="flex items-center space-x-2">
          <ChevronRight class="w-4 h-4" />
          <span class="text-slate-900">Tài khoản</span>
        </li>
      </ol>
    </nav>

    <div class="mb-10">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Thông tin cá nhân</h1>
      <p class="mt-2 text-slate-600">Quản lý và bảo mật thông tin tài khoản của bạn tại HAKITAHU BOOK.</p>
    </div>

    <!-- Thông báo lưu thành công -->
    <div
      v-if="successBanner"
      class="mb-6 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center justify-between"
    >
      <span>{{ successBanner }}</span>
      <button @click="successBanner = ''" class="text-emerald-600 hover:text-emerald-800 font-bold">&times;</button>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 sm:p-8">
        <div class="space-y-8">
          <!-- Username Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8] shrink-0">
                <User class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tên đăng nhập</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.username || 'hakitahu_user' }}</p>
              </div>
            </div>
          </div>

          <!-- Full Name Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8] shrink-0">
                <IdCard class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Họ & Tên</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.fullName || 'Khách hàng' }}</p>
              </div>
            </div>
            <button @click="openEditFieldModal('fullName')"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors shrink-0">
              Thay đổi
            </button>
          </div>

          <!-- Password Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8] shrink-0">
                <Lock class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Mật khẩu</h3>
                <div class="flex items-center gap-3">
                  <p class="text-lg font-medium text-slate-900 tracking-[0.2em] mt-1">
                    ••••••••
                  </p>
                </div>
              </div>
            </div>

            <button @click="showChangePasswordForm = true"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors shrink-0">
              Thay đổi
            </button>
          </div>

          <!-- Email Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8] shrink-0">
                <Mail class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Email</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.email || 'Chưa cập nhật' }}</p>
              </div>
            </div>
            <button @click="openEditFieldModal('email')"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors shrink-0">
              Thay đổi
            </button>
          </div>

          <!-- Phone Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8] shrink-0">
                <Phone class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Số điện thoại</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.phone || 'Chưa cập nhật' }}</p>
              </div>
            </div>
            <button @click="openEditFieldModal('phone')"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors shrink-0">
              Thay đổi
            </button>
          </div>

          <!-- Address Row (Tích hợp bản đồ Leaflet + OpenStreetMap) -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8] shrink-0">
                <MapPin class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Địa chỉ giao hàng</h3>
                <p class="text-lg font-medium text-slate-900 leading-snug">
                  {{ currentUser.address || 'Chưa cập nhật địa chỉ' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button @click="openEditFieldModal('address')"
                title="Nhập nhanh địa chỉ bằng bàn phím (không cần GPS/Bản đồ)"
                class="inline-flex items-center justify-center px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Nhập nhanh
              </button>
              <button @click="showAddressMapModal = true"
                title="Mở bản đồ định vị Leaflet"
                class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/10 hover:bg-[#308ce8]/20 rounded-lg transition-colors">
                <MapPin class="w-4 h-4" />
                <span>Bản đồ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Security & Logout Footer -->
      <div class="bg-slate-50 px-6 py-6 border-t border-slate-200">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <button @click="showChangePasswordForm = true"
            class="flex items-center gap-2 text-[#308ce8] font-semibold hover:underline decoration-2 underline-offset-4 transition-all">
            <Lock class="w-5 h-5" /> Thay đổi mật khẩu
          </button>
          <button @click="handleLogout"
            class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all">
            <LogOut class="w-5 h-5" /> Đăng xuất
          </button>
        </div>
      </div>
    </div>

    <!-- Account Badges -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-slate-100">
        <ShieldCheck class="w-8 h-8 text-[#308ce8] mb-3" />
        <h4 class="font-bold mb-1">Bảo mật cao</h4>
        <p class="text-xs text-slate-500">Tài khoản của bạn luôn được bảo vệ 24/7</p>
      </div>
      <div class="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-slate-100">
        <Truck class="w-8 h-8 text-[#308ce8] mb-3" />
        <h4 class="font-bold mb-1">Giao hàng nhanh</h4>
        <p class="text-xs text-slate-500">Miễn phí vận chuyển cho đơn trên 500k</p>
      </div>
      <div class="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-slate-100">
        <Headphones class="w-8 h-8 text-[#308ce8] mb-3" />
        <h4 class="font-bold mb-1">Hỗ trợ 24/7</h4>
        <p class="text-xs text-slate-500">Chúng tôi luôn sẵn sàng lắng nghe bạn</p>
      </div>
    </div>

    <!-- Modal chỉnh sửa Họ tên / Email / Số điện thoại -->
    <div v-if="editModal.open"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 class="text-xl font-black text-slate-900 tracking-tight">{{ editModal.title }}</h2>
          <button @click="editModal.open = false" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <XCircle class="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form class="p-6 space-y-5" @submit.prevent="submitEditField">
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700">{{ editModal.label }}</label>
            <input
              v-model="editModal.value"
              :type="editModal.inputType"
              :placeholder="editModal.placeholder"
              required
              class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#308ce8] focus:bg-white outline-none transition-all"
            />
            <p v-if="editModal.hint" class="text-xs text-slate-400">{{ editModal.hint }}</p>
          </div>

          <div class="pt-2 flex gap-3">
            <button type="button" @click="editModal.open = false"
              class="flex-1 h-12 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
              Hủy
            </button>
            <button type="submit" :disabled="isUpdatingProfile"
              class="flex-[2] h-12 bg-[#308ce8] text-white font-bold rounded-xl shadow-lg shadow-[#308ce8]/20 hover:bg-blue-600 disabled:opacity-50 transition-all">
              {{ isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal chọn Địa chỉ bằng Bản đồ Leaflet -->
    <AddressMapModal
      v-if="showAddressMapModal"
      :initial-address="currentUser.address || ''"
      :is-saving="isUpdatingProfile"
      @close="showAddressMapModal = false"
      @save="handleSaveAddress"
    />

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordForm"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Thay đổi mật khẩu</h2>
          <button @click="showChangePasswordForm = false" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <XCircle class="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <form class="p-6 space-y-5" @submit.prevent="submitChangePassword">
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700">Mật khẩu cũ</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input v-model="passwordForm.oldPassword" type="password" required placeholder="Nhập mật khẩu hiện tại"
                class="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#308ce8] outline-none transition-all" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700">Mật khẩu mới</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input v-model="passwordForm.newPassword" type="password" required placeholder="Nhập mật khẩu mới"
                class="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#308ce8] outline-none transition-all" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700">Xác nhận mật khẩu mới</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input v-model="passwordForm.confirmPassword" type="password" required placeholder="Nhập lại mật khẩu mới"
                class="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#308ce8] outline-none transition-all" />
            </div>
          </div>
          <div class="pt-4 flex gap-3">
            <button type="button" @click="showChangePasswordForm = false"
              class="flex-1 h-12 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Hủy</button>
            <button type="submit"
              class="flex-[2] h-12 bg-[#308ce8] text-white font-bold rounded-xl shadow-lg shadow-[#308ce8]/20 hover:bg-blue-600 transition-all">Xác
              nhận</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ChevronRight, User, IdCard, Lock, Mail, Phone, MapPin, LogOut, XCircle, ShieldCheck, Truck, Headphones } from 'lucide-vue-next';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import AddressMapModal from '../components/AddressMapModal.vue';

const router = useRouter();
const showChangePasswordForm = ref(false);
const showAddressMapModal = ref(false);
const isUpdatingProfile = ref(false);
const successBanner = ref('');

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || {});

const editModal = reactive({
  open: false,
  field: '',
  title: '',
  label: '',
  inputType: 'text',
  placeholder: '',
  hint: '',
  value: ''
});

const FIELD_CONFIG = {
  fullName: {
    title: 'Cập nhật Họ & Tên',
    label: 'Họ và tên mới',
    inputType: 'text',
    placeholder: 'Nhập họ và tên của bạn',
    hint: ''
  },
  email: {
    title: 'Cập nhật Email',
    label: 'Địa chỉ Email mới',
    inputType: 'email',
    placeholder: 'VD: example@gmail.com',
    hint: 'Email phải chưa được sử dụng bởi tài khoản khác.'
  },
  phone: {
    title: 'Cập nhật Số điện thoại',
    label: 'Số điện thoại liên hệ',
    inputType: 'tel',
    placeholder: 'VD: 0901234567',
    hint: 'Nhập số điện thoại Việt Nam (10–11 chữ số, bắt đầu bằng 0 hoặc +84).'
  },
  address: {
    title: 'Cập nhật Địa chỉ giao hàng',
    label: 'Địa chỉ nhận hàng chi tiết',
    inputType: 'text',
    placeholder: 'VD: 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    hint: 'Gõ đầy đủ số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố để giao hàng thuận tiện.'
  }
};

// Đồng bộ dữ liệu mới nhất vào state & localStorage
const syncUserState = (updatedData) => {
  const merged = { ...currentUser.value, ...updatedData };
  currentUser.value = merged;
  localStorage.setItem('user', JSON.stringify(merged));
  window.dispatchEvent(new Event('storage'));
};

const showSuccess = (msg) => {
  successBanner.value = msg;
  setTimeout(() => {
    if (successBanner.value === msg) successBanner.value = '';
  }, 4000);
};

// Tải hồ sơ mới nhất từ SQL Server khi mở trang
const fetchLatestProfile = async () => {
  try {
    const res = await ProfileService.getMyProfile();
    if (res.data) {
      syncUserState(res.data);
    }
  } catch (err) {
    console.error('Không thể đồng bộ hồ sơ mới nhất:', err);
  }
};

onMounted(fetchLatestProfile);

const openEditFieldModal = (field) => {
  const cfg = FIELD_CONFIG[field];
  if (!cfg) return;
  editModal.field = field;
  editModal.title = cfg.title;
  editModal.label = cfg.label;
  editModal.inputType = cfg.inputType;
  editModal.placeholder = cfg.placeholder;
  editModal.hint = cfg.hint;
  editModal.value = currentUser.value[field] || '';
  editModal.open = true;
};

const submitEditField = async () => {
  const val = editModal.value.trim();
  if (!val) {
    alert('Thông tin không được để trống!');
    return;
  }
  if (editModal.field === 'phone' && !/^(0|\+84)[0-9]{9,10}$/.test(val)) {
    alert('Số điện thoại không đúng định dạng Việt Nam (10–11 chữ số)!');
    return;
  }

  isUpdatingProfile.value = true;
  try {
    const payload = { [editModal.field]: val };
    const res = await ProfileService.updateMyProfile(payload);
    syncUserState(res.data);
    editModal.open = false;
    showSuccess('Cập nhật thông tin cá nhân thành công!');
  } catch (err) {
    console.error('Lỗi cập nhật hồ sơ:', err);
    const msg = err.response?.data?.message || err.response?.data || 'Không thể cập nhật thông tin!';
    alert(typeof msg === 'string' ? msg : 'Cập nhật thất bại!');
  } finally {
    isUpdatingProfile.value = false;
  }
};

const handleSaveAddress = async (newAddress) => {
  isUpdatingProfile.value = true;
  try {
    const res = await ProfileService.updateMyProfile({ address: newAddress });
    syncUserState(res.data);
    showAddressMapModal.value = false;
    showSuccess('Đã lưu địa chỉ giao hàng mới thành công!');
  } catch (err) {
    console.error('Lỗi cập nhật địa chỉ:', err);
    const msg = err.response?.data?.message || err.response?.data || 'Không thể lưu địa chỉ!';
    alert(typeof msg === 'string' ? msg : 'Lưu địa chỉ thất bại!');
  } finally {
    isUpdatingProfile.value = false;
  }
};

// Giữ nguyên logic đổi mật khẩu đang chạy của cậu
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const submitChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:8081/api/auth/change-password',
      {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Mật khẩu đã được thay đổi thành công!');
    showChangePasswordForm.value = false;

    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (err) {
    alert(err.response?.data || 'Lỗi khi đổi mật khẩu!');
  }
};

const handleLogout = () => {
  AuthService.logout();
  router.push('/login');
};
</script>