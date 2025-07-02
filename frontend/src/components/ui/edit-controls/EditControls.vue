<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { CheckIcon, XIcon } from 'lucide-vue-next';

interface Props {
  saveLabel?: string;
  cancelLabel?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

interface Emits {
  (e: 'save'): void;
  (e: 'cancel'): void;
}

withDefaults(defineProps<Props>(), {
  saveLabel: 'Save',
  cancelLabel: 'Cancel',
  size: 'sm',
  variant: 'default',
});

const emit = defineEmits<Emits>();
</script>

<template>
  <div class="flex justify-between">
    <Button :size="size" @click="emit('save')">
      <CheckIcon class="w-4 h-4 mr-1" />
      {{ saveLabel }}
    </Button>
    <Button variant="outline" :size="size" @click="emit('cancel')">
      <XIcon class="w-4 h-4 mr-1" />
      {{ cancelLabel }}
    </Button>
  </div>
</template>
