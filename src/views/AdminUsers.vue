<template>
  <div class="flex min-h-screen bg-[#f8f9fa]">
    <AdminSidebar />

    <main class="flex-1 p-8">
      <!-- Top Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div class="relative w-full sm:w-96">
          <Search class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input v-model="searchQuery" type="text" placeholder="Tìm kiếm người dùng..."
            class="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ec5b13]/30 focus:bg-white outline-none transition-all" />
        </div>
        <router-link to="/" class="text-sm font-bold text-slate-700 hover:text-[#ec5b13] transition-colors">
          Về cửa hàng
        </router-link>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-extrabold text-slate-900">Quản lý Người dùng</h1>
        <button @click="openAddModal"
          class="flex items-center gap-2 bg-[#ec5b13] hover:bg-[#d44d0c] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#ec5b13]/25 transition-all">
          <Plus class="w-5 h-5" /> Thêm người dùng
        </button>
      </div>

      <!-- Bảng danh sách người dùng -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th class="py-4 px-6">NGƯỜI DÙNG</th>
              <th class="py-4 px-6">VAI TRÒ</th>
              <th class="py-4 px-6">TRẠNG THÁI</th>
              <th class="py-4 px-6 text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-if="isLoading">
              <td colspan="4" class="py-10 text-center text-slate-400">Đang tải danh sách người dùng...</td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="4" class="py-10 text-center text-slate-400">Không tìm thấy người dùng nào phù hợp.</td>
            </tr>
            <tr v-else v-for="u in filteredUsers" :key="u.userId" class="hover:bg-slate-50/60 transition-colors">
              <!-- Cột Người dùng: Avatar viết tắt + Họ tên + Email -->
              <td class="py-4 px-6 flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {{ getInitials(u.fullName || u.username) }}
                </div>
                <div>
                  <div class="font-bold text-slate-900">{{ u.fullName || u.username }}</div>
                  <div class="text-xs text-slate-500">{{ u.email || 'Chưa cập nhật email' }}</div>
                </div>
              </td>

              <!-- Cột Vai trò -->
              <td class="py-4 px-6">
                <span :class="getRoleBadgeClass(u.role)" class="px-3 py-1 rounded-lg text-xs font-extrabold uppercase">
                  {{ formatRoleName(u.role) }}
                </span>
              </td>

              <!-- Cột Trạng thái -->
              <td class="py-4 px-6">
                <span :class="u.status !== false ? 'text-emerald-600' : 'text-red-500'" class="font-bold text-xs flex items-center gap-1.5">
                  <span>•</span>
                  <span>{{ u.status !== false ? 'Đang hoạt động' : 'Đã khóa' }}</span>
                </span>
              </td>

              <!-- Cột Thao tác -->
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-1">
                  <button @click="openEditModal(u)" title="Chỉnh sửa"
                    class="p-2 text-slate-400 hover:text-[#ec5b13] hover:bg-[#ec5b13]/10 rounded-lg transition-colors">
                    <Edit3 class="w-5 h-5" />
                  </button>
                  <button v-if="u.userId !== currentAdminId" @click="handleDeleteUser(u)" title="Xóa người dùng"
                    class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Thêm / Cập nhật Người dùng -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="text-lg font-bold text-slate-800">
              {{ isEditing ? 'Cập nhật thông tin người dùng' : 'Thêm người dùng mới' }}
            </h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="submitUserForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Tên đăng nhập <span class="text-red-500">*</span></label>
                <input v-model="userForm.username" type="text" required :disabled="isEditing"
                  placeholder="Nhập username..."
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none disabled:opacity-60" />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Họ và tên <span class="text-red-500">*</span></label>
                <input v-model="userForm.fullName" type="text" required placeholder="Nhập họ tên..."
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Email <span class="text-red-500">*</span></label>
                <input v-model="userForm.email" type="email" required placeholder="example@gmail.com"
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Số điện thoại</label>
                <input v-model="userForm.phone" type="text" placeholder="09xx..."
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">
                  {{ isEditing ? 'Đổi mật khẩu (Bỏ trống nếu giữ nguyên)' : 'Mật khẩu *' }}
                </label>
                <input v-model="userForm.password" type="password" :required="!isEditing"
                  placeholder="••••••••"
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Vai trò <span class="text-red-500">*</span></label>
                <select v-model="userForm.role" required
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none">
                  <option value="user">KHÁCH HÀNG</option>
                  <option value="shipper">SHIPPER</option>
                  <option value="admin">QUẢN TRỊ VIÊN</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Địa chỉ</label>
              <input v-model="userForm.address" type="text" placeholder="Nhập địa chỉ..."
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] outline-none" />
            </div>

            <!-- Nút gạt Khóa / Mở khóa tài khoản -->
            <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span class="text-sm font-bold text-slate-700 block">Trạng thái hoạt động</span>
                <span class="text-xs text-slate-400">Tắt để khóa quyền đăng nhập của tài khoản này</span>
              </div>
              <input type="checkbox" v-model="userForm.status" class="w-5 h-5 accent-[#ec5b13] cursor-pointer" />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" @click="showModal = false"
                class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
                Hủy bỏ
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="px-5 py-2.5 text-sm font-bold text-white bg-[#ec5b13] hover:bg-[#d44d0c] rounded-xl shadow-lg shadow-[#ec5b13]/25 disabled:opacity-50">
                {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo tài khoản') }}
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
import { UserService } from '../services/user.service';

const users = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

// Lấy ID của Admin đang đăng nhập để tránh tự xóa chính mình
const currentAdminId = computed(() => {
  try {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    return localUser.userId || null;
  } catch {
    return null;
  }
});

const userForm = ref({
  userId: null,
  username: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  role: 'user',
  status: true
});

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await UserService.getAllUsers();
    users.value = res.data || [];
  } catch (error) {
    console.error('Lỗi khi tải danh sách người dùng:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchUsers);

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return users.value;
  return users.value.filter(u =>
    u.fullName?.toLowerCase().includes(q) ||
    u.username?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q) ||
    u.role?.toLowerCase().includes(q)
  );
});

// Tạo chữ cái viết tắt cho Avatar (VD: "Minh Quân" -> "MQ", "Tâm Admin" -> "TA")
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Hiển thị tên Vai trò tiếng Việt như thiết kế
const formatRoleName = (role) => {
  const r = (role || 'user').toLowerCase();
  if (r.includes('admin')) return 'QUẢN TRỊ VIÊN';
  if (r.includes('shipper')) return 'SHIPPER';
  return 'KHÁCH HÀNG';
};

// Màu sắc badge cho từng Vai trò
const getRoleBadgeClass = (role) => {
  const r = (role || 'user').toLowerCase();
  if (r.includes('admin')) return 'bg-blue-50 text-[#308ce8]';
  if (r.includes('shipper')) return 'bg-amber-50 text-amber-700';
  return 'bg-slate-100 text-slate-700';
};

const openAddModal = () => {
  isEditing.value = false;
  userForm.value = {
    userId: null,
    username: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'user',
    status: true
  };
  showModal.value = true;
};

const openEditModal = (u) => {
  isEditing.value = true;
  userForm.value = {
    userId: u.userId,
    username: u.username,
    fullName: u.fullName || '',
    email: u.email || '',
    phone: u.phone || '',
    address: u.address || '',
    password: '', // Để trống, chỉ gửi nếu Admin muốn đặt lại mật khẩu
    role: (u.role || 'user').toLowerCase().replace('role_', ''),
    status: u.status !== false
  };
  showModal.value = true;
};

const submitUserForm = async () => {
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await UserService.updateUser(userForm.value.userId, userForm.value);
    } else {
      await UserService.createUser(userForm.value);
    }
    showModal.value = false;
    await fetchUsers();
  } catch (error) {
    console.error('Lỗi khi lưu người dùng:', error);
    alert(error.response?.data || 'Không thể lưu thông tin người dùng!');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteUser = async (u) => {
  if (!confirm(`Cậu có chắc muốn xóa tài khoản "${u.fullName || u.username}" không?`)) return;
  try {
    await UserService.deleteUser(u.userId);
    await fetchUsers();
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    alert('Không thể xóa tài khoản này (có thể người dùng đã có đơn hàng hoặc token liên kết)!');
  }
};
</script>