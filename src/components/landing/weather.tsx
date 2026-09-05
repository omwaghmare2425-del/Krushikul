"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWeatherData, type WeatherDataOutput } from "@/ai/flows/get-weather-flow";
import { Loader2, MapPin, Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WeatherIcon = ({ iconName, ...props }: { iconName: string } & React.ComponentProps<typeof Sun>) => {
  switch (iconName) {
    case 'Sun': return <Sun {...props} />;
    case 'Cloudy': return <Cloud {...props} />;
    case 'CloudRain': return <CloudRain {...props} />;
    case 'CloudSun': return <Cloud {...props} />; // Using Cloud as a fallback
    case 'CloudDrizzle': return <CloudRain {...props} />; // Using CloudRain
    case 'CloudLightning': return <CloudRain {...props} />; // Using CloudRain
    case 'CloudSnow': return <CloudRain {...props} />; // Using CloudRain
    default: return <Sun {...props} />;
  }
};


export function Weather({ dictionary }: { dictionary: any }) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [weather, setWeather] = useState<WeatherDataOutput | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const handleLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setIsLocating(false);
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: dictionary.locationErrorTitle,
          description: dictionary.locationErrorDescription,
        });
        console.error("Geolocation error:", error);
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        setIsLoading(true);
        setWeather(null);
        try {
          const locationString = `${location.latitude}, ${location.longitude}`;
          
          try {
            const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`);
            const geocodeData = await geocodeResponse.json();
            setLocationName(geocodeData.display_name || dictionary.yourLocation);
          } catch (e) {
            setLocationName(dictionary.yourLocation);
          }

          const weatherData = await getWeatherData({ location: locationString });
          setWeather(weatherData);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: dictionary.weatherErrorTitle,
            description: dictionary.weatherErrorDescription,
          });
          console.error("Weather fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWeather();
    }
  }, [location, toast, dictionary]);

  return (
    <section id="weather" className="container mx-auto py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.subtitle}
        </p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{dictionary.cardTitle}</CardTitle>
          <CardDescription>
            {locationName ? `${dictionary.showingWeatherFor} ${locationName}` : dictionary.clickToGetWeather}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] space-y-6">
          {!location && !isLocating && (
             <Button onClick={handleLocation}>
              <MapPin className="mr-2 h-4 w-4" /> {dictionary.getWeatherButton}
            </Button>
          )}
          
          {(isLoading || isLocating) && <Loader2 className="w-12 h-12 animate-spin text-primary" />}

          {!isLoading && !isLocating && weather && location && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center w-full">
              <div className="flex flex-col items-center justify-center col-span-2 md:col-span-1">
                 {weather.icon && <WeatherIcon iconName={weather.icon} className="w-16 h-16 text-accent mb-2" />}
                <p className="text-4xl font-bold">{weather.temperature}°C</p>
                <p className="text-muted-foreground">{weather.description}</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-primary"/>
                  <div>
                    <p className="font-bold">{weather.humidity}%</p>
                    <p className="text-sm text-muted-foreground">{dictionary.humidity}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                 <div className="flex items-center gap-2">
                  <Wind className="w-6 h-6 text-primary"/>
                  <div>
                    <p className="font-bold">{weather.windSpeed} km/h</p>
                    <p className="text-sm text-muted-foreground">{dictionary.wind}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isLoading && !isLocating && location && !weather && (
            <p>{dictionary.clickToFetch}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
