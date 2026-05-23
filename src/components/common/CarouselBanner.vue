<script setup lang="ts">
withDefaults(defineProps<{
  images?: string[];
}>(), {
  images: () => [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80'
  ]
});
</script>

<template>
  <div class="carousel w-full rounded-box h-64 md:h-96 relative shadow-md">
    <div 
      v-for="(url, index) in images" 
      :key="index" 
      :id="`slide-${index}`" 
      class="carousel-item relative w-full h-full"
    >
      <!-- Carousel Image Cover Layer -->
      <img :src="url" class="w-full h-full object-cover" alt="Banner Slide Image" />
      
      <!-- Slide Navigation Control Triggers -->
      <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a 
          :href="`#slide-${index === 0 ? images.length - 1 : index - 1}`" 
          class="btn btn-circle btn-sm md:btn-md bg-black/40 text-white border-none hover:bg-black/60"
        >
          PREV
        </a> 
        <a 
          :href="`#slide-${index === images.length - 1 ? 0 : index + 1}`" 
          class="btn btn-circle btn-sm md:btn-md bg-black/40 text-white border-none hover:bg-black/60"
        >
          NEXT
        </a>
      </div>
    </div>
  </div>
</template>