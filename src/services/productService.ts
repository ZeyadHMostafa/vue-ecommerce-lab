import mockJson from '@/data/productData.json';
import type { ProductItem, ProductPageData } from '@/types/product';

const products = mockJson as ProductItem[];

export interface ServiceResponse<T> {
  data: T | null;
  status: number;
}

export const productService = {
  async getProductDetails(id: number): Promise<ServiceResponse<ProductPageData>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Dev Testing: Let's reserve specific numbers to test our new error layouts
        if (id === 505) {
          return reject({ status: 505, message: "HTTP Version Not Supported / Server Error" });
        }

        const mainProduct = products.find(p => p.id === `prod-${id}`);
        
        if (!mainProduct) {
          return resolve({ data: null, status: 404 });
        }

        const relatedProducts = products
          .filter(p => mainProduct.relatedIds.includes(String(p.id)))
          .map(({ id, name, image, price, discount }) => ({ id, name, image, price, discount }));

        resolve({
          data: { mainProduct, relatedProducts },
          status: 200
        });
      }, randomInt(100, 400));
    });
  }
};

// actually helped me discover a bug with scroll behavior on product change
function randomInt(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start) + start);
}
