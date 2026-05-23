<script setup lang="ts">
import { computed } from 'vue';
import type { MainProduct } from '@/types/product';
const props = defineProps<{ product: MainProduct }>();

const productBadgeStyles = new Map([
  ['limited offer', ['badge-primary']],
  ['new', ['badge-accent']]
]);
const emit = defineEmits<{ (e: 'add-to-cart', id: number | string): void }>();

// Check if a discount percentage actually exists and is greater than 0
const hasDiscount = computed(() => props.product.discount > 0);

// Compute the final discounted price based on the percentage
const discountedPrice = computed(() => {
  if (!hasDiscount.value) return props.product.price;
  const saving = props.product.price * (props.product.discount / 100);
  return Number((props.product.price - saving).toFixed(2));
});

const productBadgeStyle = computed(() => {
  if (!props.product.badge) return [];
  const badge = props.product.badge.toLowerCase();
  return productBadgeStyles.get(badge) || ['badge-secondary'];
});

const addToCart = () => {
  emit('add-to-cart', props.product.id);
};
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Product Image -->
    <div class="flex-1">
      <img :src="product.image" :alt="product.name" class="rounded-box w-full object-cover" />
    </div>

    <!-- Product Info (col layout) -->
    <div class="flex-1 flex flex-col gap-4">
      <!-- Title & Badge -->
      <div>
        <h1 class="text-3xl font-bold">{{ product.name }}</h1>
        <div v-if="product.badge" :class="['badge', 'mt-2'].concat(productBadgeStyle)">
          {{ product.badge }}
        </div>
      </div>

      <!-- Description Section -->
      <div>
        <h2 class="text-sm font-semibold text-opacity-50">Description</h2>
        <p>{{ product.description }}</p>
      </div>

      <!-- Price / Discount Logic using computed variables -->
      <div class="text-xl font-bold">
        <template v-if="hasDiscount">
          <span class="text-primary">${{ discountedPrice }}</span>
          <span class="line-through text-base ml-2 opacity-50">${{ product.price }}</span>
        </template>
        <template v-else>
          <span>${{ product.price }}</span>
        </template>
      </div>

      <!-- Tag List -->
      <div v-if="product.tags?.length">
        <h2 class="text-sm font-semibold text-opacity-50 mb-2">Tags</h2>
        <div class="grid grid-cols-3 gap-2">
          <span v-for="tag in product.tags" :key="tag" class="badge badge-outline w-full">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Add to Cart -->
      <button @click="addToCart" class="btn btn-primary w-full md:w-auto">
        Add to Cart
      </button>
    </div>
  </div>
</template>