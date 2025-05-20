import { defineStore } from 'pinia';
import { markRaw, ref, shallowRef } from 'vue';

export const useAppStore = defineStore('app', () => {
  const activeModal = ref<string | null>(null);
  const modalData = ref<Record<string, any>>({});
  const modalTitle = ref<string>('');
  const modalComponent = shallowRef<any>(null);
  const closeModalOnBlur = ref(true);

  const openModal = (
    modalId: string,
    component: any,
    title: string = '',
    data: Record<string, any> = {},
    closeOnBlur = true
  ) => {
    modalComponent.value = markRaw(component);
    modalTitle.value = title;
    modalData.value = data;
    activeModal.value = modalId;
    closeModalOnBlur.value = closeOnBlur;
  };

  const closeModal = () => {
    activeModal.value = null;
    modalData.value = {};
    modalComponent.value = null;
    modalTitle.value = '';
    closeModalOnBlur.value = true;
  };

  return {
    activeModal,
    modalData,
    modalTitle,
    modalComponent,
    closeModalOnBlur,
    openModal,
    closeModal,
  };
});
