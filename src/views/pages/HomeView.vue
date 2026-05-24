<script setup lang="ts">
import { onMounted } from 'vue';
import CarouselBanner from '@/components/common/CarouselBanner.vue';
import ProductCard from '@/components/feature/product/ProductCard.vue';
import NotFoundView from '@/views/error/NotFoundView.vue';
import ServerErrorView from '@/views/error/ServerErrorView.vue';
import { useProductStore } from '@/stores/productStore';
import { useAsync } from '@/composables/useAsync';
import type { ProductMinified } from '@/types/product';
import { useLifecycleLogger } from '@/composables/useLifeCycleLogger';
useLifecycleLogger('[View     ] HomeView');

const { fetchFeaturedProducts } = useProductStore();

const {
  data: featuredProducts,
  isLoading,
  errorStatus,
  execute: fetchFeatured
} = useAsync<ProductMinified[]>(fetchFeaturedProducts);

onMounted(() => {
  fetchFeatured();
});

const handleRetry = () => {
  fetchFeatured();
};
</script>

<template>
	<div class="flex flex-col gap-12">
		
		<!-- 1. Top Banner Rotator Section -->
		<section>
			<CarouselBanner />
		</section>

		<!-- 2. Async Loading State Layer -->
		<div v-if="isLoading" class="flex justify-center items-center min-h-[30vh]">
			<span class="loading loading-ring loading-lg text-primary"></span>
		</div>

		<!-- 3. Error Fallback Layer -->
		<template v-else-if="errorStatus">
			<NotFoundView 
				v-if="errorStatus === 404" 
				resource-name="featured items" 
				:error-code="404" 
			/>
			<ServerErrorView 
				v-else 
				:error-code="errorStatus" 
				message="Could not load featured products at this time." 
				@retry=handleRetry 
			/>
		</template>

		<!-- 4. Featured Product Catalog Grid Layout -->
		<section v-else-if="featuredProducts && featuredProducts.length > 0" class="flex flex-col gap-6">
			<div class="border-b border-base-300 pb-2">
				<h2 class="text-2xl font-bold tracking-tight">Featured Products</h2>
				<p class="text-sm text-base-content/60">Handpicked items top-rated by our community.</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<ProductCard 
					v-for="product in featuredProducts" 
					:key="product.id" 
					:product="product" 
				/>
			</div>
		</section>

	</div>
</template>