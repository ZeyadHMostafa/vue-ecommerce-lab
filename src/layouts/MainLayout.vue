<script setup lang="ts">
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
</script>

<template>
  <!-- min-h-screen and flex-col forces footer to the bottom -->
  <div class="flex flex-col min-h-screen bg-base-200 text-base-content">
    
    <!-- Global Header -->
    <Header />

    <!-- Dynamic Page Content -->
    <main class="flex-grow container mx-auto px-4 py-8 max-w-7xl">
      <router-view />
    </main>

    <!-- Global Footer -->
    <Footer />
    
  </div>
</template>