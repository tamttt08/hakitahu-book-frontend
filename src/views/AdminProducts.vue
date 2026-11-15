<template>
    <div class="flex min-h-screen bg-[#f8f9fa]">
        <AdminSidebar />

        <main class="flex-1 p-8">
            <!-- Top Bar -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div class="relative w-full sm:w-96">
                    <Search class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm tên sách, tác giả..."
                        class="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/30 focus:border-[#ec5b13] outline-none" />
                </div>
                <router-link to="/" class="text-sm font-bold text-slate-600 hover:text-[#ec5b13] transition-colors">
                    Về cửa hàng
                </router-link>
            </div>

            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-extrabold text-slate-800">Quản lý Sách</h1>
                <button @click="openAddModal"
                    class="flex items-center gap-2 bg-[#ec5b13] hover:bg-[#d44d0c] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#ec5b13]/25 transition-all">
                    <Plus class="w-5 h-5" /> Thêm sách mới
                </button>
            </div>

            <!-- Bảng dữ liệu -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                            <th class="py-4 px-6">Sách</th>
                            <th class="py-4 px-6">Danh mục</th>
                            <th class="py-4 px-6">Giá bán</th>
                            <th class="py-4 px-6">Số lượng</th>
                            <th class="py-4 px-6 text-center">Trạng thái</th>
                            <th class="py-4 px-6 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr v-if="filteredBooks.length === 0">
                            <td colspan="6" class="py-8 text-center text-slate-400">Không tìm thấy sách nào phù hợp.
                            </td>
                        </tr>
                        <tr v-for="book in filteredBooks" :key="book.bookId"
                            class="hover:bg-slate-50/60 transition-colors">
                            <td class="py-4 px-6 flex items-center gap-3">
                                <img :src="book.image || 'https://placehold.co/60x80?text=Book'" alt="cover"
                                    class="w-12 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
                                <div>
                                    <div class="font-bold text-slate-800 line-clamp-1">{{ book.title }}</div>
                                    <div class="text-xs text-slate-500">{{ book.author }}</div>
                                </div>
                            </td>
                            <td class="py-4 px-6 font-medium text-slate-600">
                                {{ book.category?.categoryName || 'Chưa phân loại' }}
                            </td>
                            <td class="py-4 px-6 font-bold text-[#ec5b13]">
                                {{ formatCurrency(book.price) }}
                            </td>
                            <td class="py-4 px-6 font-semibold text-slate-700">
                                {{ book.quantity }}
                            </td>
                            <td class="py-4 px-6 text-center">
                                <span
                                    :class="book.status ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'"
                                    class="px-3 py-1 rounded-full text-xs font-bold">
                                    • {{ book.status ? 'ĐANG BÁN' : 'NGỪNG BÁN' }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-right">
                                <div class="flex justify-end gap-1">
                                    <button @click="openEditModal(book)"
                                        class="p-2 text-slate-400 hover:text-[#ec5b13] hover:bg-[#ec5b13]/10 rounded-lg transition-colors">
                                        <Edit3 class="w-5 h-5" />
                                    </button>
                                    <button @click="handleDeleteBook(book)"
                                        class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal Thêm / Sửa Sách -->
            <div v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 class="text-lg font-bold text-slate-800">{{ isEditing ? 'Cập nhật sách' : 'Thêm sách mới' }}
                        </h3>
                        <button @click="showModal = false"
                            class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
                    </div>

                    <form @submit.prevent="submitBookForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Tên sách <span
                                    class="text-red-500">*</span></label>
                            <input v-model="bookForm.title" type="text" required placeholder="Nhập tên sách..."
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">Tác giả <span
                                        class="text-red-500">*</span></label>
                                <input v-model="bookForm.author" type="text" required placeholder="Tên tác giả..."
                                    class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">Danh mục <span
                                        class="text-red-500">*</span></label>
                                <select v-model="bookForm.categoryId" required
                                    class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none">
                                    <option value="" disabled>-- Chọn danh mục --</option>
                                    <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
                                        {{ cat.categoryName }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">Giá bán (VNĐ) <span
                                        class="text-red-500">*</span></label>
                                <input v-model.number="bookForm.price" type="number" min="0" required
                                    class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">Số lượng kho <span
                                        class="text-red-500">*</span></label>
                                <input v-model.number="bookForm.quantity" type="number" min="0" required
                                    class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                            </div>
                        </div>

                        <!-- Khu vực chọn Ảnh bìa: 2 Options (Link URL hoặc Tải từ máy) -->
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <label class="block text-sm font-bold text-slate-700">Hình ảnh bìa sách</label>

                                <!-- Nút chuyển đổi 2 chế độ -->
                                <div class="flex bg-slate-100 p-1 rounded-xl">
                                    <button type="button" @click="imageInputType = 'url'"
                                        :class="imageInputType === 'url' ? 'bg-white text-[#ec5b13] shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                                        class="px-3 py-1 text-xs font-bold rounded-lg transition-all">
                                        Link ảnh (URL)
                                    </button>
                                    <button type="button" @click="imageInputType = 'file'"
                                        :class="imageInputType === 'file' ? 'bg-white text-[#ec5b13] shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                                        class="px-3 py-1 text-xs font-bold rounded-lg transition-all">
                                        Tải từ máy
                                    </button>
                                </div>
                            </div>

                            <!-- Option 1: Nhập Link URL -->
                            <div v-if="imageInputType === 'url'">
                                <input v-model="bookForm.image" type="text"
                                    placeholder="Dán đường dẫn ảnh (https://...)"
                                    class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
                            </div>

                            <!-- Option 2: Chọn file từ máy tính -->
                            <div v-else>
                                <label
                                    class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 hover:border-[#ec5b13] rounded-xl cursor-pointer bg-slate-50 hover:bg-orange-50/30 transition-colors">
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <span class="text-xs font-bold text-slate-600">
                                            {{ selectedFile ? selectedFile.name : 'Bấm để chọn ảnh từ máy tính' }}
                                        </span>
                                        <span class="text-[11px] text-slate-400 mt-1">Hỗ trợ PNG, JPG, WEBP</span>
                                    </div>
                                    <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                                </label>
                            </div>

                            <!-- Khung xem trước ảnh (Preview) -->
                            <div v-if="imagePreview || bookForm.image"
                                class="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                                <img :src="imageInputType === 'file' && imagePreview ? imagePreview : bookForm.image"
                                    alt="Preview"
                                    class="w-12 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
                                <div class="text-xs text-slate-500 truncate flex-1">
                                    <p class="font-bold text-slate-700">Ảnh xem trước</p>
                                    <p class="truncate">{{ imageInputType === 'file' && selectedFile ? selectedFile.name
                                        : bookForm.image }}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Mô tả sách</label>
                            <textarea v-model="bookForm.description" rows="3" placeholder="Tóm tắt nội dung sách..."
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none"></textarea>
                        </div>

                        <div v-if="isEditing"
                            class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span class="text-sm font-bold text-slate-700">Trạng thái mở bán</span>
                            <input type="checkbox" v-model="bookForm.status" class="w-5 h-5 accent-[#ec5b13]" />
                        </div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" @click="showModal = false"
                                class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
                                Hủy bỏ
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="px-5 py-2.5 text-sm font-bold text-white bg-[#ec5b13] hover:bg-[#d44d0c] rounded-xl shadow-lg shadow-[#ec5b13]/25 disabled:opacity-50">
                                {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Lưu sách') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Edit3, Trash2 } from 'lucide-vue-next';
import AdminSidebar from '../components/AdminSidebar.vue';
import { BookService } from '../services/book.service';
import { CategoryService } from '../services/category.service';

const books = ref([]);
const categories = ref([]);
const searchQuery = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const imageInputType = ref('url'); // 'url' hoặc 'file'
const selectedFile = ref(null);
const imagePreview = ref('');

const bookForm = ref({
    bookId: null,
    title: '',
    author: '',
    price: 0,
    quantity: 0,
    image: '',
    description: '',
    status: true,
    categoryId: ''
});

const fetchData = async () => {
    try {
        const [booksRes, categoriesRes] = await Promise.all([
            BookService.getAllBooks(),
            CategoryService.getAllCategories()
        ]);
        books.value = booksRes.data;
        categories.value = categoriesRes.data;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu sách:', error);
    }
};

onMounted(fetchData);

const filteredBooks = computed(() => {
    const q = searchQuery.value.toLowerCase().trim();
    if (!q) return books.value;
    return books.value.filter(b =>
        b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
    );
});

const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

const openAddModal = () => {
    isEditing.value = false;
    imageInputType.value = 'url';
    selectedFile.value = null;
    imagePreview.value = '';
    bookForm.value = {
        bookId: null,
        title: '',
        author: '',
        price: 0,
        quantity: 10,
        image: '',
        description: '',
        status: true,
        categoryId: categories.value[0]?.categoryId || ''
    };
    showModal.value = true;
};

const openEditModal = (book) => {
    isEditing.value = true;
    imageInputType.value = 'url';
    selectedFile.value = null;
    imagePreview.value = '';
    bookForm.value = {
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: book.quantity,
        image: book.image,
        description: book.description,
        status: book.status,
        categoryId: book.category?.categoryId || ''
    };
    showModal.value = true;
};

const submitBookForm = async () => {
    isSubmitting.value = true;
    try {
        let finalImageUrl = bookForm.value.image;

        // Nếu đang ở chế độ chọn file từ máy và có file được chọn -> Upload lên server trước
        if (imageInputType.value === 'file' && selectedFile.value) {
            const uploadRes = await BookService.uploadImage(selectedFile.value);
            finalImageUrl = uploadRes.data.url;
        }

        const payload = {
            title: bookForm.value.title,
            author: bookForm.value.author,
            price: bookForm.value.price,
            quantity: bookForm.value.quantity,
            image: finalImageUrl,
            description: bookForm.value.description,
            status: bookForm.value.status,
            category: { categoryId: bookForm.value.categoryId }
        };

        if (isEditing.value) {
            await BookService.updateBook(bookForm.value.bookId, payload);
        } else {
            await BookService.createBook(payload);
        }

        showModal.value = false;
        await fetchData();
    } catch (error) {
        console.error('Lỗi khi lưu sách:', error);
        alert('Không thể lưu thông tin sách. Vui lòng kiểm tra lại!');
    } finally {
        isSubmitting.value = false;
    }
};

const handleDeleteBook = async (book) => {
    if (!confirm(`Cậu có chắc muốn xóa cuốn "${book.title}" không?`)) return;
    try {
        await BookService.deleteBook(book.bookId);
        await fetchData();
    } catch (error) {
        console.error('Lỗi khi xóa sách:', error);
        alert('Không thể xóa sách này!');
    }
};

// Hàm xử lý khi người dùng chọn file từ máy tính
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};
</script>