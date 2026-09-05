'use server';

import { z } from 'genkit';

const WeatherDataInputSchema = z.object({
  location: z.string(),
});

export type WeatherDataInput = z.infer<typeof WeatherDataInputSchema>;

const WeatherDataOutputSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  description: z.string(),
  icon: z.string(),
});

export type WeatherDataOutput = z.infer<typeof WeatherDataOutputSchema>;

export async function getWeatherData(
  input: WeatherDataInput
): Promise<WeatherDataOutput> {
  const [lat, lon] = input.location.split(',').map(Number);

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
  );

  if (!response.ok) {
    throw new Error('Weather API request failed');
  }

  const data = await response.json();

  const code = data.current.weather_code;

  let description = 'Clear';
  let icon = 'Sun';

  if (code >= 1 && code <= 3) {
    description = 'Partly Cloudy';
    icon = 'CloudSun';
  } else if (code >= 45 && code <= 48) {
    description = 'Foggy';
    icon = 'Cloudy';
  } else if (code >= 51 && code <= 67) {
    description = 'Rain';
    icon = 'CloudRain';
  } else if (code >= 71 && code <= 77) {
    description = 'Snow';
    icon = 'CloudSnow';
  } else if (code >= 80 && code <= 99) {
    description = 'Rain / Thunderstorm';
    icon = 'CloudRain';
  }

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    description,
    icon,
  };
}