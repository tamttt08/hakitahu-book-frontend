<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <AdminSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Header -->
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8 shrink-0">
                <button @click="router.push('/')"
                    class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#ec5b13] transition-colors">Về cửa
                    hàng</button>
            </header>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="max-w-4xl mx-auto gap-8 flex flex-col">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Cấu hình hệ thống</h2>
                        <p class="text-slate-500 font-medium">Quản lý các thiết lập chung của cửa hàng HAKITAHU BOOK.
                        </p>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                        <!-- Thông tin cửa hàng -->
                        <div>
                            <h3 class="text-lg font-bold border-b border-slate-100 pb-3 mb-4 text-slate-800">Thông tin
                                cửa hàng</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-2">Tên cửa hàng</label>
                                    <input type="text"
                                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ec5b13]/50"
                                        value="HAKITAHU BOOK" />
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-2">Hotline hỗ trợ</label>
                                    <input type="text"
                                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ec5b13]/50"
                                        value="1900 1234" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-bold text-slate-700 mb-2">Địa chỉ trụ sở</label>
                                    <input type="text"
                                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ec5b13]/50"
                                        value="Công viên phần mềm Quang Trung, Quận 12, TP.HCM" />
                                </div>
                            </div>
                        </div>

                        <!-- Vận chuyển & Thanh toán -->
                        <div>
                            <h3 class="text-lg font-bold border-b border-slate-100 pb-3 mb-4 text-slate-800">Vận chuyển
                                & Thanh toán</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-2">Phí giao hàng mặc định
                                        (VNĐ)</label>
                                    <input type="number"
                                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ec5b13]/50"
                                        value="30000" />
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-2">Miễn phí giao hàng từ
                                        (VNĐ)</label>
                                    <input type="number"
                                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ec5b13]/50"
                                        value="500000" />
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 flex justify-end">
                            <button @click="saveConfig"
                                class="bg-[#ec5b13] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#ec5b13]/90 shadow-lg shadow-[#ec5b13]/25 transition-all">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AdminSidebar from '../components/AdminSidebar.vue';

const router = useRouter();

const saveConfig = () => {
    alert('Đã lưu cấu hình hệ thống thành công!');
};
</script>