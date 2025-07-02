import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useToast } from '@/components/ui/toast/use-toast';
const { toast } = useToast();

export const showErrorToast = (error: any) => {
  toast({
    title: 'Error',
    variant: 'destructive',
    description: error.value.toString() ?? 'Something went wrong :(',
  });
};

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

export const performAsyncOperation = async <T>(
  operation: () => Promise<T | undefined>,
  loading: Ref<Boolean>,
  error: Ref<any>
) => {
  try {
    loading.value = true;
    return await operation();
  } catch (e: any) {
    error.value = e.message;
    showErrorToast(error);
  } finally {
    loading.value = false;
  }
};

export class DateUtils {
  static format(date: string) {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
