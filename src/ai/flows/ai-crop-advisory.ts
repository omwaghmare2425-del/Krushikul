'use server';

import { z } from 'genkit';

const CropAdvisoryInputSchema = z.object({
  location: z.string(),
  cropType: z.string(),
  soilType: z.string(),
  weatherData: z.string(),
  historicalCropData: z.string(),
  farmerQuery: z.string(),
  language: z.string().optional(),
});

export type CropAdvisoryInput = z.infer<typeof CropAdvisoryInputSchema>;

const CropAdvisoryOutputSchema = z.object({
  actionableAdvice: z.string(),
});

export type CropAdvisoryOutput = z.infer<typeof CropAdvisoryOutputSchema>;

export async function getCropAdvisory(
  input: CropAdvisoryInput
): Promise<CropAdvisoryOutput> {

  const crop = input.cropType || 'crop';

  return {
    actionableAdvice:
      `For ${crop}, maintain proper irrigation according to soil moisture and weather conditions. ` +
      `Use balanced fertilizers based on soil requirements, regularly inspect plants for pests and diseases, ` +
      `remove severely affected leaves, and follow recommended harvesting practices. ` +
      `For specific treatment or fertilizer dosage, consult a local agriculture expert.`
  };
}