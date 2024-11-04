import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Input from '../views/InputTransac.vue';
import Detail from '../views/DetailTransac.vue';
import LoginView from '../views/Login.vue';
import RegisView from '../views/Register.vue';
import Settings from '../views/Settings.vue';
import AccManager from '../views/AccManager.vue';
import ReportManager from '../views/ReportManager.vue';
import AddAccount from '../views/AddAccount.vue';

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
      path: '/Home',
      component: Home,
    },
    {
      path: '/InputTransac',
      component: Input,
    },
    {
      path: '/DetailTransac',
      component: Detail,
    },
    {
      path: '/Settings',
      component: Settings,
      },
    {
      path: '/AccManager',
      component: AccManager,
    },
    {
      path: '/ReportManager',
      component: ReportManager,
    },
    {
      path: '/AddAccount',
      component: AddAccount,
    },
  ],
});

export default router;
