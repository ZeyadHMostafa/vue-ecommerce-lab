import { ref } from 'vue';

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (status: number) => void;
}

export function useAsync<T>(
  asyncFn: (...args: any[]) => Promise<{ status: number; data: T | null }>,
  options?: UseAsyncOptions
) {
  const data = ref<T | null>(null);
  const isLoading = ref<boolean>(false);
  const errorStatus = ref<number | null>(null);

  const execute = async (...args: any[]) => {
    isLoading.value = true;
    errorStatus.value = null;

    try {
      const response = await asyncFn(...args);
      
      if (response.status === 200 && response.data) {
        data.value = response.data;
        if (options?.onSuccess) options.onSuccess(response.data);
      } else {
        errorStatus.value = response.status;
        if (options?.onError) options.onError(response.status);
      }
    } catch (err: any) {
      const status = err?.status || 505;
      errorStatus.value = status;
      if (options?.onError) options.onError(status);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    errorStatus,
    execute
  };
}