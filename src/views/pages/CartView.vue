<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import { useAsync } from '@/composables/useAsync';
import { useLifecycleLogger } from '@/composables/useLifeCycleLogger';

useLifecycleLogger('[View     ] CartView');

const cartStore = useCartStore();
const productStore = useProductStore();

const isCheckingOut = ref(false);
const checkoutError = ref<string | null>(null);
const checkoutSuccess = ref(false);

interface CartResolutionData {
  detailedItems: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  totalPrice: number;
}

const {
  data: cartData,
  isLoading,
  execute: loadCartDetails
} = useAsync<CartResolutionData>(cartStore.resolveCartDetails);

onMounted(() => {
  loadCartDetails();
});

const handleQuantityChange = async (action: 'add' | 'remove', id: string) => {
  if (action === 'add') {
    cartStore.addToCart(id);
  } else {
    cartStore.removeFromCart(id);
  }
  // Reactive mutation updates local presentation variables immediately
  await loadCartDetails();
};

const handleClearCart = async () => {
  cartStore.clearCart();
  await loadCartDetails();
};

const handleCheckout = async () => {
  if (cartStore.items.length === 0) return;
  
  isCheckingOut.value = true;
  checkoutError.value = null;
  checkoutSuccess.value = false;

  try {
    // 1. Direct one-shot batch action invocation
    await productStore.orderProducts(cartStore.items);
    
    // 2. Clear state elements cleanly on success
    cartStore.clearCart(); 
    checkoutSuccess.value = true;
    
    // 3. Update view layout smoothly in place without an app reload
    if (cartData.value) {
      cartData.value.detailedItems = [];
      cartData.value.totalPrice = 0;
    }
  } catch (error: any) {
    // Collect errors from rejected promises and display them on-screen
    checkoutError.value = error?.message || 'An error occurred during checkout. Please try again.';
    console.error('Checkout failure:', error);
  } finally {
    isCheckingOut.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h2 class="text-2xl font-bold mb-6">Your Shopping Cart</h2>

    <div v-if="checkoutSuccess" class="alert alert-success mb-6">
      <span>Checkout successful! Your order has been processed.</span>
    </div>

    <div v-if="checkoutError" class="alert alert-error mb-6">
      <span>{{ checkoutError }}</span>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[30vh]">
      <span class="loading loading-ring loading-lg text-primary"></span>
    </div>

    <div v-else-if="!cartData || cartData.detailedItems.length === 0" class="text-center py-12 bg-base-200 rounded-box">
      <p class="text-xl text-base-content/70 mb-4">Your cart is currently empty.</p>
      <router-link to="/" class="btn btn-primary">Continue Shopping</router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 overflow-x-auto bg-base-100 border border-base-200 rounded-box">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Product</th>
              <th class="text-center">Quantity</th>
              <th class="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartData.detailedItems" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar" v-if="item.image">
                    <div class="mask mask-squircle w-12 h-12">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold max-w-[180px] truncate">{{ item.name }}</div>
                    <div class="text-xs opacity-50">ID: {{ item.id }}</div>
                  </div>
                </div>
              </td>
              
              <td class="text-center">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    class="btn btn-xs btn-circle btn-outline" 
                    :disabled="isCheckingOut"
                    @click="handleQuantityChange('remove', item.id)"
                  >
                    -
                  </button>
                  <span class="font-mono text-sm w-6">{{ item.quantity }}</span>
                  <button 
                    class="btn btn-xs btn-circle btn-outline" 
                    :disabled="isCheckingOut"
                    @click="handleQuantityChange('add', item.id)"
                  >
                    +
                  </button>
                </div>
              </td>
              
              <td class="text-right font-mono font-medium">
                ${{ item.subtotal.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card bg-base-200 shadow-sm h-fit">
        <div class="card-body">
          <h3 class="card-title text-lg border-b border-base-300 pb-2 mb-2">Order Summary</h3>
          
          <div class="flex justify-between items-center my-2">
            <span>Total Items:</span>
            <span class="font-mono font-bold">{{ cartStore.totalItems }}</span>
          </div>
          
          <div class="flex justify-between items-center my-2 text-lg font-bold">
            <span>Total Amount:</span>
            <span class="text-primary font-mono">${{ cartData.totalPrice.toFixed(2) }}</span>
          </div>

          <div class="card-actions flex flex-col gap-2 mt-4">
            <button 
              class="btn btn-primary btn-block" 
              :disabled="isCheckingOut"
              @click="handleCheckout"
            >
              <span v-if="isCheckingOut" class="loading loading-spinner loading-sm"></span>
              Confirm Checkout
            </button>
            
            <button 
              class="btn btn-ghost btn-block text-error btn-sm" 
              :disabled="isCheckingOut"
              @click="handleClearCart"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>