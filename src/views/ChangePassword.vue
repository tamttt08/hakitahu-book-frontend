<template>
    <div class="bg-white p-6 rounded-xl border border-gray-100 mt-6">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Đổi mật khẩu</h3>

        <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm">{{ error }}
        </div>
        <div v-if="successMsg" class="mb-4 p-3 bg-green-50 text-green-600 border border-green-100 rounded-lg text-sm">{{
            successMsg }}</div>

        <form @submit.prevent="handleChangePass" class="space-y-4 max-w-md">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input v-model="form.oldPassword" type="password" required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#308ce8] bg-slate-50 focus:bg-white transition-colors" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input v-model="form.newPassword" type="password" required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#308ce8] bg-slate-50 focus:bg-white transition-colors" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <input v-model="form.confirmPassword" type="password" required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#308ce8] bg-slate-50 focus:bg-white transition-colors" />
            </div>

            <button type="submit"
                class="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium">
                Lưu thay đổi
            </button>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';

const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' });
const error = ref('');
const successMsg = ref('');

const handleChangePass = async () => {
    if (form.newPassword !== form.confirmPassword) {
        error.value = 'Mật khẩu xác nhận không khớp!';
        return;
    }
    error.value = ''; successMsg.value = '';

    const token = localStorage.getItem('token');
    try {
        const res = await axios.post('http://localhost:8081/api/auth/change-password',
            { oldPassword: form.oldPassword, newPassword: form.newPassword },
            { headers: { Authorization: `Bearer ${token}` } } // Bắt buộc đính kèm JWT
        );
        successMsg.value = res.data;
        form.oldPassword = ''; form.newPassword = ''; form.confirmPassword = '';
    } catch (err) {
        error.value = err.response?.data || 'Lỗi khi đổi mật khẩu!';
    }
};
</script>