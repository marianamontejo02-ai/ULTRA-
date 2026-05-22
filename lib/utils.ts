import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ShopifyPrice } from './shopify/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: ShopifyPrice): string {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: price.currencyCode === 'COP' ? 'COP' : price.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDiscountPercentage(
  price: ShopifyPrice,
  compareAtPrice: ShopifyPrice | null
): number {
  if (!compareAtPrice) return 0;
  const original = parseFloat(compareAtPrice.amount);
  const current = parseFloat(price.amount);
  if (original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function createUrl(
  pathname: string,
  params: URLSearchParams | Record<string, string>
): string {
  const searchParams =
    params instanceof URLSearchParams ? params : new URLSearchParams(params);
  const paramsString = searchParams.toString();
  return `${pathname}${paramsString ? `?${paramsString}` : ''}`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
