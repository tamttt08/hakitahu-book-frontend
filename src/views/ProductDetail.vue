<template>
  <div class="space-y-8 mt-4">
    <div class="mb-6">
      <button @click="router.push('/categories')"
        class="text-sm font-medium text-gray-500 hover:text-[#308ce8] transition-colors flex items-center gap-2">
        <ArrowLeft class="w-4 h-4" /> Tiếp tục mua sắm
      </button>
    </div>

    <!-- Product Intro -->
    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div class="flex flex-col md:flex-row p-6 lg:p-10 gap-10 lg:gap-16">
        <!-- Book Image -->
        <div class="w-full md:w-1/3 flex-shrink-0">
          <div class="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-lg group">
            <img :src="product.image" :alt="product.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerpolicy="no-referrer" />
          </div>
        </div>
        <!-- Book Info -->
        <div class="flex-1 flex flex-col">
          <div class="mb-4">
            <span
              class="inline-block px-3 py-1 bg-blue-50 text-[#308ce8] text-xs font-bold rounded-full uppercase tracking-wider mb-2">Best
              Seller</span>
            <h1 class="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{{ product.title }}</h1>
            <p class="text-lg text-gray-600">Tác giả: <span
                class="font-semibold text-[#308ce8] hover:underline cursor-pointer">{{ product.author }}</span></p>
          </div>

          <div class="flex items-center gap-4 mb-6">
            <div class="flex text-yellow-400">
              <Star v-for="i in 5" :key="i" :class="['h-5 w-5', i <= 4 ? 'fill-yellow-400' : 'text-gray-300']" />
            </div>
            <span class="text-sm text-gray-500">(120 đánh giá) | 2,5k đã bán</span>
          </div>

          <div class="mb-8">
            <span class="text-4xl font-bold text-[#308ce8]">{{ formatPrice(product.price) }}</span>
            <span v-if="product.oldPrice" class="ml-3 text-lg text-gray-400 line-through">{{
              formatPrice(product.oldPrice) }}</span>
          </div>

          <div class="mb-8 text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
            Được mệnh danh là cuốn sách thay đổi cuộc đời của hàng triệu người, "{{ product.title }}" không chỉ là nghệ
            thuật thu phục lòng người mà còn là những bài học sâu sắc về cuộc sống và cách đối nhân xử thế.
          </div>

          <div class="flex flex-col sm:flex-row gap-4 mt-auto">
            <button @click="addToCart"
              class="flex-1 px-8 py-4 border-2 border-[#308ce8] text-[#308ce8] font-bold rounded-xl hover:bg-[#308ce8]/5 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart class="h-5 w-5" />
              Thêm vào giỏ hàng
            </button>
            <button @click="router.push('/checkout')"
              class="flex-1 px-8 py-4 bg-[#308ce8] text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-[#308ce8]/20 transition-all">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <!-- Description -->
        <section class="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 border-b pb-4 mb-6">Mô tả sản phẩm</h2>
          <article class="prose prose-blue max-w-none text-gray-600 space-y-4">
            <p>"{{ product.title }}" là cuốn sách nổi tiếng nhất, có tầm ảnh hưởng nhất mọi thời đại. Tác phẩm đã được
              dịch sang hầu hết các ngôn ngữ phổ biến trên thế giới và có mặt ở hàng trăm quốc gia.</p>
            <p>Cuốn sách đưa ra các lời khuyên về cách cư xử, ứng xử và giao tiếp với mọi người để đạt được thành công
              trong cuộc sống. Các nguyên tắc trong sách rất đơn giản nhưng mang lại hiệu quả to lớn nếu được áp dụng
              chân thành.</p>
          </article>
        </section>

        <!-- Reviews -->
        <section class="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-8 border-b pb-4">
            <h2 class="text-xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
            <button class="text-[#308ce8] font-semibold hover:underline text-sm">Viết đánh giá</button>
          </div>
          <div class="space-y-8">
            <div class="flex gap-4 border-b border-gray-50 pb-8">
              <div
                class="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 font-bold">
                T</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-gray-900">Trần Thị B</h4>
                  <span class="text-xs text-gray-400">2 ngày trước</span>
                </div>
                <div class="flex text-yellow-400 mb-2">
                  <Star v-for="i in 5" :key="i" class="h-4 w-4 fill-yellow-400" />
                </div>
                <p class="text-sm text-gray-600">Sách rất hay, giao hàng nhanh, đóng gói cẩn thận. Nội dung thì không
                  cần bàn cãi vì quá nổi tiếng rồi.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Sidebar Info -->
      <aside class="space-y-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award class="h-5 w-5 text-green-500" /> Dịch vụ của chúng tôi
          </h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="p-2 bg-blue-50 rounded-lg text-[#308ce8]">
                <Truck class="h-4 w-4" />
              </div>
              <div>
                <p class="text-sm font-semibold">Giao hàng miễn phí</p>
                <p class="text-xs text-gray-500">Cho đơn hàng từ 250.000đ</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="p-2 bg-blue-50 rounded-lg text-[#308ce8]">
                <RefreshCw class="h-4 w-4" />
              </div>
              <div>
                <p class="text-sm font-semibold">Đổi trả dễ dàng</p>
                <p class="text-xs text-gray-500">Trong vòng 7 ngày nếu có lỗi</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="bg-[#308ce8]/5 rounded-2xl p-6 border border-[#308ce8]/10">
          <h3 class="font-bold text-gray-900 mb-2">Thông tin chi tiết</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">Nhà xuất bản</span><span
                class="font-medium">NXB Tổng hợp</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Kích thước</span><span
                class="font-medium">14.5 x 20.5 cm</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Số trang</span><span
                class="font-medium">320</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Loại bìa</span><span class="font-medium">Bìa
                mềm</span></div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Star, ShoppingCart, Award, Truck, RefreshCw } from 'lucide-vue-next';
import { BEST_SELLERS, formatPrice } from '../data/mockData';

const router = useRouter();
// Mock dữ liệu tạm 1 cuốn sách để render giao diện
const product = ref(BEST_SELLERS[3]);

const addToCart = () => {
  alert(`Đã thêm "${product.value.title}" vào giỏ hàng!`);
};
</script>