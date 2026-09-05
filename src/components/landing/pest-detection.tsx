"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Bug, ShieldCheck, AlertTriangle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { detectPestDisease, type DetectPestDiseaseOutput } from '@/ai/flows/image-based-pest-disease-detection';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CameraCapture } from '@/components/landing/camera-capture';

export function PestDetection({ dictionary }: { dictionary: any }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<DetectPestDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const placeholder = PlaceHolderImages.find(p => p.id === 'pest-detection-placeholder');
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!imageDataUri) {
      toast({
        variant: 'destructive',
        title: dictionary.noImageTitle,
        description: dictionary.noImageDescription,
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await detectPestDisease({ photoDataUri: imageDataUri });
      setResult(response);
    } catch (error) {
      console.error('Error detecting pest/disease:', error);
      toast({
        variant: 'destructive',
        title: dictionary.detectionFailedTitle,
        description: dictionary.detectionFailedDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoTaken = (dataUri: string) => {
    setImagePreview(dataUri);
    setImageDataUri(dataUri);
    setResult(null);
    setIsCameraDialogOpen(false);
  }

  const confidenceValue = result?.diagnosis?.confidence ? Math.round(result.diagnosis.confidence * 100) : 0;

  return (
    <section id="pest-detection" className="container mx-auto py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.subtitle}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.uploadCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-full aspect-video rounded-md border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/50">
              <Image
                src={imagePreview || placeholder?.imageUrl || ''}
                alt={imagePreview ? dictionary.cropPreviewAlt : placeholder?.description || ''}
                width={600}
                height={400}
                className="object-contain h-full w-full"
                data-ai-hint={placeholder?.imageHint || 'plant leaf'}
              />
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <Upload className="mr-2 h-4 w-4" /> {dictionary.chooseImageButton}
              </Button>
              <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" /> {dictionary.takePhotoButton}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                   <CameraCapture onPhotoTaken={handlePhotoTaken} dictionary={dictionary.cameraCapture} />
                </DialogContent>
              </Dialog>
            </div>
             <Button onClick={handleDetect} disabled={isLoading || !imagePreview} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bug className="mr-2 h-4 w-4" />}
                {dictionary.runDetectionButton}
              </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.diagnosisCardTitle}</CardTitle>
            <CardDescription>{dictionary.diagnosisCardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{dictionary.analyzing}</p>
              </div>
            )}
            {!isLoading && result && (result.diagnosis || !result.diagnosis?.hasPestOrDisease) && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {result.diagnosis?.hasPestOrDisease ? <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0" /> : <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />}
                  <h3 className="text-2xl font-bold">{result.diagnosis?.pestOrDiseaseName || dictionary.healthyCrop}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{dictionary.confidence}</span>
                    <span>{confidenceValue}%</span>
                  </div>
                  <Progress value={confidenceValue} className="h-2" />
                </div>
                <div>
                  <h4 className="font-semibold mt-4">{dictionary.suggestedActions}:</h4>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    {result.diagnosis?.suggestedActions && result.diagnosis.suggestedActions.length > 0 ? (
                      result.diagnosis.suggestedActions.map((action, i) => <li key={i}>{action}</li>)
                    ) : (
                      <li>{dictionary.noActionsNeeded}</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground">{dictionary.resultsPlaceholder}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
