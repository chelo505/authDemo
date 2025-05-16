import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store';

// Lazy-loaded components
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const CarSearch = () => import('../components/CarSearch.vue');
const CarForm = () => import('../components/CarForm.vue');
const UserListings = () => import('../components/UserListings.vue');

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/cars',
    name: 'Cars',
    component: CarSearch
  },
  {
    path: '/cars/new',
    name: 'NewCar',
    component: CarForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-listings',
    name: 'UserListings',
    component: UserListings,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {

  if (!store.state.auth.user && localStorage.getItem('token')) {
    store.dispatch('auth/initAuth');
  }
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router; 