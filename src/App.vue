<script setup lang="ts">
import Modal from '@/components/modal.vue';
</script>
<template>
  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="slide" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <Modal />
  </main>
</template>

<style></style>
