import mockJson from '@/data/productData.json';
import type { ProductItem, ProductPageData, ProductMinified } from '@/types/product';

const products = mockJson as ProductItem[];

export interface ServiceResponse<T> {
  data: T | null;
  status: number;
}

export const productService = {
  async getProductDetails(id: number): Promise<ServiceResponse<ProductPageData>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === 505) {
          return reject({ status: 505, message: "HTTP Version Not Supported / Server Error" });
        }

        const mainProduct = products.find(p => p.id.toString() === id.toString());
        
        if (!mainProduct) {
          return resolve({ data: null, status: 404 });
        }

        const relatedProducts = products
          .filter(p => mainProduct.relatedIds.includes(p.id.toString()))
          .map(({ id, name, image, price, discount }) => ({ id, name, image, price, discount }));

        resolve({
          data: { mainProduct, relatedProducts },
          status: 200
        });
      }, randomInt(100, 400));
    });
  },

  async getFeaturedProducts(): Promise<ServiceResponse<ProductMinified[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = products.slice(0, 3).map(
          ({ id, name, image, price, discount }) => ({
          id, name, image, price, discount
        }));

        resolve({
          data: featured,
          status: 200
        });
      }, randomInt(100, 400));
    });
  },

  async decrementStock(id: number | string): Promise<ServiceResponse<{ success: boolean; newStock: number }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the item inside our in-memory array copy
        const product = products.find(p => String(p.id) === `prod-${id}` || String(p.id) === String(id));
        
        if (!product || product.stock <= 0) {
          return resolve({ data: { success: false, newStock: 0 }, status: 400 });
        }

        product.stock -= 1;

        resolve({
          data: { success: true, newStock: product.stock },
          status: 200
        });
      }, 150); // Fast response for localized actions
    });
  }
};



// actually helped me discover a bug with scroll behavior on product change
function randomInt(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start) + start);
}
