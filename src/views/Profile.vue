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
      <p class="mt-2 text-slate-600">Quản lý và bảo mật thông tin tài khoản của bạn tại BookO.</p>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 sm:p-8">
        <div class="space-y-8">
          <!-- Username Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8]">
                <User class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tên đăng nhập</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.username || 'booko_user' }}</p>
              </div>
            </div>
          </div>

          <!-- Full Name Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8]">
                <IdCard class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Họ & Tên</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.fullName || 'Khách hàng' }}</p>
              </div>
            </div>
            <button
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors">
              Thay đổi
            </button>
          </div>

          <!-- Password Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8]">
                <Lock class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Mật khẩu</h3>
                <div class="flex items-center gap-3">
                  <p class="text-lg font-medium text-slate-900">
                    {{ showProfilePassword ? '123456' : '••••••••' }}
                  </p>
                  <button @click="showProfilePassword = !showProfilePassword"
                    class="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <EyeOff v-if="showProfilePassword" class="w-4 h-4" />
                    <Eye v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <button @click="showChangePasswordForm = true"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors">
              Thay đổi
            </button>
          </div>

          <!-- Email Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8]">
                <Mail class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Email</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.email || 'Chưa cập nhật' }}</p>
              </div>
            </div>
            <button
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors">
              Thay đổi
            </button>
          </div>

          <!-- Phone Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8]">
                <Phone class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Số điện thoại</h3>
                <p class="text-lg font-medium text-slate-900">{{ currentUser.phone || 'Chưa cập nhật' }}</p>
              </div>
            </div>
            <button
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors">
              Thay đổi
            </button>
          </div>

          <!-- Address Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 flex items-center justify-center bg-[#308ce8]/10 rounded-lg text-[#308ce8]">
                <MapPin class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Địa chỉ giao hàng</h3>
                <p class="text-lg font-medium text-slate-900 leading-snug">{{ currentUser.address || 'Chưa cập nhật địa chỉ' }}</p>
              </div>
            </div>
            <button
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#308ce8] bg-[#308ce8]/5 hover:bg-[#308ce8]/10 rounded-lg transition-colors">
              Thay đổi
            </button>
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
              <input type="password" required placeholder="Nhập mật khẩu hiện tại"
                class="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#308ce8] outline-none transition-all" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700">Mật khẩu mới</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" required placeholder="Nhập mật khẩu mới"
                class="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#308ce8] outline-none transition-all" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700">Xác nhận mật khẩu mới</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" required placeholder="Nhập lại mật khẩu mới"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronRight, User, IdCard, Lock, Eye, EyeOff, Mail, Phone, MapPin, LogOut, XCircle, ShieldCheck, Truck, Headphones } from 'lucide-vue-next';
import { AuthService } from '../services/auth.service';

const router = useRouter();
const showProfilePassword = ref(false);
const showChangePasswordForm = ref(false);

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || {});

const submitChangePassword = () => {
  alert('Mật khẩu đã được thay đổi thành công!');
  showChangePasswordForm.value = false;
};

const handleLogout = () => {
  AuthService.logout();
  router.push('/login');
};
</script>