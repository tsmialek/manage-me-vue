import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { NewUser, UserRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import UserService from '@/services/UserService';
import router from '@/router';

export const useUserStore = defineStore('users', () => {
  const currentUser = ref<UserRecord>(null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!currentUser.value);

  const fetchCurrentUser = async () => {
    const fetchResponse = await performAsyncOperation(
      async () => {
        return await UserService.getCurrentUser();
      },
      loading,
      error
    );
    currentUser.value = fetchResponse ?? null;
  };

  const logIn = async (newUser: NewUser) => {
    const loginResponse = await performAsyncOperation(
      async () => await UserService.logIn(newUser),
      loading,
      error
    );

    if (loginResponse) {
      currentUser.value = loginResponse;
      router.push({ name: 'Dashboard' });
    }
  };

  const logOut = async () => {
    await performAsyncOperation(
      async () => {
        await UserService.logOut();
        currentUser.value = null;
        router.push({ name: 'Login' });
      },
      loading,
      error
    );
  };

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    fetchCurrentUser,
    logIn,
    logOut,
  };
});
