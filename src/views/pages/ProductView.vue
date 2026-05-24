<script setup lang="ts">
import { watch, onMounted, nextTick, computed } from 'vue';
import ProductDetailsSection from '@/components/feature/product/ProductDetails.vue';
import RelatedProductCard from '@/components/feature/product/ProductCard.vue';
import NotFoundView from '@/views/error/NotFoundView.vue';
import ServerErrorView from '@/views/error/ServerErrorView.vue';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import type { ProductPageData } from '@/types/product';
import { useAsync } from '@/composables/useAsync';
import { useLifecycleLogger } from '@/composables/useLifeCycleLogger';

useLifecycleLogger('[View     ] ProductView');

const productStore = useProductStore();
const cartStore = useCartStore();

const props = defineProps<{ id: number | string }>();

const { 
  data: fetchedProductData, 
  isLoading, 
  errorStatus, 
  execute: fetchProductData 
} = useAsync<ProductPageData>(productStore.fetchProductPage);

const productData = computed(() => {
  if (!fetchedProductData.value) return null;

  // Clone top-level structure to safely modify properties for the template
  const data = { ...fetchedProductData.value };
  const mainProductId = String(data.mainProduct.id);

  // Look up cart quantity for the main product
  const cartQuantity = cartStore.getCartItemQuantity(mainProductId);

  // Apply visual-only mutation to stock count
  data.mainProduct = {
    ...data.mainProduct,
    stock: Math.max(0, data.mainProduct.stock - cartQuantity)
  };

  return data;
});

watch(
  () => props.id,
  async (newId) => {
    if (newId) {
      await fetchProductData(newId);
      await nextTick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
);

onMounted(() => {
  fetchProductData(props.id);
});

const onAddToCart = (id: string | number) => {
  const stringId = String(id);
  if (productData.value?.mainProduct.id !== stringId) {
    console.warn(`Attempted to add product with id ${stringId} to cart, but it does not match the main product on this page.`);
    return;
  } else if (productData.value.mainProduct.stock <= 0) {
    console.warn(`Attempted to add product with id ${stringId} to cart, but it is out of stock.`);
    return;
  } else {
    cartStore.addToCart(stringId);
  }
};

const handleRetry = () => {
  fetchProductData(props.id);
};
</script>

<template>
  
  <div v-if="isLoading" class="flex justify-center items-center min-h-[50vh]">
    <span class="loading loading-ring loading-lg text-primary"></span>
  </div>

  <template v-else-if="errorStatus">
    <NotFoundView 
      v-if="errorStatus === 404" 
      resource-name="product" 
      :error-code="404" 
    />
    <ServerErrorView 
      v-else 
      :error-code="errorStatus" 
      message="An unexpected server condition occurred while fetching this product." 
      @retry="handleRetry" 
    />
  </template>

  <div v-else-if="productData" class="flex flex-col gap-12">
    <section>
      <ProductDetailsSection 
        :product="productData.mainProduct" 
        @add-to-cart="onAddToCart"
      />
    </section>

    <section v-if="productData.relatedProducts.length > 0" class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">Related Products:</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <RelatedProductCard 
          v-for="item in productData.relatedProducts" 
          :key="item.id" 
          :product="item"
        />
      </div>
    </section>
  </div>

</template>