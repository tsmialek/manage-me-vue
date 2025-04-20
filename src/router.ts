import { createRouter, createWebHashHistory } from 'vue-router';

import { useAuthStore } from '@/store/AuthStore';
import { LoginPage, Dashboard, ProjectPage, StoryPage } from '@/pages';

const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/project/:projectId', name: 'Project', component: ProjectPage },
  {
    path: '/project/:projectId/:storyId',
    name: 'Story',
    component: StoryPage,
  },
];
const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.name != 'Login' && !authStore.isAuthenticated) {
    return next({ name: 'Login' });
  }
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next(from);
  }

  return next();
});

export default router;
