import { createRouter, createWebHashHistory } from 'vue-router';

import { useUserStore } from '@/store/UserStore';

import LoginPage from '@/pages/LoginPage.vue';
import Dashboard from './pages/Dashboard.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/', name: 'Dashboard', component: Dashboard },
];
const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (to.name != 'Login' && !userStore.isAuthenticated) {
    return next({ name: 'Login' });
  }
  if (to.name === 'Login' && userStore.isAuthenticated) {
    return next({ name: 'Dashboard' });
  }

  return next();
});

export default router;
