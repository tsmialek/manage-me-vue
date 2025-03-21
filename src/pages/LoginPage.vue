<script setup lang="ts">
import { Button } from '@/components/ui/button';

import { useUserStore } from '@/store/UserStore';
const userStore = useUserStore();
</script>

<template>
  <div>Siema eniu</div>
  <Button
    @click="
      userStore.logIn({
        email: 'tomek@manage-me.com',
        password: 'tomeksmialek',
      })
    "
  >
    Login
  </Button>
</template>
<style scoped></style>
