<template>
  <header class="navbar bg-base-100 shadow">
    <!-- Left: Brand -->
    <div class="flex-grow">
      <a class="btn btn-ghost text-xl font-bold">ShopTitle</a>
    </div>

    <!-- Right: Menu Links -->
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1 gap-1">
        <li v-for="(item, index) in menuItems" :key="index">
          
          <!-- Dropdown Option -->
          <details v-if="'children' in item" class="dropdown dropdown-end">
            <summary class="cursor-pointer">{{ item.name }}</summary>
            <ul class="p-2 bg-base-100 rounded-box z-[1] shadow min-w-[150px]">
              <li v-for="child in item.children" :key="child.name">
                <a :href="child.path">{{ child.name }}</a>
              </li>
            </ul>
          </details>

          <!-- Singular Link Option -->
          <a v-else :href="item.path">{{ item.name }}</a>

        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
interface SimpleLink {
  name: string;
  path: string;
}

interface DropdownLink {
  name: string;
  children: SimpleLink[];
}

type MenuItem = SimpleLink | DropdownLink;

// Default items if none are supplied via props
withDefaults(defineProps<{
  menuItems?: MenuItem[];
}>(), {
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