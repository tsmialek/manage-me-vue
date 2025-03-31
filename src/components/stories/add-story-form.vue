<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

import { useAppStore } from '@/store';

const appStore = useAppStore();

const schema = z.object({});

import type { BaseProject } from '@/types';

async function onSubmit() {
  appStore.closeModal();
}
</script>
<template>
  <AutoForm class="space-y-6 min-w-[30rem]" :schema="schema" @submit="onSubmit">
    <Button type="submit">Submit</Button>
  </AutoForm>
</template>

<style scoped></style>
