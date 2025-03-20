import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Toast } from '@/components/ui/toast/use-toast';
import { useToast } from '@/components/ui/toast/use-toast';

const { toast } = useToast();

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

export const executeServiceOperation = async <T>(
  operation: () => Promise<T | undefined>,
  loading: Ref<Boolean>,
  error: Ref<any>,
  notifyFn?: () => void
) => {
  try {
    loading.value = true;
    return await operation();
  } catch (e: any) {
    error.value = e.message;
    if (notifyFn) notifyFn();
  } finally {
    loading.value = false;
  }
};
