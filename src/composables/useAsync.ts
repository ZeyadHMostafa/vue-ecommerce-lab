import { ref } from 'vue';

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (status: number) => void;
}

type AsyncFunctionResponse<T> = 
  | { status: number; data: T | null } 
  | T;

export function useAsync<T>(
  asyncFn: (...args: any[]) => Promise<AsyncFunctionResponse<T>>,
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
      
      if (response && typeof response === 'object' && 'status' in response && 'data' in response) {
        if (response.status === 200 && response.data) {
          data.value = response.data as T;
          if (options?.onSuccess) options.onSuccess(response.data);
        } else {
          errorStatus.value = response.status;
          if (options?.onError) options.onError(response.status);
        }
      } 
      // 2. Handle Raw Store Signature: Directly returns the payload data T
      else {
        data.value = response as T;
        if (options?.onSuccess) options.onSuccess(response);
      }

    } catch (err: any) {
      const status = err?.status || 500;
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