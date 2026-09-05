'use server';

import { z } from 'genkit';

const MarketPricesInputSchema = z.object({
  location: z.string(),
});

export type MarketPricesInput = z.infer<typeof MarketPricesInputSchema>;

const MarketPricesOutputSchema = z.object({
  prices: z.array(
    z.object({
      crop: z.string(),
      price: z.number(),
      unit: z.string(),
    })
  ),
});

export type MarketPricesOutput = z.infer<typeof MarketPricesOutputSchema>;

export async function getMarketPrices(
  input: MarketPricesInput
): Promise<MarketPricesOutput> {
  // Demo market prices in INR.
  // Gemini is intentionally not used here, so the feature
  // does not depend on Gemini API quota.
  const prices = [
    { crop: 'Wheat', price: 2500, unit: 'per Quintal' },
    { crop: 'Rice', price: 3200, unit: 'per Quintal' },
    { crop: 'Cotton', price: 7200, unit: 'per Quintal' },
    { crop: 'Soybean', price: 4550, unit: 'per Quintal' },
    { crop: 'Onion', price: 2250, unit: 'per Quintal' },
    { crop: 'Maize', price: 2450, unit: 'per Quintal' },
    { crop: 'Tomato', price: 3100, unit: 'per Quintal' },
  ];

  return {
    prices,
  };
}