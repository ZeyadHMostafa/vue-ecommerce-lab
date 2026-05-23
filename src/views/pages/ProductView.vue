<script setup lang="ts">
import { watch, onMounted, onUnmounted, nextTick } from 'vue';
import ProductDetailsSection from '@/components/feature/product/ProductDetails.vue';
import RelatedProductCard from '@/components/feature/product/ProductCard.vue';
import NotFoundView from '@/views/error/NotFoundView.vue';
import ServerErrorView from '@/views/error/ServerErrorView.vue';
import { productService } from '@/services/productService';
import type { ProductPageData } from '@/types/product';
import {useAsync} from '@/composables/useAsync';
import {useLifecycleLogger} from '@/composables/useLifeCycleLogger';
useLifecycleLogger('[View     ] ProductView');

const props = defineProps<{ id: number }>();

const { 
  data: productData, 
  isLoading, 
  errorStatus, 
  execute: fetchProductData 
} = useAsync<ProductPageData>(productService.getProductDetails);

watch(
  () => props.id,
  async (newId) => {
    if (newId) {
      await fetchProductData(newId);
      await nextTick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // if waiting is too much I could have used: behavior: 'auto'
      // but I like the smooth scroll effect

    }
  }
);

onMounted(() => {
  fetchProductData(props.id);
});

const onAddToCart = async (id: string | number) => {
  try {
    const response = await productService.decrementStock(id);
    if (response.status === 200 && response.data?.success) {
      // Re-run your useAsync execute function to update the productData ref in place
      fetchProductData(props.id);
    }
  } catch (error) {
    console.error("Failed to update stock:", error);
  }
};

const handleRetry = () => {
  fetchProductData(props.id);
};
</script>

<template>
  
  <!-- 1. LOADING LAYER -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-[50vh]">
    <span class="loading loading-ring loading-lg text-primary"></span>
  </div>

  <!-- 2. ERROR LAYERS -->
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

  <!-- 3. SUCCESS CONTENT LAYER -->
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