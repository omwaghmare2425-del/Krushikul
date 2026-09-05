'use server';

import { z } from 'genkit';

const DetectPestDiseaseInputSchema = z.object({
  photoDataUri: z.string(),
});

export type DetectPestDiseaseInput =
  z.infer<typeof DetectPestDiseaseInputSchema>;

const DetectPestDiseaseOutputSchema = z.object({
  diagnosis: z.object({
    hasPestOrDisease: z.boolean(),
    pestOrDiseaseName: z.string(),
    confidence: z.number(),
    suggestedActions: z.array(z.string()),
  }).nullable(),
});

export type DetectPestDiseaseOutput =
  z.infer<typeof DetectPestDiseaseOutputSchema>;

export async function detectPestDisease(
  input: DetectPestDiseaseInput
): Promise<DetectPestDiseaseOutput> {

  // DEMO MODE — does not use Gemini API
  return {
    diagnosis: {
      hasPestOrDisease: true,
      pestOrDiseaseName: 'Possible Leaf Disease',
      confidence: 0.85,
      suggestedActions: [
        'Inspect the affected leaves carefully.',
        'Remove severely affected leaves.',
        'Consult a local agriculture expert before applying treatment.'
      ],
    },
  };
}