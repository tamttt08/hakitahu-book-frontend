<template>
    <div class="max-w-md mx-auto my-20 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <!-- 1. Đang xác thực -->
        <div v-if="status === 'loading'" class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-slate-200 border-t-[#308ce8] rounded-full animate-spin"></div>
            <h2 class="text-xl font-bold text-slate-800">Đang xác thực tài khoản...</h2>
            <p class="text-slate-500 text-sm">Vui lòng đợi trong giây lát.</p>
        </div>

        <!-- 2. Xác thực thành công -->
        <div v-else-if="status === 'success'" class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900">Xác thực thành công!</h2>
            <p class="text-slate-500 text-sm">
                Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <button @click="router.push('/login')"
                class="mt-4 w-full bg-[#308ce8] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all">
                Đến trang Đăng nhập
            </button>
        </div>

        <!-- 3. Xác thực thất bại -->
        <div v-else class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900">Xác thực thất bại</h2>
            <p class="text-slate-500 text-sm">{{ errorMessage }}</p>

            <!-- Thông báo kết quả gửi lại mail -->
            <div v-if="resendMessage"
                :class="resendError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
                class="w-full p-3 rounded-xl border text-xs font-semibold text-left">
                {{ resendMessage }}
            </div>

            <!-- Form nhập email khi bấm Gửi lại mail -->
            <form v-if="showResendForm" @submit.prevent="handleResend" class="w-full space-y-3 text-left mt-2">
                <label class="block text-xs font-bold text-slate-600">
                    Nhập email bạn đã dùng để đăng ký:
                </label>
                <input v-model="emailInput" type="email" required placeholder="example@gmail.com"
                    class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#308ce8]/30 focus:border-[#308ce8] outline-none" />
                <button type="submit" :disabled="isResending || countdown > 0"
                    class="w-full bg-[#308ce8] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50">
                    <span v-if="isResending">Đang gửi email...</span>
                    <span v-else-if="countdown > 0">Vui lòng đợi {{ countdown }}s để gửi lại</span>
                    <span v-else>Xác nhận gửi lại email</span>
                </button>
            </form>

            <!-- Các nút lựa chọn -->
            <div class="w-full space-y-2.5 mt-2">
                <button v-if="!showResendForm" @click="showResendForm = true"
                    class="w-full bg-[#308ce8] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all">
                    Gửi lại email xác nhận
                </button>

                <button @click="router.push('/register')"
                    class="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all">
                    Quay lại Đăng ký
                </button>

                <button @click="router.push('/')"
                    class="w-full text-xs font-semibold text-slate-400 hover:text-slate-600 py-1 transition-colors">
                    Về trang chủ
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthService } from '../services/auth.service';

const route = useRoute();
const router = useRouter();

const status = ref('loading');
const errorMessage = ref('Đường link xác thực không hợp lệ hoặc đã hết hạn.');

// Trạng thái gửi lại email xác nhận
const showResendForm = ref(false);
const emailInput = ref(localStorage.getItem('pendingVerifyEmail') || '');
const isResending = ref(false);
const resendMessage = ref('');
const resendError = ref(false);
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

onMounted(async () => {
    const token = route.query.token;

    if (!token) {
        status.value = 'error';
        return;
    }

    try {
        await AuthService.verifyEmail(token);
        status.value = 'success';
        localStorage.removeItem('pendingVerifyEmail');
    } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || error.response?.data;
        if (typeof msg === 'string' && msg.trim()) {
            errorMessage.value = msg;
        }
        status.value = 'error';
    }
});

onUnmounted(() => {
    clearInterval(timer);
});

const handleResend = async () => {
    if (!emailInput.value.trim() || countdown.value > 0) return;

    isResending.value = true;
    resendMessage.value = '';
    resendError.value = false;

    try {
        const res = await AuthService.resendVerification(emailInput.value.trim());
        resendMessage.value = typeof res === 'string'
            ? res
            : (res?.message || 'Đã gửi lại email xác nhận! Vui lòng kiểm tra hộp thư của bạn.');
        resendError.value = false;
        startCountdown(60);
    } catch (error) {
        resendError.value = true;
        const msg = error.response?.data?.message || error.response?.data;
        resendMessage.value = typeof msg === 'string'
            ? msg
            : 'Không thể gửi lại email xác nhận. Vui lòng kiểm tra lại email!';
    } finally {
        isResending.value = false;
    }
};
</script>