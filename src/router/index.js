import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Categories from '../views/Categories.vue';
import Cart from '../views/Cart.vue';
import Checkout from '../views/Checkout.vue';
import ProductDetail from '../views/ProductDetail.vue';
import OrderSuccess from '../views/OrderSuccess.vue';
import Profile from '../views/Profile.vue';
import OrderHistory from '../views/OrderHistory.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AdminProducts from '../views/AdminProducts.vue';
import AdminOrders from '../views/AdminOrders.vue';
import AdminCategories from '../views/AdminCategories.vue';
import AdminUsers from '../views/AdminUsers.vue';
import NewArrivals from '../views/NewArrivals.vue';
import Promotions from '../views/Promotions.vue';
import AdminConfig from '../views/AdminConfig.vue';
import ShipperOrders from '../views/ShipperOrders.vue';
import ShipperConfig from '../views/ShipperConfig.vue';
import VerifyEmail from '../views/VerifyEmail.vue';
import OAuth2Redirect from '../views/OAuth2Redirect.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';

const routes = [
    // === 1. CÁC TRANG PUBLIC (Ai cũng vào được) ===
    { path: '/', component: Home },
    { path: '/categories', component: Categories },
    { path: '/product-detail', component: ProductDetail },
    { path: '/new-arrivals', component: NewArrivals },
    { path: '/promotions', component: Promotions },
    { path: '/verify', component: VerifyEmail },
    { path: '/oauth2/redirect', component: OAuth2Redirect },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/reset-password', component: ResetPassword },

    // === 2. CÁC TRANG XÁC THỰC (Đã đăng nhập thì không được vào lại) ===
    { path: '/login', component: Login },
    { path: '/register', component: Register },

    // === 3. CÁC TRANG CẦN ĐĂNG NHẬP (Dành cho User/Khách hàng) ===
    { path: '/cart', component: Cart, meta: { requiresAuth: true } },
    { path: '/checkout', component: Checkout, meta: { requiresAuth: true } },
    { path: '/order-success', component: OrderSuccess, meta: { requiresAuth: true } },
    { path: '/profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/order-history', component: OrderHistory, meta: { requiresAuth: true } },

    // === 4. CÁC TRANG QUẢN TRỊ (Chỉ Admin mới được vào) ===
    { path: '/admin', redirect: '/admin/products' },
    { path: '/admin/products', component: AdminProducts, meta: { requiresAuth: true, requiredRole: 'admin' } },
    { path: '/admin/orders', component: AdminOrders, meta: { requiresAuth: true, requiredRole: 'admin' } },
    { path: '/admin/categories', component: AdminCategories, meta: { requiresAuth: true, requiredRole: 'admin' } },
    { path: '/admin/users', component: AdminUsers, meta: { requiresAuth: true, requiredRole: 'admin' } },
    { path: '/admin/config', component: AdminConfig, meta: { requiresAuth: true, requiredRole: 'admin' } },

    // === 5. CÁC TRANG GIAO HÀNG (Chỉ Shipper mới được vào) ===
    { path: '/shipper', redirect: '/shipper/orders' },
    { path: '/shipper/orders', component: ShipperOrders, meta: { requiresAuth: true, requiredRole: 'shipper' } },
    { path: '/shipper/config', component: ShipperConfig, meta: { requiresAuth: true, requiredRole: 'shipper' } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// === CHỐT CHẶN BẢO MẬT (NAVIGATION GUARD) ===
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    let user = null;

    if (userData) {
        try { user = JSON.parse(userData); } catch (e) { }
    }

    // 1. Chặn người dùng vãng lai vào các trang cần đăng nhập (như Profile, Giỏ hàng, Admin,...)
    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }

    // 2. Phân quyền chặt chẽ (Chặn User thường tự gõ link /admin hoặc /shipper)
    if (to.meta.requiredRole && user) {
        const userRole = (user.role || 'user').toLowerCase(); // Mặc định là user nếu không có role

        if (userRole !== to.meta.requiredRole.toLowerCase()) {
            alert('Lỗi phân quyền: Bạn không có quyền truy cập vào khu vực này!');
            return next('/'); // Đuổi về trang chủ
        }
    }

    // 3. Chặn người đã đăng nhập rồi nhưng vẫn cố tình gõ link /login hoặc /register
    if ((to.path === '/login' || to.path === '/register') && token) {
        return next('/');
    }

    // Nếu hợp lệ hết thì cho phép render trang
    next();
});

export default router;