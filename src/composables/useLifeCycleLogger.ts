import { onMounted, onUnmounted } from 'vue';

/**
 * Automatically logs a clean track message to the console 
 * when a component mounts and unmounts.
 * @param componentName The custom string identification tag for the logs
 */
export function useLifecycleLogger(componentName: string) {
  onMounted(() => {
    console.log(`[Lifecycle Check]: ++ Mounted -> ${componentName}`);
  });

  onUnmounted(() => {
    console.log(`[Lifecycle Check]: -- Unmounted -> ${componentName}`);
  });
}