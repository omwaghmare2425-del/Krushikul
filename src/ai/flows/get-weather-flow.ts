'use server';
/**
 * @fileOverview An AI agent for fetching real-time weather data.
 *
 * - getWeatherData - A function that fetches weather data for a given location.
 * - WeatherDataInput - The input type for the getWeatherData function.
 * - WeatherDataOutput - The return type for the getWeatherData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherDataInputSchema = z.object({
  location: z.string().describe('The location for which to fetch weather data (e.g., city name or lat/lon).'),
});
export type WeatherDataInput = z.infer<typeof WeatherDataInputSchema>;

const WeatherDataOutputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  description: z.string().describe('A brief description of the current weather conditions.'),
  icon: z.string().describe('A lucide-react icon name representing the weather (e.g., "Sun", "Cloudy", "CloudRain").'),
});
export type WeatherDataOutput = z.infer<typeof WeatherDataOutputSchema>;

export async function getWeatherData(input: WeatherDataInput): Promise<WeatherDataOutput> {
  return weatherDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherDataPrompt',
  input: {schema: WeatherDataInputSchema},
  output: {schema: WeatherDataOutputSchema},
  prompt: `You are a weather forecasting service.
  Given the location, provide a realistic current weather report.
  
  Choose an appropriate icon from the lucide-react library. Examples: "Sun", "Cloudy", "CloudRain", "CloudSun", "CloudDrizzle", "CloudLightning", "CloudSnow".

  Location: {{{location}}}
  `,
});

const weatherDataFlow = ai.defineFlow(
  {
    name: 'weatherDataFlow',
    inputSchema: WeatherDataInputSchema,
    outputSchema: WeatherDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
