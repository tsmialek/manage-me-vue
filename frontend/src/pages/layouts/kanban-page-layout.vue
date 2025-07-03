<script setup lang="ts">
import router from '@/router';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-vue-next';
import { Toaster } from '@/components/ui/toast';

defineProps<{
  title: string;
  description: string;
  error: string | null;
  addButtonLabel: string;
  separatorLabel: string;
}>();

const emit = defineEmits(['add']);
</script>

<template>
  <div class="relative">
    <div v-if="!error" class="p-4 space-y-4">
      <Card class="grid grid-cols-[1fr_auto] p-4">
        <slot name="header" :title="title">
          <h1 class="text-2xl font-semibold justify-self-center">
            {{ title }}
          </h1>
        </slot>
        <Button @click="router.go(-1)" class="justify-self-end">Back</Button>
      </Card>

      <Card class="p-4 space-y-4">
        <CardHeader v-if="description" class="space-y-2 p-2">
          <p><Badge>description:</Badge></p>
          <CardTitle>{{ description }}</CardTitle>
        </CardHeader>

        <Separator v-if="separatorLabel" :label="separatorLabel"></Separator>

        <CardContent class="p-0">
          <slot />
        </CardContent>
      </Card>
    </div>

    <div v-if="error">
      <Card class="grid grid-cols-[1fr_auto] m-2 p-2">
        <h1 class="text-2xl font-semibold justify-self-center">{{ error }}</h1>
        <Button @click="router.go(-1)" class="justify-self-end">Back</Button>
      </Card>
    </div>

    <Toaster />

    <Button @click="$emit('add')" class="fixed bottom-8 right-8">
      <PlusIcon />
      {{ addButtonLabel }}
    </Button>
  </div>
</template>
