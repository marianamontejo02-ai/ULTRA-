export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyMoneyRange {
  minVariantPrice: ShopifyPrice;
  maxVariantPrice: ShopifyPrice;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  priceRange: ShopifyMoneyRange;
  compareAtPriceRange: ShopifyMoneyRange;
  options: ShopifyProductOption[];
  variants: { edges: { node: ShopifyProductVariant }[] };
  collections: { edges: { node: { title: string; handle: string } }[] };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: { node: ShopifyProduct; cursor: string }[];
    pageInfo: { hasNextPage: boolean; endCursor: string };
  };
}

export interface ShopifyCollectionBasic {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: ShopifySelectedOption[];
    product: {
      id: string;
      handle: string;
      title: string;
      vendor: string;
      featuredImage: ShopifyImage | null;
    };
  };
  cost: {
    totalAmount: ShopifyPrice;
    amountPerQuantity: ShopifyPrice;
    compareAtAmountPerQuantity: ShopifyPrice | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: { edges: { node: ShopifyCartLine }[] };
}

// Normalized types for app use
export type Product = ShopifyProduct & {
  variantsList: ShopifyProductVariant[];
  imagesList: ShopifyImage[];
};

export type CartItem = {
  id: string;
  lineId: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  vendor: string;
  image: ShopifyImage | null;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: ShopifySelectedOption[];
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: ShopifyPrice;
  total: ShopifyPrice;
  items: CartItem[];
};
