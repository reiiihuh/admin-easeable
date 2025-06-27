import { createRouter, createWebHistory } from 'vue-router';

import Input from '../views/TambahRuteLokasi.vue';
import Detail from '../views/KelolaFeedback.vue';
import LoginView from '../views/Login.vue';
import RegisView from '../views/Register.vue';


import ReportManager from '../views/KelolaLokasi.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/Login',  // Mengarahkan '/' ke '/Login'
    },
    {
      path: '/Login',
      component: LoginView,
    },
    {
      path: '/Register',
      component: RegisView,
    },

    {
      path: '/InputDataRute',
      component: Input,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Feedback',
      component: Detail,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/KelolaLokasi',
      component: ReportManager,
      meta: {
        requiresAuth: true
      }
    }
  ],
});

// PROTECT ROUTES
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/Login'); // Balik ke login kalau belum login
  } else if ((to.path === '/Login') && isAuthenticated) {
    next('/KelolaLokasi'); // Kalau udah login, ga bisa akses login/register lagi
  } else {
    next(); // Lanjut normal
  }
});

export default router;
