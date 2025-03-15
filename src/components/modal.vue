<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { X } from 'lucide-vue-next';

const {
  title,
  showOn = 'body',
  show,
  component,
  componentProps,
} = defineProps<{
  title?: string;
  showOn?: string;
  show: boolean;
  component?: any;
  componentProps?: Record<string, any>;
}>();

const emits = defineEmits(['close']);
</script>
<template>
  <transition name="fade" mode="default">
    <teleport :to="showOn">
      <div class="modal-overlay" @click="emits('close')" v-if="show">
        <div id="modal-body" class="bg-background rounded-xl p-4" @click.stop>
          <div
            id="modal-header"
            class="w-full flex justify-between items-center pb-4 border-b-2 gap-4"
          >
            <h2 v-if="title" class="text-xl">{{ title }}</h2>
            <Button size="icon" @click="emits('close')" class="">
              <X />
            </Button>
          </div>
          <div id="modal-main-content" class="mt-4">
            <component
              v-if="component"
              :is="component"
              v-bind="componentProps"
              @close="emits('close')"
            />
            <slot v-else />
          </div>
        </div>
      </div>
    </teleport>
  </transition>
</template>

<style scoped></style>
