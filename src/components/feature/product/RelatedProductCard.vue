<script setup lang="ts">
import { computed } from 'vue';

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
</script>

<template>
  <div 
    class="rounded-box h-64 bg-cover bg-center relative overflow-hidden flex flex-col justify-end"
    :style="{ backgroundImage: `url(${product.image})` }"
  >
    <div class="bg-black/60 p-4 text-white">
      <h4 class="font-bold text-sm truncate">{{ product.name }}</h4>
      
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
  </div>
</template>