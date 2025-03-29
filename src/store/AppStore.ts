import { defineStore } from 'pinia';
import { markRaw, ref, shallowRef } from 'vue';

export const useAppStore = defineStore('app', () => {
  // Active modal reference
  const activeModal = ref<string | null>(null);

  // Modal data for passing to components
  const modalData = ref<Record<string, any>>({});

  // Modal title
  const modalTitle = ref<string>('');

  // Component to display in modal (using shallowRef for components)
  const modalComponent = shallowRef<any>(null);

  const openModal = (
    modalId: string,
    component: any,
    title: string = '',
    data: Record<string, any> = {}
  ) => {
    modalComponent.value = markRaw(component);
    modalTitle.value = title;
    modalData.value = data;
    activeModal.value = modalId;
  };

  const closeModal = () => {
    activeModal.value = null;
    modalData.value = {};
    modalComponent.value = null;
    modalTitle.value = '';
  };

  return {
    activeModal,
    modalData,
    modalTitle,
    modalComponent,
    openModal,
    closeModal,
  };
});
