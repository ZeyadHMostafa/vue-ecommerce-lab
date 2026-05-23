<template>
  <footer class="bg-neutral text-neutral-content mt-auto">
    <!-- Main Footer Columns -->
    <div class="footer p-10 max-w-7xl mx-auto">
      <nav v-for="col in columns" :key="col.title">
        <h6 class="footer-title opacity-60">{{ col.title }}</h6>
        <a v-for="link in col.links" :key="link.name" :href="link.path" class="link link-hover">
          {{ link.name }}
        </a>
      </nav>
    </div>

    <!-- Copyright Bar -->
    <div class="footer footer-center p-4 bg-black/20 text-sm border-t border-base-content/10">
      <p>Copyright © {{ currentYear }} - All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface FooterLink {
  name: string;
  path: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

withDefaults(defineProps<{
  columns?: FooterColumn[];
}>(), {
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