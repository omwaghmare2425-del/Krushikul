"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMarketPrices, type MarketPricesOutput } from "@/ai/flows/get-market-prices-flow";
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function MarketPrices({ dictionary }: { dictionary: any }) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [prices, setPrices] = useState<MarketPricesOutput['prices'] | null>(null);
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
      const fetchPrices = async () => {
        setIsLoading(true);
        setPrices(null);
        try {
          const locationString = `${location.latitude}, ${location.longitude}`;

          try {
            const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`);
            const geocodeData = await geocodeResponse.json();
            setLocationName(geocodeData.display_name || dictionary.yourLocation);
          } catch (e) {
            setLocationName(dictionary.yourLocation);
          }

          const priceData = await getMarketPrices({ location: locationString });
          setPrices(priceData.prices);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: dictionary.priceErrorTitle,
            description: dictionary.priceErrorDescription,
          });
          console.error("Market price fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPrices();
    }
  }, [location, toast, dictionary]);

  return (
    <section id="market-prices" className="container mx-auto py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.subtitle}
        </p>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{dictionary.cardTitle}</CardTitle>
          <CardDescription>
            {locationName ? `${dictionary.showingPricesFor} ${locationName}` : dictionary.clickToGetPrices}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[250px] space-y-6">
          {!location && !isLocating && (
            <Button onClick={handleLocation}>
              <MapPin className="mr-2 h-4 w-4" /> {dictionary.getPricesButton}
            </Button>
          )}

          {(isLoading || isLocating) && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin text-primary" /> {dictionary.loading}</div>}

          {!isLoading && !isLocating && prices && location && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">{dictionary.table.crop}</TableHead>
                  <TableHead className="text-right font-bold">{dictionary.table.price}</TableHead>
                  <TableHead className="text-right font-bold">{dictionary.table.unit}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.crop}</TableCell>
                    <TableCell className="text-right">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">{item.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && !isLocating && location && !prices && (
            <p>{dictionary.clickToFetch}</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
