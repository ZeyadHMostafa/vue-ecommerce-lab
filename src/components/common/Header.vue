<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { MenuItem, NavigationDropdown } from '@/types/navigation';

// Type predicate function to help TypeScript infer dropdown nodes in the template safely
const isDropdown = (item: MenuItem): item is NavigationDropdown => {
  return 'children' in item;
};

withDefaults(defineProps<{
  shopName?: string;
  menuItems?: MenuItem[];
}>(), {
  shopName: 'ShopTitle',
  menuItems: () => [
    { name: 'Home', path: '/' },
    { 
      name: 'Products', 
      children: [
        { name: 'All Products', path: '/products' },
        { name: 'On Sale', path: '/sale' }
      ] 
    },
    { name: 'About', path: '/about' }
  ]
});
</script>

<template>
  <header class="navbar bg-base-100 shadow">
    <!-- Left: Brand -->
    <div class="flex-grow">
      <RouterLink to="/" class="btn btn-ghost text-xl font-bold">
        {{ shopName }}
      </RouterLink>
    </div>

    <!-- Right: Menu Links -->
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1 gap-1">
        <li v-for="(item, index) in menuItems" :key="index">
          
          <!-- Dropdown Option -->
          <details v-if="isDropdown(item)" class="dropdown dropdown-end">
            <summary class="cursor-pointer">{{ item.name }}</summary>
            <ul class="p-2 bg-base-100 rounded-box z-[1] shadow min-w-[150px]">
              <li v-for="child in item.children" :key="child.name">
                <RouterLink :to="child.path">{{ child.name }}</RouterLink>
              </li>
            </ul>
          </details>

          <!-- Singular Link Option -->
          <RouterLink v-else :to="item.path">{{ item.name }}</RouterLink>

        </li>
      </ul>
    </div>
  </header>
</template>