import { createRouter, createWebHashHistory } from 'vue-router';

import LoginPage from '@/pages/LoginPage.vue';

const routes = [{ path: '/login', name: 'Login', component: LoginPage }];
const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach(async (to, from, next) => {
  if ()
})

export default router;
