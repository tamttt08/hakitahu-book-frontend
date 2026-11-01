<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold flex items-center gap-3">
      <ShoppingCart class="w-8 h-8 text-[#308ce8]" />
      Giỏ hàng của bạn
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Product List -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div
            class="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
            <div class="col-span-6">Sản phẩm</div>
            <div class="col-span-2 text-center">Đơn giá</div>
            <div class="col-span-2 text-center">Số lượng</div>
            <div class="col-span-2 text-right">Thành tiền</div>
          </div>

          <div v-for="item in cartItems" :key="item.id"
            class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center border-b border-slate-100 last:border-0 group">
            <div class="col-span-1 md:col-span-6 flex items-center gap-4">
              <img :src="item.image" :alt="item.title" class="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0"
                referrerpolicy="no-referrer" />
              <div class="flex flex-col gap-1">
                <h3 class="font-semibold text-slate-900 hover:text-[#308ce8] transition-colors cursor-pointer">{{
                  item.title }}</h3>
                <p class="text-sm text-slate-500">Tác giả: {{ item.author }}</p>
                <button @click="removeFromCart(item.id)"
                  class="md:hidden mt-2 text-xs text-red-500 font-medium flex items-center gap-1">Xóa</button>
              </div>
            </div>
            <div class="col-span-1 md:col-span-2 text-center">
              <span class="text-slate-500 md:hidden">Giá: </span>
              <span class="font-medium">{{ formatPrice(item.price) }}</span>
            </div>
            <div class="col-span-1 md:col-span-2 flex justify-center">
              <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden h-9">
                <button @click="updateQuantity(item.id, -1)" class="px-3 hover:bg-slate-100 text-slate-500">-</button>
                <input type="text" :value="item.quantity" readonly
                  class="w-10 text-center border-none focus:ring-0 text-sm bg-transparent outline-none" />
                <button @click="updateQuantity(item.id, 1)" class="px-3 hover:bg-slate-100 text-[#308ce8]">+</button>
              </div>
            </div>
            <div
              class="col-span-1 md:col-span-2 text-right flex md:flex-col items-center md:items-end justify-between md:justify-center">
              <span class="text-slate-500 md:hidden">Thành tiền: </span>
              <div class="flex flex-col items-end">
                <span class="font-bold text-[#308ce8]">{{ formatPrice(item.price * item.quantity) }}</span>
                <button @click="removeFromCart(item.id)"
                  class="hidden md:flex mt-2 text-slate-400 hover:text-red-500 transition-colors items-center gap-1 text-xs">Xóa</button>
              </div>
            </div>
          </div>

          <div v-if="cartItems.length === 0" class="p-8 text-center text-slate-500">
            Giỏ hàng của bạn đang trống.
          </div>
        </div>

        <button @click="router.push('/')"
          class="inline-flex items-center gap-2 text-[#308ce8] font-medium hover:underline py-2">
          <ArrowLeft class="w-4 h-4" /> Tiếp tục mua sắm
        </button>
      </div>

      <!-- Summary -->
      <div class="lg:sticky lg:top-32">
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-lg font-bold mb-6 border-b border-slate-100 pb-4">Tóm tắt đơn hàng</h2>
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-slate-600">
              <span>Tạm tính ({{ cartItems.length }} sản phẩm)</span>
              <span class="font-medium text-slate-900">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Phí vận chuyển</span>
              <span class="font-medium text-slate-900">{{ formatPrice(shipping) }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Giảm giá</span>
              <span class="font-medium text-red-500">-{{ formatPrice(discount) }}</span>
            </div>
            <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span class="font-bold text-lg">Tổng thanh toán</span>
              <span class="font-bold text-2xl text-[#308ce8]">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex gap-2">
              <input type="text" placeholder="Mã giảm giá"
                class="flex-1 bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#308ce8] outline-none" />
              <button class="px-4 bg-slate-200 hover:bg-slate-300 font-medium rounded-lg text-sm transition-colors">Áp
                dụng</button>
            </div>
          </div>

          <button @click="handleCheckout" :disabled="cartItems.length === 0"
            class="w-full bg-[#308ce8] hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#308ce8]/25 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed">
            TIẾN HÀNH THANH TOÁN
          </button>
          <p class="text-center text-xs text-slate-400">
            Phí vận chuyển sẽ được tính toán chính xác dựa trên địa chỉ nhận hàng của bạn.
          </p>
        </div>

        <div class="mt-6 p-4 bg-[#308ce8]/10 border border-[#308ce8]/20 rounded-xl">
          <div class="flex items-start gap-3">
            <Award class="w-5 h-5 text-[#308ce8]" />
            <div>
              <h4 class="font-bold text-sm text-[#308ce8]">Cam kết từ BookO</h4>
              <p class="text-xs text-slate-600 mt-1">Sách chính hãng 100%, đóng gói cẩn thận và giao hàng siêu tốc trong
                2h.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingCart, ArrowLeft, Award } from 'lucide-vue-next';
import { INITIAL_CART, formatPrice } from '../data/mockData';

const router = useRouter();
// Dùng mảng ảo để test, sau này sẽ lưu trên Vuex/Pinia hoặc LocalStorage
const cartItems = ref([...INITIAL_CART]);

const subtotal = computed(() => cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0));
const shipping = ref(30000);
const discount = ref(15000);
const total = computed(() => subtotal.value > 0 ? subtotal.value + shipping.value - discount.value : 0);

const updateQuantity = (id, delta) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
  }
};

const removeFromCart = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
};

const handleCheckout = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Vui lòng đăng nhập để thanh toán!");
    router.push('/login');
  } else {
    router.push('/checkout');
  }
};
</script>