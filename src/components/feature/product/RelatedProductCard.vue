<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

interface RelatedProduct {
  id: number | string;
  name: string;
  price: number;
  discount: number;
  image: string;
}

const props = defineProps<{ product: RelatedProduct }>();

const hasDiscount = computed(() => props.product.discount > 0);

const discountedPrice = computed(() => {
  if (!hasDiscount.value) return props.product.price;
  const saving = props.product.price * (props.product.discount / 100);
  return Number((props.product.price - saving).toFixed(2));
});

// Extracts numeric digits from string ID format "prod-123" to match route definitions
const numericId = computed(() => {
  if (typeof props.product.id === 'number') return props.product.id;
  return parseInt(props.product.id.replace(/\D/g, ''), 10);
});
</script>

<template>
  <RouterLink 
    :to="{ name: 'ProductDetails', params: { id: numericId } }"
    class="rounded-box h-64 bg-cover bg-center relative overflow-hidden flex flex-col justify-end group cursor-pointer"
    :style="{ backgroundImage: `url(${product.image})` }"
  >
    <!-- Overlay darkener that responds to hover context -->
    <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-200"></div>

    <!-- Info Banner Text Container -->
    <div class="bg-black/60 p-4 text-white z-10 w-full backdrop-blur-[2px]">
      <h4 class="font-bold text-sm truncate group-hover:text-primary transition-colors duration-200">
        {{ product.name }}
      </h4>
      
      <div class="text-xs mt-1">
        <template v-if="hasDiscount">
          <span class="font-semibold text-warning">${{ discountedPrice }}</span>
          <span class="line-through opacity-60 ml-2">${{ product.price }}</span>
        </template>
        <template v-else>
          <span>${{ product.price }}</span>
        </template>
      </div>
    </div>
  </RouterLink>
</template>