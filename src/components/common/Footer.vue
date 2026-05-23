<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { FooterColumn } from '@/types/navigation';
import {useLifecycleLogger} from '@/composables/useLifeCycleLogger';
useLifecycleLogger('[Component] Footer');

withDefaults(defineProps<{
  shopName?: string;
  columns?: FooterColumn[];
}>(), {
  shopName: 'ShopTitle',
  columns: () => [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Use', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' }
      ]
    }
  ]
});

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="bg-neutral text-neutral-content mt-auto">
    <!-- Main Footer Columns -->
    <div class="footer p-10 max-w-7xl mx-auto">
      <nav v-for="col in columns" :key="col.title">
        <h6 class="footer-title opacity-60">{{ col.title }}</h6>
        <RouterLink 
          v-for="link in col.links" 
          :key="link.name" 
          :to="link.path" 
          class="link link-hover"
        >
          {{ link.name }}
        </RouterLink>
      </nav>
    </div>

    <!-- Copyright Bar -->
    <div class="footer footer-center p-4 bg-black/20 text-sm border-t border-base-content/10">
      <p>Copyright © {{ currentYear }} {{ shopName }} - All rights reserved.</p>
    </div>
  </footer>
</template>