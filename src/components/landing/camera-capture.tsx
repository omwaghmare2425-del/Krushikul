"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, RefreshCcw } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function CameraCapture({ onPhotoTaken, dictionary }: { onPhotoTaken: (dataUri: string) => void, dictionary: any }) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: dictionary.cameraNotSupportedTitle,
          description: dictionary.cameraNotSupportedDescription,
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: dictionary.cameraAccessDeniedTitle,
          description: dictionary.cameraAccessDeniedDescription,
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast, dictionary]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  }

  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoTaken(capturedImage);
    }
  }
  
  return (
    <div className="space-y-4">
        <DialogHeader>
            <DialogTitle>{dictionary.title}</DialogTitle>
            <DialogDescription>{dictionary.description}</DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black">
            {!capturedImage && <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />}
            {capturedImage && <img src={capturedImage} alt={dictionary.capturedPreviewAlt} className="w-full h-full object-contain" />}
            <canvas ref={canvasRef} className="hidden" />
        </div>
        
        {hasCameraPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>{dictionary.cameraAccessRequiredTitle}</AlertTitle>
                <AlertDescription>{dictionary.cameraAccessRequiredDescription}</AlertDescription>
            </Alert>
        )}

        {hasCameraPermission && (
            <div className="flex gap-2">
                {!capturedImage ? (
                    <Button onClick={handleCapture} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        {dictionary.captureButton}
                    </Button>
                ) : (
                    <>
                        <Button onClick={handleRetake} variant="outline" className="w-full">
                             <RefreshCcw className="mr-2 h-4 w-4" />
                            {dictionary.retakeButton}
                        </Button>
                        <Button onClick={handleUsePhoto} className="w-full">
                            {dictionary.usePhotoButton}
                        </Button>
                    </>
                )}
            </div>
        )}
    </div>
  );
}
