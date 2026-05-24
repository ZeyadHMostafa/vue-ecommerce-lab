import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useProductStore } from './productStore';

export interface CartItem {
  id: string;
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const productStore = useProductStore();

  const items = ref<CartItem[]>(
    JSON.parse(localStorage.getItem('ecommerce_cart') || '[]')
  );

  // Sync state changes to localStorage automatically
  watch(
    items,
    (newItems) => {
      localStorage.setItem('ecommerce_cart', JSON.stringify(newItems));
    },
    { deep: true }
  );

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

	// NOTE: that this is why we need to use the productStore here
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      // Pull product from productCache dictionary safely
      const cachedProduct = productStore.productCache[item.id]?.data;
      
      if (!cachedProduct) return total;

      // Handle discount calculations if applicable
      const finalPrice = cachedProduct.discount 
        ? cachedProduct.price * (1 - cachedProduct.discount / 100) 
        : cachedProduct.price;

      return total + finalPrice * item.quantity;
    }, 0);
  });

  const addToCart = (id: string | number) => {
    const stringId = String(id);
    const existingItem = items.value.find((item) => item.id === stringId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({ id: stringId, quantity: 1 });
    }
  };

  const removeFromCart = (id: string | number) => {
    const stringId = String(id);
    const index = items.value.findIndex((item) => item.id === stringId);

    if (index !== -1) {
      if (items.value[index]!.quantity > 1) {
        items.value[index]!.quantity -= 1;
      } else {
        items.value.splice(index, 1);
      }
    }
  };

	const getCartItemQuantity = (id: string | number): number => {
		const stringId = String(id);
		const cartItem = items.value.find((item) => item.id === stringId);
		return cartItem ? cartItem.quantity : 0;
	};

	const resolveCartDetails = async () => {
    if (items.value.length === 0) {
      return { detailedItems: [], totalPrice: 0 };
    }

    const targetIds = items.value.map(item => item.id);
    
    // Leverage the batch fetcher from productStore to guarantee the data is present
    const rawProducts = await productStore.getOrFetchMultipleProducts(targetIds);

    let totalPrice = 0;
    
    const detailedItems = items.value.map(item => {
      const prod = rawProducts.find(p => String(p.id) === item.id);
      
      const price = prod ? prod.price : 0;
      const discount = prod ? prod.discount : 0;
      const name = prod ? prod.name : `Product #${item.id}`;
      const image = prod ? prod.image : '';
      
      const finalPrice = discount ? price * (1 - discount / 100) : price;
      const subtotal = finalPrice * item.quantity;
      
      totalPrice += subtotal;

      return {
        id: item.id,
        name,
        image,
        quantity: item.quantity,
        unitPrice: finalPrice,
        subtotal
      };
    });

    return {
      detailedItems,
      totalPrice
    };
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
		getCartItemQuantity,
		resolveCartDetails
  };
});