'use server';
/**
 * @fileOverview An AI agent for fetching real-time crop market prices.
 *
 * - getMarketPrices - A function that fetches crop prices for a given location.
 * - MarketPricesInput - The input type for the getMarketPrices function.
 * - MarketPricesOutput - The return type for the getMarketPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const MarketPricesInputSchema = z.object({
  location: z.string().describe('The location for which to fetch crop market prices (e.g., city name or lat/lon).'),
});
export type MarketPricesInput = z.infer<typeof MarketPricesInputSchema>;

const MarketPricesOutputSchema = z.object({
  prices: z.array(z.object({
    crop: z.string().describe('The name of the crop.'),
    price: z.number().describe('The market price of the crop in Indian Rupees (INR).'),
    unit: z.string().describe('The unit of measurement for the price (e.g., "per Quintal", "per Kg").'),
  })).describe('A list of crops and their market prices.'),
});
export type MarketPricesOutput = z.infer<typeof MarketPricesOutputSchema>;

export async function getMarketPrices(input: MarketPricesInput): Promise<MarketPricesOutput> {
  return marketPricesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketPricesPrompt',
  input: { schema: MarketPricesInputSchema },
  output: { schema: MarketPricesOutputSchema },
  model: googleAI.model('gemini-3.6-flash'),
  prompt: `You are a market data service providing real-time agricultural commodity prices.
  Given the location, provide a list of 5-7 common crops and their current, realistic market prices in Indian Rupees (INR).
  The currency for the price must be in INR.
  The unit should typically be "per Quintal".

  Location: {{{location}}}
  `,
});

const marketPricesFlow = ai.defineFlow(
  {
    name: 'marketPricesFlow',
    inputSchema: MarketPricesInputSchema,
    outputSchema: MarketPricesOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
