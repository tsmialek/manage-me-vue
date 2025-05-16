import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';

import type { UserRecord, UserRole } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import { UserService } from '@/services';

export const useUserStore = defineStore('users', () => {
  const users = ref<UserRecord[]>();
  const loading = ref(false);
  const error = ref(null);

  const fetchUsers = async () => {
    const result = await performAsyncOperation(
      async () => {
        return await UserService.getAll(1, 50);
      },
      loading,
      error
    );
    if (result) users.value = result;
  };

  const getByRole = computed(() => {
    const roleMap: Record<UserRole, UserRecord[]> = {
      admin: [],
      devops: [],
      developer: [],
    };

    if (users.value) {
      users.value.forEach(user => {
        if (user && user.role) {
          if (roleMap[user.role] !== undefined) {
            roleMap[user.role].push(user);
          }
        }
      });
    }
  });

  onMounted(async () => {
    await fetchUsers();
  });

  return {
    users,
    loading,
    error,
    getByRole,
  };
});
