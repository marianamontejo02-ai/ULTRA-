import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new' | 'soldout' | 'bestseller' | 'promo';
  className?: string;
}

const variantStyles = {
  sale: 'bg-red-500 text-white',
  new: 'bg-ultra-500 text-white',
  soldout: 'bg-gray-400 text-white',
  bestseller: 'bg-amber-500 text-white',
  promo: 'bg-emerald-500 text-white',
};

export function Badge({ children, variant = 'new', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
