import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { UserRecord } from '@/types';

export const useUserStore = defineStore('users', () => {
  const user = ref<UserRecord>(null);
  const loading = ref(false);
  const error = ref(null);
});
