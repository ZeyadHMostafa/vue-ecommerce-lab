import { ref } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';

export function useAddToCart() {
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const isAdding = ref(false);

  const addOptimistically = async (id: string | number) => {
    const stringId = String(id);
    const cachedItem = productStore.productCache[stringId];

    // Early exit if out of stock or item isn't in cache
    if (!cachedItem || cachedItem.data.stock <= 0) {
      console.warn(`Product ${stringId} is out of stock or uncached.`);
      return;
    }

    isAdding.value = true;

    // 1. Snapshot old state for potential rollback
    const originalStock = cachedItem.data.stock;

    // 2. Optimistic Update (Immediate UI response)
    cachedItem.data.stock -= 1;
    cartStore.addToCart(stringId);

    try {
      // 3. Sync with network database behind the scenes
      // Modify productStore.decrementStock slightly if needed, or rely on its standard fetch
      const success = await productStore.decrementStock(stringId);
      
      if (!success) {
        throw new Error('Server rejected stock update');
      }
    } catch (error) {
      console.error('Failed to sync cart change to server, rolling back:', error);
      
      // 4. Rollback state instantly on failure
      cachedItem.data.stock = originalStock;
      cartStore.removeFromCart(stringId);
      
      // Optional: You could trigger a toast notification or alert here
      alert('Could not update stock on server. Cart selection was reversed.');
    } finally {
      isAdding.value = false;
    }
  };

  return {
    addOptimistically,
    isAdding
  };
}