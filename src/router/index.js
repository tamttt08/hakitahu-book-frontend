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

const routes = [
    { path: '/', component: Home },
    { path: '/categories', component: Categories },
    { path: '/cart', component: Cart },
    { path: '/checkout', component: Checkout },
    { path: '/product-detail', component: ProductDetail },
    { path: '/order-success', component: OrderSuccess },
    { path: '/profile', component: Profile },
    { path: '/order-history', component: OrderHistory },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/admin/products', component: AdminProducts },
    { path: '/admin/orders', component: AdminOrders },
    { path: '/admin/categories', component: AdminCategories },
    { path: '/admin/users', component: AdminUsers },
    { path: '/new-arrivals', component: NewArrivals },
    { path: '/promotions', component: Promotions },
    { path: '/admin/config', component: AdminConfig },
    { path: '/shipper/orders', component: ShipperOrders },
    { path: '/shipper/config', component: ShipperConfig },
    { path: '/verify', component: VerifyEmail },
    { path: '/oauth2/redirect', component: OAuth2Redirect },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;