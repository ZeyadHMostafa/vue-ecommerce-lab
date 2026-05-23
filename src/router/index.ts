import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import HomeView from '@/views/pages/HomeView.vue';
import AboutView from '@/views/pages/AboutView.vue';
import ProductView from '@/views/pages/ProductView.vue';
import NotFoundView from '@/views/error/NotFoundView.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: HomeView
      },
      {
        path: '/about',
        name: 'About',
        component: AboutView
      },
      {
        path: '/product/:id(\\d+)',
        name: 'ProductDetails',
        component: ProductView,
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
    ]
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