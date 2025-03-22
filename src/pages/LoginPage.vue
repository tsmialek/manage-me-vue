<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toast';
import { AutoForm } from '@/components/ui/auto-form';
import * as z from 'zod';

import { useUserStore } from '@/store';
import type { NewUser } from '@/types';

const userStore = useUserStore();

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

async function onSubmit(credentials: NewUser) {
  userStore.logIn(credentials);
}
</script>

<template>
  <div class="space-y-7 max-w-80 mt-20 m-auto">
    <h1 class="text-4xl font-semibold text-center">Manage-me</h1>
    <AutoForm
      class="space-y-6"
      :schema="schema"
      :field-config="{
        password: { inputProps: { type: 'password' } },
      }"
      @submit="onSubmit"
    >
      <Button type="submit">Log in</Button>
    </AutoForm>
  </div>
  <Toaster />
</template>
<style scoped></style>
