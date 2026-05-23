<script setup lang="ts">
import { ref } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import ProductDetailsSection from '@/components/feature/product/ProductDetailsSection.vue';
import RelatedProductCard from '@/components/feature/product/RelatedProductCard.vue';
// Import our local structured data
import mockJson from '@/data/productData.json';

// Initialize reactive data state
const productData = ref(mockJson);

// Central tracking method for cart interactions
const onAddToCart = (id: string | number) => {
  console.log(`Product added to cart context: ${id}`);
};
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-12">
      
      <!-- 1. Main Product Details Section -->
      <section>
        <ProductDetailsSection 
          :product="productData.mainProduct" 
          @add-to-cart="onAddToCart"
        />
      </section>

      <!-- 2. Related Products Section Wrapper (col div) -->
      <section class="flex flex-col gap-4">
        <!-- Section Header -->
        <h3 class="text-xl font-bold">Related Products:</h3>
        
        <!-- Grid wrapper for related components (row div wrapper) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <RelatedProductCard 
            v-for="item in productData.relatedProducts" 
            :key="item.id" 
            :product="item"
          />
        </div>
      </section>

    </div>
  </MainLayout>
</template>