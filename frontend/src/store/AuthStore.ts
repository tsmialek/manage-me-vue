import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStorage, StorageSerializers } from '@vueuse/core';
import axios from 'axios';

import type { NewUser, UserRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import { UserService } from '@/services';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = useStorage<UserRecord | null>(
    'current-user',
    null,
    undefined,
    {
      serializer: StorageSerializers.object,
    }
  );
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

  const apiLogIn = async (newUser: NewUser) => {
    const loginResponse = await performAsyncOperation(
      async () => {
        const response = await axios.post<{
          access_token: string;
          refresh_token: string;
        }>('http://localhost:3000/auth/login', {
          email: newUser.email,
          password: newUser.password,
        });
        console.log(response);
        return response.data;
      },
      loading,
      error
    );

    if (loginResponse) {
      localStorage.setItem(
        'manage-me-access-token',
        loginResponse.access_token
      );
      localStorage.setItem(
        'manage-me-refresh-token',
        loginResponse.refresh_token
      );
      logIn(newUser);
    }
  };

  const logOut = async () => {
    await performAsyncOperation(
      async () => {
        await UserService.logOut();
        currentUser.value = null;
        localStorage.removeItem('manage-me-access-token');
        localStorage.removeItem('manage-me-refresh-token');
        router.push({ name: 'Login' });
      },
      loading,
      error
    );
  };

  const currentUserId = computed(() => currentUser.value?.id ?? '');

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    currentUserId,
    fetchCurrentUser,
    logIn,
    apiLogIn,
    logOut,
  };
});
