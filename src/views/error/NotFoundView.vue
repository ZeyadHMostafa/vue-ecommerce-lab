<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{ 
  resourceName?: string;
  errorCode?: string | number;
}>();

const router = useRouter();
</script>

<template>
  <div class="hero min-h-[60vh] bg-base-200 rounded-box">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold text-warning">{{ errorCode || '404' }}</h1>
        <p class="py-6 font-medium">
          The requested {{ resourceName || 'resource' }} could not be found or does not exist.
        </p>
        <div class="flex justify-center gap-4">
          <button @click="router.back()" class="btn btn-outline">Go Back</button>
          <button @click="router.push('/')" class="btn btn-primary">Return Home</button>
        </div>
      </div>
    </div>
  </div>
</template>