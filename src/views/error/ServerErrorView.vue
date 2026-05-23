<script setup lang="ts">
import {useLifecycleLogger} from '@/composables/useLifeCycleLogger';
useLifecycleLogger('[View     ] ServerErrorView');

defineProps<{
  errorCode?: string | number;
  message?: string;
}>();

const emit = defineEmits<{ (e: 'retry'): void }>();
</script>

<template>
  <div class="hero min-h-[60vh] bg-base-200 rounded-box">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold text-error">{{ errorCode || '505' }}</h1>
        <p class="py-6 font-medium">
          {{ message || 'A server error occurred while retrieving data.' }}
        </p>
        <div class="flex justify-center gap-4">
          <button @click="emit('retry')" class="btn btn-primary">
            Refresh / Retry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>