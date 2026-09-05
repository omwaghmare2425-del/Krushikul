// A Genkit flow for providing AI-powered crop advisory to farmers.

'use server';

/**
 * @fileOverview An AI agent for providing crop advisory services to farmers.
 *
 * - getCropAdvisory - A function that provides crop advisory based on location and crop data.
 * - CropAdvisoryInput - The input type for the getCropAdvisory function.
 * - CropAdvisoryOutput - The return type for the getCropAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropAdvisoryInputSchema = z.object({
  location: z.string().describe('The geographic location of the farm.'),
  cropType: z.string().describe('The type of crop being cultivated.'),
  soilType: z.string().describe('The type of soil on the farm.'),
  weatherData: z.string().describe('The current weather conditions at the farm.'),
  historicalCropData: z.string().describe('Historical data about crop yields in the area.'),
  farmerQuery: z.string().describe('The query from the farmer'),
  language: z.string().optional().describe('The language for the response (e.g., "en", "hi", "mr").'),
});
export type CropAdvisoryInput = z.infer<typeof CropAdvisoryInputSchema>;

const CropAdvisoryOutputSchema = z.object({
  actionableAdvice: z.string().describe('Actionable advice for the farmer to optimize their farming practices.'),
});
export type CropAdvisoryOutput = z.infer<typeof CropAdvisoryOutputSchema>;

export async function getCropAdvisory(input: CropAdvisoryInput): Promise<CropAdvisoryOutput> {
  return cropAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropAdvisoryPrompt',
  input: {schema: CropAdvisoryInputSchema},
  output: {schema: CropAdvisoryOutputSchema},
  prompt: `You are an AI-powered crop advisor, providing real-time, location-specific, and actionable advice to farmers.

  Respond in the following language: {{{language}}}. If no language is specified, respond in English.

  Location: {{{location}}}
  Crop Type: {{{cropType}}}
  Soil Type: {{{soilType}}}
  Weather Data: {{{weatherData}}}
  Historical Crop Data: {{{historicalCropData}}}
  Farmer Query: {{{farmerQuery}}}

  Based on the information provided, what actionable advice can you give to the farmer to optimize their farming practices and increase their yield?
  Consider factors such as irrigation, fertilization, pest control, and harvesting strategies.
  Be as specific as possible.
  `,
});

const cropAdvisoryFlow = ai.defineFlow(
  {
    name: 'cropAdvisoryFlow',
    inputSchema: CropAdvisoryInputSchema,
    outputSchema: CropAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
