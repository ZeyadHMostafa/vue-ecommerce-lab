// src/router/index.ts
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import ProductDetailsPage from '@/views/pages/ProductView.vue';
import NotFoundView from '@/views/error/NotFoundView.vue';

const routes = [
  {
    path: '/',
    redirect: '/product/101'
  },
  {
    path: '/product/:id(\\d+)',
    name: 'ProductDetails',
    component: ProductDetailsPage,
    props: (route: RouteLocationNormalized) => ({ id: parseInt(route.params.id as string, 10) })
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    props: { 
      resourceName: 'page', 
      errorCode: 404 
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;