import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { NewUser, UserRecord } from '@/types';
import { executeServiceOperation } from '@/lib/utils';
import UserService from '@/services/UserService';

export const useUserStore = defineStore('users', () => {
  const currentUser = ref<UserRecord>(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchCurrentUser = async () => {
    return await executeServiceOperation(
      async () => {
        return await UserService.getCurrentUser();
      },
      loading,
      error
    );
  };

  const logIn = async (newUser: NewUser) => {
    const loginResponse = await executeServiceOperation(
      async () => await UserService.logIn(newUser),
      loading,
      error
    );

    currentUser.value = loginResponse ?? null;
  };

  const logOut = async () => {};

  return {
    currentUser,
    loading,
    error,
    fetchCurrentUser,
    logIn,
    logOut,
  };
});
