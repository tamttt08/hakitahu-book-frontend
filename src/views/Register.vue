<template>
  <div class="min-h-[calc(100vh-120px)] bg-cover bg-center flex items-center justify-center p-4"
    style="background-image: url('src/assets/images/background-login.jpg')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-5">
      <h2 class="text-2xl font-extrabold text-center text-slate-900">
        {{ showResendBox ? 'Gửi lại email xác nhận' : 'Đăng ký HAKITAHU BOOK' }}
      </h2>

      <!-- Thông báo Lỗi / Thành công -->
      <div v-if="message"
        :class="isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
        class="p-3.5 rounded-xl border text-sm font-medium space-y-2">
        <p>{{ message }}</p>

        <!-- Nút gửi lại nhanh ngay trong khung thông báo sau khi đăng ký hoặc khi lỗi gửi mail -->
        <button v-if="canQuickResend" type="button" @click="handleResendEmail(registeredEmail)"
          :disabled="isResending || countdown > 0"
          class="text-xs font-bold underline text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:no-underline">
          <span v-if="isResending">Đang gửi lại email...</span>
          <span v-else-if="countdown > 0">Gửi lại email xác nhận ({{ countdown }}s)</span>
          <span v-else>Chưa nhận được mail hoặc bị lỗi? Gửi lại ngay</span>
        </button>
      </div>

      <!-- FORM 1: Đăng ký tài khoản -->
      <form v-if="!showResendBox" @submit.prevent="handleRegister" class="space-y-4">
        <input v-model="form.username" type="text" required placeholder="Tên đăng nhập"
          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />

        <div class="relative">
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required placeholder="Mật khẩu"
            class="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <EyeOff v-if="showPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>

        <input v-model="form.email" type="email" required placeholder="Email"
          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />

        <input v-model="form.fullName" type="text" required placeholder="Họ và tên"
          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />

        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {{ isSubmitting ? 'Đang xử lý...' : 'Đăng ký' }}
        </button>
      </form>

      <!-- FORM 2: Nhập email để gửi lại link xác nhận (dành cho người xác nhận bị lỗi / hết hạn) -->
      <form v-else @submit.prevent="handleResendEmail(resendEmailInput)" class="space-y-4">
        <p class="text-xs text-slate-500 text-center">
          Nhập email bạn đã dùng để đăng ký, hệ thống sẽ gửi một liên kết xác nhận mới.
        </p>

        <input v-model="resendEmailInput" type="email" required placeholder="Nhập địa chỉ email của bạn..."
          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />

        <button type="submit" :disabled="isResending || countdown > 0"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
          <span v-if="isResending">Đang gửi email...</span>
          <span v-else-if="countdown > 0">Vui lòng đợi {{ countdown }}s để gửi lại</span>
          <span v-else>Gửi lại email xác nhận</span>
        </button>
      </form>

      <!-- Liên kết chuyển đổi phía dưới -->
      <div class="text-center text-sm text-slate-600 space-y-2 pt-1">
        <p>
          Đã có tài khoản?
          <router-link to="/login" class="text-blue-600 font-semibold hover:underline">Đăng nhập</router-link>
        </p>
        <p class="text-xs">
          <button type="button" @click="toggleResendBox" class="text-slate-500 hover:text-blue-600 hover:underline">
            {{ showResendBox ? '← Quay lại form đăng ký' : 'Chưa nhận được email xác nhận / Xác nhận bị lỗi?' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { AuthService } from '../services/auth.service';

const form = ref({
  username: '',
  password: '',
  email: '',
  fullName: ''
});

const showPassword = ref(false);
const isSubmitting = ref(false);

const message = ref('');
const isError = ref(false);

// Trạng thái gửi lại email xác nhận
const showResendBox = ref(false);
const canQuickResend = ref(false);
const registeredEmail = ref('');
const resendEmailInput = ref('');
const isResending = ref(false);
const countdown = ref(0);
let timer = null;

const startCountdown = (seconds = 60) => {
  clearInterval(timer);
  countdown.value = seconds;
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

onUnmounted(() => {
  clearInterval(timer);
});

const toggleResendBox = () => {
  showResendBox.value = !showResendBox.value;
  message.value = '';
  canQuickResend.value = false;
  if (showResendBox.value && form.value.email) {
    resendEmailInput.value = form.value.email;
  }
};

const handleRegister = async () => {
  isSubmitting.value = true;
  message.value = '';
  isError.value = false;
  canQuickResend.value = false;

  try {
    await AuthService.register(form.value);
    registeredEmail.value = form.value.email;
    localStorage.setItem('pendingVerifyEmail', form.value.email); // Lưu email chờ xác thực

    message.value = `Đăng ký thành công! Vui lòng kiểm tra email ${form.value.email} để xác thực tài khoản.`;
    isError.value = false;
    canQuickResend.value = true;
    startCountdown(60); // Đếm ngược 60s rồi mới cho bấm gửi lại để tránh spam
  } catch (error) {
    isError.value = true;
    const errMsg = error.response?.data?.message || error.response?.data || 'Đăng ký thất bại!';
    message.value = typeof errMsg === 'string' ? errMsg : 'Có lỗi xảy ra khi đăng ký.';

    // Nếu tạo tài khoản xong nhưng gửi mail lỗi hoặc email đã đăng ký nhưng chưa xác thực
    if (form.value.email) {
      registeredEmail.value = form.value.email;
      localStorage.setItem('pendingVerifyEmail', form.value.email); // Lưu lại để trang Verify tự điền sẵn
      canQuickResend.value = true;
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleResendEmail = async (targetEmail) => {
  if (!targetEmail || countdown.value > 0) return;

  isResending.value = true;
  message.value = '';
  isError.value = false;

  try {
    const res = await AuthService.resendVerification(targetEmail);
    localStorage.setItem('pendingVerifyEmail', targetEmail.trim()); // <-- Thêm ở đây

    message.value = typeof res === 'string' ? res : (res?.message || 'Đã gửi lại email xác nhận thành công!');
    isError.value = false;
    startCountdown(60);
  } catch (error) {
    isError.value = true;
    const errMsg = error.response?.data?.message || error.response?.data || 'Không thể gửi lại email xác nhận.';
    message.value = typeof errMsg === 'string' ? errMsg : 'Gửi lại email thất bại!';
  } finally {
    isResending.value = false;
  }
};
</script>