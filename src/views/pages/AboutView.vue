<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';

interface AboutProps {
  personName?: string;
  courseName?: string;
  organizationName?: string;
  description?: string;
}

withDefaults(defineProps<AboutProps>(), {
  personName: 'Alex Mercer',
  courseName: 'Advanced Web Architecture',
  organizationName: 'Tech Academy Labs',
  description: 'Building modern, type-safe single page applications using Vue 3, TypeScript, and semantic utility frameworks like daisyUI.'
});
</script>

<template>
	<div class="hero min-h-[50vh] bg-base-100 rounded-box shadow-sm border border-base-200">
		<div class="hero-content text-center max-w-2xl p-8">
			<div class="flex flex-col gap-6">
				
				<!-- Heading Context -->
				<div>
					<h1 class="text-4xl font-bold tracking-tight mb-2">{{ personName }}</h1>
					<p class="text-sm font-semibold uppercase tracking-wider text-primary">
						{{ courseName }}
					</p>
				</div>

				<!-- Organization Badge Block -->
				<div class="flex justify-center">
					<span class="badge badge-neutral badge-lg py-4 px-6 font-medium">
						{{ organizationName }}
					</span>
				</div>

				<!-- Description Block -->
				<p class="text-base-content/80 leading-relaxed max-w-prose mx-auto">
					{{ description }}
				</p>

			</div>
		</div>
	</div>
</template>