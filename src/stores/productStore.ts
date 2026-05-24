import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ProductItem, ProductPageData, ProductMinified, CachedProduct } from '@/types/product';
import { minifyProduct } from '@/types/product';

export const useProductStore = defineStore('product', () => {
  const productCache = ref<Record<string, CachedProduct>>({});
  
  // Cache expiration threshold: (in milliseconds)
  const CACHE_TTL = 60 * 1000 * import.meta.env.VITE_CACHE_TTL_MINUTES || 5; 

	const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/products';

  const isCacheValid = (id: string | number): boolean => {
    const cached = productCache.value[String(id)];
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.retrievedAt) < CACHE_TTL;
  };

  const getOrFetchRawProduct = async (id: string | number, forceRefresh = false): Promise<ProductItem> => {
    const stringId = String(id);

    if (isCacheValid(stringId) && !forceRefresh) {
			//Note: We can safely assert the presence of data here due to the cache validity check
			return productCache.value[stringId]!.data;
    }

    // Cache is either missing or stale -> fetch from json-server
    const response = await fetch(`${API_BASE}/${stringId}`);
    if (!response.ok) {
      throw { status: response.status, message: `Failed to fetch product ${stringId}` };
    }

    const data: ProductItem = await response.json();
    
    productCache.value[stringId] = {
      data,
      retrievedAt: Date.now()
    };

    return data;
  };

  const getOrFetchMultipleProducts = async (ids: (string | number)[]): Promise<ProductItem[]> => {
    const stringIds = ids.map(id => String(id));
    
    // Group IDs based on cache validity
    const validCachedProducts: ProductItem[] = [];
    const missingIds: string[] = [];

    stringIds.forEach(id => {
      if (isCacheValid(id)) {
        validCachedProducts.push(productCache.value[id]!.data);
      } else {
        missingIds.push(id);
      }
    });

    if (missingIds.length === 0) {
      return validCachedProducts;
    }


    const queryParams = missingIds.map(id => `id=${id}`).join('&');
    const response = await fetch(`${API_BASE}?${queryParams}`);
    
    if (!response.ok) {
      throw { status: response.status, message: `Failed to batch fetch products` };
    }

    const fetchedProducts: ProductItem[] = await response.json();
    const now = Date.now();

    fetchedProducts.forEach(prod => {
      productCache.value[String(prod.id)] = {
        data: prod,
        retrievedAt: now
      };
    });

    return [...validCachedProducts, ...fetchedProducts];
  };

  /**
   * Orchestrates the requirements for ProductView.
   * Pulls/Fetches the main product, then checks/fetches any missing related items.
   */
  const fetchProductPage = async (id: string | number): Promise<ProductPageData> => {
    const mainProduct = await getOrFetchRawProduct(id);

    let relatedProducts: ProductMinified[] = [];
    if (mainProduct.relatedIds.length > 0) {
      try {
        const rawRelated = await getOrFetchMultipleProducts(mainProduct.relatedIds);
        relatedProducts = rawRelated.map(minifyProduct);
      } catch (err) {
        console.warn(`Could not batch load related products.`, err);
      }
    }

    return {
      mainProduct,
      relatedProducts
    };
  };

  // Predefined list of featured product IDs
  const FEATURED_IDS = ['101', '102', '103'];

  /**
   * Fetches and returns the minified representation of the featured products
   */
  const fetchFeaturedProducts = async (): Promise<ProductMinified[]> => {
    const rawFeatured = await getOrFetchMultipleProducts(FEATURED_IDS);
    
    return rawFeatured.map(minifyProduct);
  };

  /**
   * Action to handle localized stock decrements directly syncing to the backend
   * WARNING: This is a simplified implementation. In a real-world scenario,
   * you would want to handle potential race conditions and ensure atomicity on the server side,
   * possibly with optimistic UI updates and rollback mechanisms.
   */
  const decrementStock = async (id: string | number): Promise<boolean> => {
    const stringId = String(id);
    const product = await getOrFetchRawProduct(stringId, true);
    const currentStock = product.stock;
    
    if (currentStock <= 0) return false;

    const response = await fetch(`${API_BASE}/${stringId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: currentStock - 1 })
    });

    if (response.ok) {
      const updatedProduct: ProductItem = await response.json();
      productCache.value[stringId] = {
        data: updatedProduct,
        retrievedAt: Date.now()
      };
      return true;
    }

    return false;
  };

  /**
   * Processes a multi-item batch order completely on the client-side while pushing
   * updates back to the REST backend. It updates the local cache dynamically 
   * and reports structural failures immediately without requiring full page drops.
   */
  const orderProducts = async (itemsToOrder: Array<{ id: string; quantity: number }>): Promise<void> => {
    const targetIds = itemsToOrder.map(item => item.id);
    
    const freshProducts = await getOrFetchMultipleProducts(targetIds);

    for (const orderItem of itemsToOrder) {
      const dbProd = freshProducts.find(p => String(p.id) === orderItem.id);
      if (!dbProd) {
        throw { status: 404, message: `Product ${orderItem.id} not found during checkout verification.` };
      }
      if (dbProd.stock < orderItem.quantity) {
        throw { status: 400, message: `Insufficient stock for "${dbProd.name}". Available: ${dbProd.stock}, Requested: ${orderItem.quantity}` };
      }
    }

    const patchPromises = itemsToOrder.map(async (orderItem) => {
      const dbProd = freshProducts.find(p => String(p.id) === orderItem.id)!;
      const nextStockValue = dbProd.stock - orderItem.quantity;

      const response = await fetch(`${API_BASE}/${orderItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nextStockValue })
      });

      if (!response.ok) {
        throw { status: response.status, message: `Network error finalizing stock adjustment for product ${orderItem.id}` };
      }

      const updatedProduct: ProductItem = await response.json();
      
      productCache.value[orderItem.id] = {
        data: updatedProduct,
        retrievedAt: Date.now()
      };
    });

    await Promise.all(patchPromises);
  };

  return {
    productCache,
    getOrFetchRawProduct,
    fetchProductPage,
    fetchFeaturedProducts,
    decrementStock,
    getOrFetchMultipleProducts,
    orderProducts
  };
});