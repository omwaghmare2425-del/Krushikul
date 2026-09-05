import Image from 'next/image';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TrendingUp, DollarSign, Trees, Heart } from 'lucide-react';

export function Impact({ dictionary }: { dictionary: any }) {

  const benefits = [
    { icon: <TrendingUp className="w-6 h-6 text-accent" />, text: dictionary.benefits.higherProductivity },
    { icon: <DollarSign className="w-6 h-6 text-accent" />, text: dictionary.benefits.reducedCosts },
    { icon: <Trees className="w-6 h-6 text-accent" />, text: dictionary.benefits.sustainableFarming },
    { icon: <Heart className="w-6 h-6 text-accent" />, text: dictionary.benefits.ecoFriendlyPractices },
  ];

  const stories = dictionary.stories;
  const images = PlaceHolderImages;

  return (
    <section id="impact" className="bg-secondary/50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="p-3 bg-white rounded-full shadow-md mb-2">{benefit.icon}</div>
              <p className="font-semibold text-foreground">{benefit.text}</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-center mb-8">{dictionary.storiesTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story: any) => {
            const image = images.find(img => img.id === story.id);
            return (
              <Card key={story.id} className="flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                  {image && (
                     <Image
                        src={image.imageUrl}
                        alt={`${dictionary.photoOf} ${story.name}`}
                        width={400}
                        height={300}
                        className="object-cover aspect-[4/3] w-full"
                        data-ai-hint={image.imageHint}
                      />
                  )}
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                    {story.story}
                  </blockquote>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <div className="font-bold">
                    <p>{story.name}</p>
                    <p className="text-sm text-muted-foreground">{story.location}</p>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
