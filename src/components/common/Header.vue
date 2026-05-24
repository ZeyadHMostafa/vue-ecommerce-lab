<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { MenuItem, NavigationDropdown } from '@/types/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useLifecycleLogger } from '@/composables/useLifeCycleLogger';

useLifecycleLogger('[Component] Header');

const cartStore = useCartStore();

const isDropdown = (item: MenuItem): item is NavigationDropdown => {
  return 'children' in item;
};

withDefaults(defineProps<{
  shopName?: string;
  menuItems?: MenuItem[];
  cartURL?: string;
}>(), {
  shopName: 'ShopTitle',
  cartURL: '/cart',
  menuItems: () => [
    { name: 'Home', path: '/' },
    { 
      name: 'Products', 
      children: [
        { name: 'Featured Item 101', path: '/product/101' },
        { name: 'Featured Item 102', path: '/product/102' }
      ] 
    },
    { name: 'About', path: '/about' }
  ]
});
</script>

<template>
  <header class="navbar bg-base-100 shadow">
    <div class="flex-grow">
      <RouterLink to="/" class="btn btn-ghost text-xl font-bold">
        {{ shopName }}
      </RouterLink>
    </div>

    <div class="flex-none">
      <ul class="menu menu-horizontal px-1 gap-1 items-center">
        <li v-for="(item, index) in menuItems" :key="index">
          
          <details v-if="isDropdown(item)">
            <summary class="cursor-pointer">{{ item.name }}</summary>
            <ul class="p-2 bg-base-100 rounded-box shadow min-w-[150px] z-10">
              <li v-for="child in item.children" :key="child.name">
                <RouterLink :to="child.path">{{ child.name }}</RouterLink>
              </li>
            </ul>
          </details>

          <RouterLink v-else :to="item.path">{{ item.name }}</RouterLink>

        </li>

        <li v-if="cartURL">
          <RouterLink :to="cartURL" class="flex gap-1 items-center">
            Cart
            <span v-if="cartStore.totalItems > 0" class="badge badge-primary font-mono text-xs">
              {{ cartStore.totalItems }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </header>
</template>