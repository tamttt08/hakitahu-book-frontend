<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <ShipperSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8 shrink-0">
            </header>

            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="max-w-4xl mx-auto gap-8 flex flex-col">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Cấu hình hệ thống</h2>
                        <p class="text-slate-500 font-medium mt-2">Cập nhật thông tin hoạt động của Shipper.</p>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Trạng thái nhận đơn</label>
                            <select
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#308ce8]/50">
                                <option>Đang hoạt động (Sẵn sàng nhận đơn)</option>
                                <option>Tạm nghỉ</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Biển số xe</label>
                            <input type="text" value="59-A1 123.45"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#308ce8]/50" />
                        </div>

                        <div class="pt-4 flex justify-end">
                            <button @click="saveConfig"
                                class="bg-[#308ce8] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#308ce8]/90 shadow-lg shadow-[#308ce8]/25 transition-all">
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
import ShipperSidebar from '../components/ShipperSidebar.vue';

const saveConfig = () => {
    alert('Đã cập nhật thông tin Shipper thành công!');
};
</script>