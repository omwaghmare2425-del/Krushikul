import { config } from 'dotenv';
config();

import '@/ai/flows/ai-crop-advisory.ts';
import '@/ai/flows/image-based-pest-disease-detection.ts';
import '@/ai/flows/get-weather-flow.ts';
import '@/ai/flows/get-market-prices-flow.ts';
