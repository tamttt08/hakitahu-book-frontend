<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Progress Stepper -->
    <nav class="flex items-center justify-center mb-10 overflow-x-auto pb-4">
      <ol class="flex items-center w-full max-w-3xl">
        <li class="flex items-center text-[#308ce8] shrink-0">
          <span
            class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#308ce8] bg-[#308ce8]/10 mr-2">
            <Check class="w-4 h-4" />
          </span>
          <span class="text-sm font-semibold">Giỏ hàng</span>
        </li>
        <li class="flex w-full items-center">
          <div class="w-full h-0.5 bg-[#308ce8]/30 mx-4"></div>
        </li>
        <li class="flex items-center text-[#308ce8] shrink-0">
          <span
            class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#308ce8] bg-[#308ce8] mr-2 text-white">2</span>
          <span class="text-sm font-bold">Thanh toán</span>
        </li>
        <li class="flex w-full items-center">
          <div class="w-full h-0.5 bg-slate-200 mx-4"></div>
        </li>
        <li class="flex items-center text-slate-400 shrink-0">
          <span class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-200 mr-2">3</span>
          <span class="text-sm font-medium">Hoàn tất</span>
        </li>
      </ol>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Forms -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Shipping Info -->
        <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <Truck class="w-5 h-5 text-[#308ce8]" />
              Thông tin giao hàng
            </h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Họ và tên *</label>
                <input v-model="shippingInfo.fullName"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#308ce8] px-4 py-2.5 outline-none transition-all"
                  type="text" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Số điện thoại *</label>
                <input v-model="shippingInfo.phone"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#308ce8] px-4 py-2.5 outline-none transition-all"
                  type="tel" />
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-sm font-medium text-slate-700">Địa chỉ Email *</label>
                <input v-model="shippingInfo.email"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#308ce8] px-4 py-2.5 outline-none transition-all"
                  type="email" />
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-sm font-medium text-slate-700">Địa chỉ chi tiết *</label>
                <textarea v-model="shippingInfo.address"
                  class="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#308ce8] px-4 py-2.5 outline-none transition-all"
                  rows="3"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Payment Methods -->
        <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <CreditCard class="w-5 h-5 text-[#308ce8]" />
              Phương thức thanh toán
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <label
              class="relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all border-[#308ce8] bg-[#308ce8]/5 hover:border-[#308ce8]/50">
              <input type="radio" value="COD" v-model="paymentMethod"
                class="text-[#308ce8] focus:ring-[#308ce8] h-5 w-5" />
              <div class="ml-4 flex items-center gap-4">
                <Handshake class="w-8 h-8 text-slate-500" />
                <div>
                  <p class="font-bold">Thanh toán khi nhận hàng (COD)</p>
                  <p class="text-xs text-slate-500">Thanh toán bằng tiền mặt khi shipper giao hàng</p>
                </div>
              </div>
            </label>
            <label
              class="relative flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-[#308ce8]/50 cursor-pointer transition-all">
              <input type="radio" value="BANKING" v-model="paymentMethod"
                class="text-[#308ce8] focus:ring-[#308ce8] h-5 w-5" />
              <div class="ml-4 flex items-center gap-4">
                <CreditCard class="w-8 h-8 text-slate-500" />
                <div>
                  <p class="font-bold">Thẻ ATM / Internet Banking</p>
                  <p class="text-xs text-slate-500">Hỗ trợ tất cả ngân hàng nội địa tại Việt Nam</p>
                </div>
              </div>
            </label>
            <label
              class="relative flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-[#308ce8]/50 cursor-pointer transition-all">
              <input type="radio" value="EWALLET" v-model="paymentMethod"
                class="text-[#308ce8] focus:ring-[#308ce8] h-5 w-5" />
              <div class="ml-4 flex items-center gap-4">
                <Wallet class="w-8 h-8 text-slate-500" />
                <div>
                  <p class="font-bold">Ví điện tử (MoMo, ZaloPay)</p>
                  <p class="text-xs text-slate-500">Thanh toán nhanh qua ứng dụng ví điện tử</p>
                </div>
              </div>
            </label>
          </div>
        </section>

        <div class="mt-6">
          <button @click="router.push('/cart')"
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#308ce8] transition-colors">
            <ArrowLeft class="w-4 h-4" /> Quay lại giỏ hàng
          </button>
        </div>
      </div>

      <!-- Right Column: Order Summary -->
      <aside class="lg:col-span-4 lg:sticky lg:top-24">
        <div class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 class="text-lg font-bold">Đơn hàng ({{ cartItems.length }} sách)</h2>
            <button @click="router.push('/cart')"
              class="text-sm font-medium text-[#308ce8] hover:underline">Sửa</button>
          </div>
          <div class="p-6 max-h-60 overflow-y-auto space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="flex gap-4">
              <div class="w-16 h-16 rounded bg-slate-100 overflow-hidden shrink-0">
                <img class="w-full h-full object-cover" :src="item.image" :alt="item.title"
                  referrerpolicy="no-referrer" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold line-clamp-1">{{ item.title }}</p>
                <p class="text-xs text-slate-500">SL: {{ item.quantity }}</p>
                <p class="text-sm font-semibold text-[#308ce8]">{{ formatPrice(item.price) }}</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-slate-50 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Tạm tính</span>
              <span class="font-medium">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Phí vận chuyển</span>
              <span class="font-medium">{{ formatPrice(shipping) }}</span>
            </div>
            <div class="flex justify-between text-sm text-green-600 font-medium">
              <span>Giảm giá</span>
              <span>-{{ formatPrice(discount) }}</span>
            </div>
            <div class="pt-3 border-t border-slate-200 flex justify-between items-end">
              <div>
                <p class="text-sm font-medium text-slate-600 leading-none">Tổng cộng</p>
                <p class="text-xs text-slate-400 mt-1">(Đã bao gồm VAT)</p>
              </div>
              <span class="text-2xl font-black text-[#308ce8]">{{ formatPrice(total) }}</span>
            </div>
          </div>
          <div class="p-6">
            <button @click="submitOrder"
              class="w-full bg-[#308ce8] hover:bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-[#308ce8]/25 transition-all flex items-center justify-center gap-2 group">
              ĐẶT HÀNG
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p class="text-center text-[10px] text-slate-400 mt-4 px-4 uppercase tracking-wider">
              Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản BookO
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Check, Truck, CreditCard, Handshake, Wallet, ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { INITIAL_CART, formatPrice } from '../data/mockData';

const router = useRouter();
const cartItems = ref([...INITIAL_CART]);

// Lấy thông tin user từ LocalStorage nếu có
const userStorage = JSON.parse(localStorage.getItem('user')) || {};
const shippingInfo = reactive({
  fullName: userStorage.fullName || '',
  phone: userStorage.phone || '',
  email: userStorage.email || '',
  address: userStorage.address || ''
});
const paymentMethod = ref('COD');

const subtotal = computed(() => cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0));
const shipping = ref(30000);
const discount = ref(15000);
const total = computed(() => subtotal.value + shipping.value - discount.value);

const submitOrder = () => {
  if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
    alert("Vui lòng điền đầy đủ thông tin giao hàng!");
    return;
  }
  // Tạm thời gọi alert thành công, sau sẽ gọi xuống API Java
  alert("Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
  router.push('/');
};
</script>