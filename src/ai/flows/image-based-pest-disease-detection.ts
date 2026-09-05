'use server';
/**
 * @fileOverview An AI agent that diagnoses pests and diseases in crops based on image uploads.
 *
 * - detectPestDisease - A function that handles the pest and disease detection process.
 * - DetectPestDiseaseInput - The input type for the detectPestDisease function.
 * - DetectPestDiseaseOutput - The return type for the detectPestDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPestDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectPestDiseaseInput = z.infer<typeof DetectPestDiseaseInputSchema>;

const DetectPestDiseaseOutputSchema = z.object({
  diagnosis: z.object({
    hasPestOrDisease: z.boolean().describe('Whether or not the crop has a pest or disease.'),
    pestOrDiseaseName: z.string().describe('The name of the pest or disease, if any.'),
    confidence: z.number().describe('The confidence level of the diagnosis (0-1).'),
    suggestedActions: z.array(z.string()).describe('Suggested actions to take to address the pest or disease.'),
  }).nullable().describe('The diagnosis of the crop, or null if no pest or disease is detected.'),
});
export type DetectPestDiseaseOutput = z.infer<typeof DetectPestDiseaseOutputSchema>;

export async function detectPestDisease(input: DetectPestDiseaseInput): Promise<DetectPestDiseaseOutput> {
  return detectPestDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectPestDiseasePrompt',
  input: {schema: DetectPestDiseaseInputSchema},
  output: {schema: DetectPestDiseaseOutputSchema},
  prompt: `You are an expert in plant pathology and entomology, specializing in diagnosing crop diseases and pest infestations based on images.

  Analyze the provided image of the crop and determine if there are any signs of pests or diseases. Provide a diagnosis including the name of the pest or disease, a confidence level (0-1), and suggested actions to take.

  If no pests or diseases are detected, indicate that the crop appears healthy.

  Here is the image of the crop:
  {{media url=photoDataUri}}
  `,
});

const detectPestDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPestDiseaseFlow',
    inputSchema: DetectPestDiseaseInputSchema,
    outputSchema: DetectPestDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
