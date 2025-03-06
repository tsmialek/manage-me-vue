import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref
) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export function useColorMode() {
  const colorMode = ref('light');

  const getColorMode = computed(() => colorMode.value);
  function setColorMode(mode: string) {
    if (mode === 'light' || mode === 'dark') colorMode.value = mode;
    else console.warn('Unsupported color mode provided');
  }

  function applyColorMode(mode: string): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);
  }

  watch(colorMode, (newMode: string) => {
    applyColorMode(newMode);
  });

  return {
    colorMode: getColorMode,
    setColorMode,
  };
}
