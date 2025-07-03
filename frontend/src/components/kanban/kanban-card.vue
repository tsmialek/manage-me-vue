<script setup lang="ts">
import { defineProps } from 'vue';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { variants } from '.';

defineProps<{
  variant: 'todo' | 'doing' | 'done';
}>();
</script>
<template>
  <Card :class="variants[variant]">
    <CardHeader class="px-4 py-6">
      <CardTitle class="text-center text-xl">
        <span>{{ variant.toUpperCase() }}</span>
      </CardTitle>
    </CardHeader>
    <CardContent class="lg:px-4 lg:pb-4 space-y-4">
      <slot />
    </CardContent>
  </Card>
</template>

<style scoped></style>
