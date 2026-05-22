'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ShopifyProductOption, ShopifyProductVariant } from '@/lib/shopify/types';

interface VariantSelectorProps {
  options: ShopifyProductOption[];
  variants: ShopifyProductVariant[];
  onVariantChange: (variant: ShopifyProductVariant) => void;
}

export function VariantSelector({ options, variants, onVariantChange }: VariantSelectorProps) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    options.forEach((opt) => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });

  const findVariant = useCallback(
    (selections: Record<string, string>): ShopifyProductVariant | undefined => {
      return variants.find((v) =>
        v.selectedOptions.every((opt) => selections[opt.name] === opt.value)
      );
    },
    [variants]
  );

  function handleSelect(optionName: string, value: string) {
    const newSelected = { ...selected, [optionName]: value };
    setSelected(newSelected);
    const variant = findVariant(newSelected);
    if (variant) onVariantChange(variant);
  }

  function isAvailable(optionName: string, value: string): boolean {
    const testSelected = { ...selected, [optionName]: value };
    const variant = findVariant(testSelected);
    return variant?.availableForSale ?? false;
  }

  // Don't render if only one option with "Default Title"
  const filteredOptions = options.filter(
    (opt) => !(opt.values.length === 1 && opt.values[0] === 'Default Title')
  );

  if (!filteredOptions.length) return null;

  const COLOR_KEYWORDS = ['color', 'color', 'tono', 'shade', 'tint'];

  return (
    <div className="space-y-4">
      {filteredOptions.map((option) => {
        const isColor = COLOR_KEYWORDS.some((kw) => option.name.toLowerCase().includes(kw));

        return (
          <div key={option.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800">{option.name}</span>
              <span className="text-sm text-gray-500">{selected[option.name]}</span>
            </div>

            {isColor ? (
              /* Color swatches */
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const available = isAvailable(option.name, value);
                  const isSelected = selected[option.name] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => available && handleSelect(option.name, value)}
                      disabled={!available}
                      title={value}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        isSelected
                          ? 'border-ultra-500 scale-110 ring-2 ring-ultra-200'
                          : 'border-gray-200 hover:border-ultra-300',
                        !available && 'opacity-40 cursor-not-allowed'
                      )}
                      style={{ backgroundColor: value.toLowerCase().replace(/\s/g, '') }}
                      aria-label={value}
                      aria-pressed={isSelected}
                    />
                  );
                })}
              </div>
            ) : (
              /* Text/pill options */
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const available = isAvailable(option.name, value);
                  const isSelected = selected[option.name] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => available && handleSelect(option.name, value)}
                      disabled={!available}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all',
                        isSelected
                          ? 'border-ultra-500 bg-ultra-50 text-ultra-700'
                          : 'border-gray-200 text-gray-700 hover:border-ultra-300 hover:bg-ultra-50',
                        !available &&
                          'opacity-40 cursor-not-allowed line-through decoration-gray-400'
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
