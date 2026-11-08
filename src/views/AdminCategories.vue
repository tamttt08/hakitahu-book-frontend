<template>
    <div class="flex h-screen overflow-hidden bg-[#f8f6f6] font-sans">
        <AdminSidebar />
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <div class="relative w-full max-w-xl">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input v-model="searchQuery"
                        class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/50 outline-none"
                        placeholder="Tìm kiếm danh mục..." type="text" />
                </div>
                <button @click="router.push('/')"
                    class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#ec5b13] transition-colors">
                    Về cửa hàng
                </button>
            </header>

            <div class="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div class="flex flex-col gap-8 max-w-7xl mx-auto">
                    <div class="flex justify-between items-center">
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý Danh mục Sách</h2>
                        <button @click="showAddModal = true"
                            class="flex items-center gap-2 bg-[#ec5b13] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ec5b13]/90 shadow-lg shadow-[#ec5b13]/25">
                            <Plus class="w-5 h-5" /> Thêm danh mục mới
                        </button>
                    </div>

                    <!-- Hiển thị Loading mượt mà trong lúc chờ Data -->
                    <div v-if="isLoading" class="text-center py-10 text-slate-500 font-medium">
                        Đang tải dữ liệu từ máy chủ...
                    </div>

                    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Tên danh mục</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Trạng
                                        thái</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <!-- Vòng lặp duyệt qua filteredCategories -->
                                <tr v-for="cat in filteredCategories" :key="cat.categoryId"
                                    class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 font-bold text-slate-900">{{ cat.categoryName }}</td>

                                    <td class="px-6 py-4 text-center">
                                        <!-- Render trạng thái dựa trên cat.status -->
                                        <span v-if="cat.status"
                                            class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Hoạt động
                                        </span>
                                        <span v-else
                                            class="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Tạm ẩn
                                        </span>
                                    </td>

                                    <td class="px-6 py-4 text-right">
                                        <button @click="openEditModal(cat)"
                                            class="p-2 text-slate-400 hover:text-[#ec5b13] hover:bg-[#ec5b13]/10 rounded-lg">
                                            <Edit3 class="w-5 h-5" />
                                        </button>
                                        <button @click="handleDeleteCategory(cat)"
                                            class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 class="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Thông báo khi tìm kiếm không có kết quả -->
                        <div v-if="filteredCategories.length === 0" class="text-center py-6 text-slate-500">
                            Không tìm thấy danh mục nào phù hợp.
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal Thêm Danh Mục -->
            <div v-if="showAddModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 class="text-lg font-bold text-slate-800">Thêm danh mục mới</h3>
                        <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600">
                            <span class="text-2xl leading-none">&times;</span>
                        </button>
                    </div>

                    <form @submit.prevent="submitCreateCategory" class="p-6">
                        <div class="mb-6">
                            <label class="block text-sm font-bold text-slate-700 mb-2">Tên danh mục <span
                                    class="text-red-500">*</span></label>
                            <input v-model="newCategoryName" type="text" required
                                placeholder="Nhập tên danh mục (vd: Tiểu thuyết)..."
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/50 focus:border-[#ec5b13] outline-none transition-all" />
                        </div>

                        <div class="flex justify-end gap-3">
                            <button type="button" @click="showAddModal = false"
                                class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="px-5 py-2.5 text-sm font-bold text-white bg-[#ec5b13] hover:bg-[#ec5b13]/90 rounded-xl shadow-lg shadow-[#ec5b13]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ isSubmitting ? 'Đang lưu...' : 'Lưu danh mục' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Modal Sửa Danh Mục -->
            <div v-if="showEditModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 class="text-lg font-bold text-slate-800">Cập nhật danh mục</h3>
                        <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600">
                            <span class="text-2xl leading-none">&times;</span>
                        </button>
                    </div>

                    <form @submit.prevent="submitUpdateCategory" class="p-6">
                        <div class="mb-4">
                            <label class="block text-sm font-bold text-slate-700 mb-2">Tên danh mục <span
                                    class="text-red-500">*</span></label>
                            <input v-model="editForm.categoryName" type="text" required
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/50 focus:border-[#ec5b13] outline-none transition-all" />
                        </div>

                        <div
                            class="mb-6 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span class="text-sm font-bold text-slate-700">Trạng thái hoạt động</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="editForm.status" class="sr-only peer">
                                <div
                                    class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ec5b13]">
                                </div>
                            </label>
                        </div>

                        <div class="flex justify-end gap-3">
                            <button type="button" @click="showEditModal = false"
                                class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="px-5 py-2.5 text-sm font-bold text-white bg-[#ec5b13] hover:bg-[#ec5b13]/90 rounded-xl shadow-lg shadow-[#ec5b13]/25 transition-all disabled:opacity-50">
                                {{ isSubmitting ? 'Đang cập nhật...' : 'Cập nhật' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // Bổ sung onMounted
import { useRouter } from 'vue-router';
import { Search, Plus, Edit3, Trash2 } from 'lucide-vue-next';
import AdminSidebar from '../components/AdminSidebar.vue';
import { CategoryService } from '../services/category.service'; // Chèn CategoryService thật, xóa mockData

const router = useRouter();

const categories = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');

const fetchCategories = async () => {
    isLoading.value = true;
    try {
        const response = await CategoryService.getAllCategories();
        // Giả định backend trả về một list thẳng. (Nếu bọc trong data thì dùng response.data.data)
        categories.value = response.data;
    } catch (error) {
        console.error('Lỗi khi tải danh sách danh mục:', error);
        // Ở cấp độ chuyên nghiệp, cậu có thể dùng toast thay cho alert sau này
        alert('Không thể tải dữ liệu từ máy chủ!');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchCategories();
});

const filteredCategories = computed(() => {
    return categories.value.filter(cat =>
        cat.categoryName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Thêm 3 biến reactive quản lý Modal
const showAddModal = ref(false);
const newCategoryName = ref('');
const isSubmitting = ref(false);

// Hàm xử lý gửi API thêm mới
const submitCreateCategory = async () => {
    if (!newCategoryName.value.trim()) return;

    isSubmitting.value = true;
    try {
        const data = {
            categoryName: newCategoryName.value,
            status: true // Mặc định tạo mới là đang hoạt động
        };

        await CategoryService.createCategory(data);

        // Reset form và đóng modal
        newCategoryName.value = '';
        showAddModal.value = false;

        // Gọi lại hàm fetchCategories để load lại danh sách mới nhất từ DB
        await fetchCategories();

    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        alert('Không thể thêm danh mục. Vui lòng thử lại!');
    } finally {
        isSubmitting.value = false;
    }
};

// Quản lý Modal Sửa
const showEditModal = ref(false);
const editForm = ref({
    categoryId: null,
    categoryName: '',
    status: true
});

const openEditModal = (cat) => {
    editForm.value = { ...cat }; // Sao chép dữ liệu dòng được chọn vào form
    showEditModal.value = true;
};

const submitUpdateCategory = async () => {
    if (!editForm.value.categoryName.trim()) return;

    isSubmitting.value = true;
    try {
        await CategoryService.updateCategory(editForm.value.categoryId, {
            categoryName: editForm.value.categoryName,
            status: editForm.value.status
        });
        showEditModal.value = false;
        await fetchCategories(); // Tải lại bảng dữ liệu mới nhất
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        alert('Cập nhật thất bại. Vui lòng thử lại!');
    } finally {
        isSubmitting.value = false;
    }
};

// Xử lý Xóa
const handleDeleteCategory = async (cat) => {
    const confirmed = confirm(`Cậu có chắc chắn muốn xóa danh mục "${cat.categoryName}" không?`);
    if (!confirmed) return;

    try {
        await CategoryService.deleteCategory(cat.categoryId);
        await fetchCategories();
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        alert('Không thể xóa danh mục này (có thể do danh mục đã chứa sách)!');
    }
};
</script>