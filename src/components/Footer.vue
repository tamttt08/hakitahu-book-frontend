<template>
  <footer class="bg-white border-t border-slate-200 mt-20">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div class="space-y-6">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-[#308ce8] rounded flex items-center justify-center text-white">
              <BookOpen class="w-5 h-5" />
            </div>
            <span class="text-xl font-bold tracking-tight text-[#308ce8]">HAKITAHU BOOK</span>
          </div>
          <p class="text-sm text-slate-500 leading-relaxed">
            HAKITAHU BOOK là nền tảng bán sách trực tuyến hàng đầu Việt Nam, mang tri thức đến mọi nhà với dịch vụ nhanh chóng
            và tận tâm.
          </p>
          <div class="flex items-center gap-4">
            <a href="#"
              class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#308ce8] hover:text-white transition-all">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="#"
              class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#308ce8] hover:text-white transition-all">
              <Instagram class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Các cột Links & Newsletter (giữ nguyên HTML Tailwind cũ của cậu) -->
        <div>
          <h5 class="font-bold mb-6 text-slate-900">Dịch vụ</h5>
          <ul class="space-y-4">
            <li><a href="#" class="text-sm text-slate-500 hover:text-[#308ce8] transition-colors">Điều khoản sử dụng</a>
            </li>
            <li><a href="#" class="text-sm text-slate-500 hover:text-[#308ce8] transition-colors">Chính sách bảo mật</a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h5 class="font-bold mb-6 text-slate-900">Đăng ký nhận tin</h5>
          <div class="flex flex-col gap-2">
            <input type="email" placeholder="Email của bạn"
              class="bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#308ce8] outline-none" />
            <button
              class="bg-[#308ce8] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all">Đăng
              ký ngay</button>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-slate-400">© 2024 HAKITAHU BOOK. Bảo lưu mọi quyền.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { BookOpen, Facebook, Instagram } from 'lucide-vue-next';
</script>