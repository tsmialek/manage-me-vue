<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { X } from 'lucide-vue-next';
import { computed } from 'vue';

import { useAppStore } from '@/store';

const appStore = useAppStore();
const isVisible = computed(() => appStore.activeModal !== null);
const props = defineProps<{
  showOn?: string;
}>();

const showOn = props.showOn || 'body';
</script>
<template>
  <transition name="fade" mode="default">
    <teleport :to="showOn">
      <div
        class="modal-overlay"
        @click="appStore.closeModal()"
        v-if="isVisible"
      >
        <div id="modal-body" class="bg-background rounded-xl p-4" @click.stop>
          <div
            id="modal-header"
            class="w-full flex justify-between items-center pb-4 border-b-2 gap-4"
          >
            <h2 v-if="appStore.modalTitle" class="text-xl">
              {{ appStore.modalTitle }}
            </h2>
            <Button size="icon" @click="appStore.closeModal()" class="">
              <X />
            </Button>
          </div>
          <div id="modal-main-content" class="mt-4">
            <component
              v-if="appStore.modalComponent"
              :is="appStore.modalComponent"
              v-bind="appStore.modalData"
              @close="appStore.closeModal()"
            />
            <slot v-else />
          </div>
        </div>
      </div>
    </teleport>
  </transition>
</template>

<style scoped></style>
