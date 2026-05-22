import { shopifyFetch } from './client';
import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCollectionBasic,
  ShopifyCart,
  Product,
  Cart,
  CartItem,
} from './types';

// ─── Fragments ──────────────────────────────────────────────────────────────

const IMAGE_FRAGMENT = `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const PRICE_FRAGMENT = `
  fragment PriceFields on MoneyV2 {
    amount
    currencyCode
  }
`;

const PRODUCT_VARIANT_FRAGMENT = `
  fragment ProductVariantFields on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    price { ...PriceFields }
    compareAtPrice { ...PriceFields }
    selectedOptions { name value }
    image { ...ImageFields }
  }
`;

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage { ...ImageFields }
    images(first: 10) {
      edges { node { ...ImageFields } }
    }
    priceRange {
      minVariantPrice { ...PriceFields }
      maxVariantPrice { ...PriceFields }
    }
    compareAtPriceRange {
      minVariantPrice { ...PriceFields }
      maxVariantPrice { ...PriceFields }
    }
    options { id name values }
    variants(first: 100) {
      edges { node { ...ProductVariantFields } }
    }
    collections(first: 3) {
      edges { node { title handle } }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ...PriceFields }
      totalAmount { ...PriceFields }
      totalTaxAmount { ...PriceFields }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              product {
                id
                handle
                title
                vendor
                featuredImage { ...ImageFields }
              }
            }
          }
          cost {
            totalAmount { ...PriceFields }
            amountPerQuantity { ...PriceFields }
            compareAtAmountPerQuantity { ...PriceFields }
          }
        }
      }
    }
  }
`;

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeProduct(product: ShopifyProduct): Product {
  return {
    ...product,
    variantsList: product.variants.edges.map((e) => e.node),
    imagesList: product.images.edges.map((e) => e.node),
  };
}

function normalizeCart(cart: ShopifyCart): Cart {
  const items: CartItem[] = cart.lines.edges.map(({ node: line }) => ({
    id: line.merchandise.id,
    lineId: line.id,
    quantity: line.quantity,
    variantId: line.merchandise.id,
    variantTitle: line.merchandise.title,
    productTitle: line.merchandise.product.title,
    productHandle: line.merchandise.product.handle,
    vendor: line.merchandise.product.vendor,
    image: line.merchandise.product.featuredImage,
    price: line.cost.amountPerQuantity,
    compareAtPrice: line.cost.compareAtAmountPerQuantity,
    selectedOptions: line.merchandise.selectedOptions,
  }));

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    total: cart.cost.totalAmount,
    items,
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts({
  first = 12,
  sortKey = 'BEST_SELLING',
  reverse = false,
  query: searchQuery = '',
}: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
} = {}): Promise<Product[]> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
        edges { node { ...ProductFields } }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
    query: GQL,
    variables: { first, sortKey, reverse, query: searchQuery || undefined },
    revalidate: 60,
  });

  return data.products.edges.map((e) => normalizeProduct(e.node));
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: GQL,
    variables: { handle },
    revalidate: 60,
  });

  return data.product ? normalizeProduct(data.product) : null;
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query GetRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) { ...ProductFields }
    }
  `;

  const data = await shopifyFetch<{ productRecommendations: ShopifyProduct[] }>({
    query: GQL,
    variables: { productId },
    revalidate: 60,
  });

  return data.productRecommendations.slice(0, 4).map(normalizeProduct);
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function getCollections(): Promise<ShopifyCollectionBasic[]> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    query GetCollections {
      collections(first: 20, sortKey: UPDATED_AT) {
        edges {
          node {
            id handle title description
            image { ...ImageFields }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollectionBasic }[] };
  }>({ query: GQL, revalidate: 300 });

  return data.collections.edges.map((e) => e.node);
}

export async function getCollection({
  handle,
  first = 24,
  sortKey = 'BEST_SELLING',
  reverse = false,
  after,
}: {
  handle: string;
  first?: number;
  sortKey?: string;
  reverse?: boolean;
  after?: string;
}): Promise<ShopifyCollection | null> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query GetCollection(
      $handle: String!
      $first: Int!
      $sortKey: ProductCollectionSortKeys
      $reverse: Boolean
      $after: String
    ) {
      collection(handle: $handle) {
        id handle title description
        image { ...ImageFields }
        products(first: $first, sortKey: $sortKey, reverse: $reverse, after: $after) {
          edges { node { ...ProductFields } cursor }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query: GQL,
    variables: { handle, first, sortKey, reverse, after },
    revalidate: 60,
  });

  return data.collection;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart(): Promise<Cart> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation CreateCart {
      cartCreate { cart { ...CartFields } }
    }
  `;

  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: GQL,
    cache: 'no-store',
  });

  return normalizeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: GQL,
    variables: { cartId },
    cache: 'no-store',
  });

  return data.cart ? normalizeCart(data.cart) : null;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({
    query: GQL,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesAdd.userErrors?.length) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({
    query: GQL,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    cache: 'no-store',
  });

  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const GQL = `
    ${IMAGE_FRAGMENT}
    ${PRICE_FRAGMENT}
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({
    query: GQL,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  return normalizeCart(data.cartLinesRemove.cart);
}
