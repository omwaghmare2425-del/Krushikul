import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero({ dictionary }: { dictionary: any }) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold !leading-tight tracking-tighter">
          {dictionary.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl mx-auto text-primary-foreground/90">
          {dictionary.subtitle}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {dictionary.ctaGetStarted}
          </Button>
          <Button size="lg" variant="secondary">
            {dictionary.ctaUploadImage}
          </Button>
        </div>
      </div>
    </section>
  );
}
