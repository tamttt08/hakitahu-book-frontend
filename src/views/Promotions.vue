<template>
    <div class="space-y-12">
        <!-- Hero Banner -->
        <section>
            <div class="relative bg-orange-500 rounded-3xl overflow-hidden h-[350px] flex items-center shadow-lg">
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4VJifK8qHg0KJxDK_VN38w_mTa_xaNXIOcQ9nTkfI9797sEx7oos4zUTG30D6N1n-11OOHol4JbOYbVE1TJ_J4PRcvmzr9pFLrkq-kw4ZpFC-x-uZfZUk4qqXBJuBiiJuGlsgOoSm9jJ9M4lZ7F-E2U0fkVIdUMoo307zme75ddR2NjVSzIr-pJxf8hOcGpcRL3x0FbMDue6XzOUUFpkzukEMgVYMShgJXrEkE_G56I3SIZgSK5omBT0UVbDgQlfUl_aYhJs2tws"
                    alt="Khuyến mãi banner" class="absolute inset-0 w-full h-full object-cover"
                    referrerpolicy="no-referrer" />
                <div class="relative z-20 px-12 text-white max-w-xl">
                    <span
                        class="bg-[#308ce8] px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block tracking-wider">Sự
                        kiện lớn nhất năm</span>
                    <h1 class="text-5xl font-extrabold mb-4 leading-tight">Hội sách Online<br />Giảm đến 50%</h1>
                    <p class="text-lg opacity-90 mb-8">Khám phá hàng ngàn tựa sách từ văn học, kinh tế đến kỹ năng sống
                        với mức giá ưu đãi nhất.</p>
                    <button
                        class="bg-[#308ce8] hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-full transition-all transform hover:scale-105">
                        Mua ngay
                    </button>
                </div>
            </div>
        </section>

        <!-- Flash Sale Section -->
        <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-end mb-6">
                <div>
                    <h2 class="text-2xl font-bold flex items-center gap-2">
                        <span class="text-orange-500">⚡</span> Flash Sale
                    </h2>
                    <p class="text-gray-500 text-sm mt-1">
                        Kết thúc trong:
                        <span class="bg-red-500 text-white px-2 py-0.5 rounded ml-2">{{
                            String(timeLeft.hours).padStart(2, '0') }}</span> :
                        <span class="bg-red-500 text-white px-2 py-0.5 rounded">{{ String(timeLeft.minutes).padStart(2,
                            '0') }}</span> :
                        <span class="bg-red-500 text-white px-2 py-0.5 rounded">{{ String(timeLeft.seconds).padStart(2,
                            '0') }}</span>
                    </p>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div v-for="book in FEATURED_BOOKS" :key="book.id" @click="goToDetail(book)"
                    class="group cursor-pointer">
                    <div
                        class="relative aspect-[3/4] bg-gray-50 rounded-xl mb-3 overflow-hidden border border-transparent group-hover:border-[#308ce8] transition">
                        <span
                            class="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded z-10">{{
                            book.discount }}</span>
                        <img :src="book.image" :alt="book.title"
                            class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            referrerpolicy="no-referrer" />
                    </div>
                    <h3 class="font-bold text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-[#308ce8] transition">
                        {{ book.title }}</h3>
                    <p class="text-xs text-gray-500 mb-2">{{ book.author }}</p>
                    <div class="flex flex-col">
                        <span class="text-[#308ce8] font-bold">{{ formatPrice(book.price) }}</span>
                        <span class="text-xs text-gray-400 line-through">{{ formatPrice(book.oldPrice) }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Secondary Banners -->
        <div class="grid md:grid-cols-2 gap-6">
            <div
                class="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white flex items-center justify-between shadow-md group cursor-pointer">
                <div>
                    <h3 class="text-2xl font-bold mb-2">Combo Tiết Kiệm</h3>
                    <p class="text-sm opacity-90 mb-4">Mua theo bộ, giảm thêm 15% tổng hóa đơn.</p>
                    <button
                        class="bg-white text-orange-500 font-bold px-5 py-2 rounded-lg text-sm hover:bg-orange-50 transition">Xem
                        ngay</button>
                </div>
                <BookOpen class="w-24 h-24 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            <div
                class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-md group cursor-pointer">
                <div>
                    <h3 class="text-2xl font-bold mb-2">Deal Đồng Giá 99K</h3>
                    <p class="text-sm opacity-90 mb-4">Hàng loạt tựa sách hot nhất chỉ với 99.000đ.</p>
                    <button
                        class="bg-white text-blue-600 font-bold px-5 py-2 rounded-lg text-sm hover:bg-blue-50 transition">Săn
                        deal ngay</button>
                </div>
                <Bolt class="w-24 h-24 opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
        </div>

        <!-- Info Banners -->
        <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-blue-50 p-6 rounded-2xl flex items-center gap-4 border border-blue-100 shadow-sm">
                <div class="bg-[#308ce8] p-3 rounded-xl text-white">
                    <Ticket class="w-6 h-6" />
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 text-sm">Mã BOOKONEW</h4>
                    <p class="text-xs text-gray-500">Giảm 50k cho đơn đầu tiên từ 300k</p>
                    <button class="text-[#308ce8] text-[10px] font-bold mt-1 uppercase">Sao chép mã</button>
                </div>
            </div>
            <div class="bg-green-50 p-6 rounded-2xl flex items-center gap-4 border border-green-100 shadow-sm">
                <div class="bg-green-500 p-3 rounded-xl text-white">
                    <Truck class="w-6 h-6" />
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 text-sm">Miễn Phí Vận Chuyển</h4>
                    <p class="text-xs text-gray-500">Cho đơn hàng từ 150k tại HN & TP.HCM</p>
                    <button class="text-green-600 text-[10px] font-bold mt-1 uppercase">Điều kiện áp dụng</button>
                </div>
            </div>
            <div class="bg-orange-50 p-6 rounded-2xl flex items-center gap-4 border border-orange-100 shadow-sm">
                <div class="bg-orange-500 p-3 rounded-xl text-white">
                    <Award class="w-6 h-6" />
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 text-sm">Thành Viên BookO</h4>
                    <p class="text-xs text-gray-500">Tích điểm đổi quà & ưu đãi sinh nhật 20%</p>
                    <button class="text-orange-500 text-[10px] font-bold mt-1 uppercase">Đăng ký ngay</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { BookOpen, Bolt, Ticket, Truck, Award } from 'lucide-vue-next';
import { FEATURED_BOOKS, formatPrice } from '../data/mockData';

const router = useRouter();
const timeLeft = ref({ hours: 12, minutes: 45, seconds: 12 });
let timer;

onMounted(() => {
    timer = setInterval(() => {
        if (timeLeft.value.seconds > 0) {
            timeLeft.value.seconds--;
        } else if (timeLeft.value.minutes > 0) {
            timeLeft.value.minutes--;
            timeLeft.value.seconds = 59;
        } else if (timeLeft.value.hours > 0) {
            timeLeft.value.hours--;
            timeLeft.value.minutes = 59;
            timeLeft.value.seconds = 59;
        }
    }, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});

const goToDetail = (book) => {
    router.push('/product-detail');
};
</script>