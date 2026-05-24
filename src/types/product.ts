export interface ProductItem {
  id: number | string;
  name: string;
  description: string;
  image: string;
  badge: string | null;
  price: number;
  discount: number;
  stock: number;
  tags: string[];
  relatedIds: string[];
}

// These remain identical to keep your UI components happy
export interface MainProduct extends Omit<ProductItem, 'relatedIds'> {}
export interface ProductMinified extends Pick<ProductItem, 'id' | 'name' | 'image' | 'price' | 'discount'> {}

export interface ProductPageData {
  mainProduct: MainProduct;
  relatedProducts: ProductMinified[];
}

export interface CachedProduct {
  data: ProductItem;
  retrievedAt: number;
}

export const minifyProduct = (prod: ProductItem): ProductMinified => ({
          id: prod.id,
          name: prod.name,
          image: prod.image,
          price: prod.price,
          discount: prod.discount
        })