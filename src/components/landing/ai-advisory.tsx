"use client";

import { useState } from 'react';
import { Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getCropAdvisory, type CropAdvisoryInput } from '@/ai/flows/ai-crop-advisory';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiAdvisory({ dictionary }: { dictionary: any }) {
  const [formData, setFormData] = useState<CropAdvisoryInput>({
    location: '',
    cropType: '',
    soilType: '',
    weatherData: 'Clear skies, 28°C',
    historicalCropData: 'Average yield for this season',
    farmerQuery: '',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.farmerQuery.trim() || !formData.location.trim() || !formData.cropType.trim() || !formData.soilType.trim()) {
       toast({
        variant: 'destructive',
        title: dictionary.missingInfoTitle,
        description: dictionary.missingInfoDescription,
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: formData.farmerQuery };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await getCropAdvisory(formData);
      const assistantMessage: Message = { role: 'assistant', content: response.actionableAdvice };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting crop advisory:', error);
      toast({
        variant: 'destructive',
        title: dictionary.errorTitle,
        description: dictionary.errorDescription,
      });
    } finally {
      setIsLoading(false);
      setFormData(prev => ({...prev, farmerQuery: ''}));
    }
  };

  return (
    <section id="advisory" className="container mx-auto py-12 md:py-24 px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {dictionary.subtitle}
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input name="location" placeholder={dictionary.locationPlaceholder} value={formData.location} onChange={handleInputChange} required />
              <Input name="cropType" placeholder={dictionary.cropTypePlaceholder} value={formData.cropType} onChange={handleInputChange} required />
            </div>
            <Input name="soilType" placeholder={dictionary.soilTypePlaceholder} value={formData.soilType} onChange={handleInputChange} required />
            <Textarea name="farmerQuery" placeholder={dictionary.queryPlaceholder} value={formData.farmerQuery} onChange={handleInputChange} required />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CornerDownLeft className="mr-2 h-4 w-4" />}
              {dictionary.getAdviceButton}
            </Button>
          </form>
        </div>
        <Card className="h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>{dictionary.cardTitle}</CardTitle>
            <CardDescription>{dictionary.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <Bot className="w-12 h-12 mb-4" />
                <p>{dictionary.waitingForQuestion}</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && <div className="p-1.5 rounded-full bg-primary/20"><Bot className="w-5 h-5 text-primary flex-shrink-0" /></div>}
                <div className={`p-3 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && <div className="p-1.5 rounded-full bg-accent/20"><User className="w-5 h-5 text-accent flex-shrink-0" /></div>}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3">
                 <div className="p-1.5 rounded-full bg-primary/20"><Bot className="w-5 h-5 text-primary flex-shrink-0" /></div>
                 <div className="p-3 rounded-lg bg-secondary">
                   <Loader2 className="w-5 h-5 animate-spin text-secondary-foreground" />
                 </div>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
