"use client";

import { useState, useEffect } from 'react';
import { Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { getCropAdvisory, type CropAdvisoryInput } from '@/ai/flows/ai-crop-advisory';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '../ui/scroll-area';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const languagePlaceholders = {
  en: {
    title: "AI Crop Helper",
    description: "Get instant advice. Fill in the details below and ask your question.",
    location: "Location (e.g., Punjab)",
    cropType: "Crop Type (e.g., Wheat)",
    soilType: "Soil Type (e.g., Loamy)",
    query: "Ask your question... (e.g., When should I irrigate?)",
    submit: "Get Advice",
    waiting: "Waiting for your question...",
    missingInfo: "Please fill out all required fields.",
    error: "Failed to get advisory. Please try again."
  },
  hi: {
    title: "एआई फसल सहायक",
    description: "तुरंत सलाह पाएं। नीचे विवरण भरें और अपना प्रश्न पूछें।",
    location: "स्थान (जैसे, पंजाब)",
    cropType: "फसल का प्रकार (जैसे, गेहूं)",
    soilType: "मिट्टी का प्रकार (जैसे, दोमट)",
    query: "अपना प्रश्न पूछें... (जैसे, मुझे सिंचाई कब करनी चाहिए?)",
    submit: "सलाह लें",
    waiting: "आपके प्रश्न का इंतजार है...",
    missingInfo: "कृपया सभी आवश्यक फ़ील्ड भरें।",
    error: "सलाह प्राप्त करने में विफल। कृपया पुन: प्रयास करें।"
  },
  mr: {
    title: "एआय पीक मदतनीस",
    description: "झटपट सल्ला मिळवा. खाली तपशील भरा आणि तुमचा प्रश्न विचारा.",
    location: "स्थान (उदा. पंजाब)",
    cropType: "पिकाचा प्रकार (उदा. गहू)",
    soilType: "मातीचा प्रकार (उदा. पोयटा)",
    query: "तुमचा प्रश्न विचारा... (उदा. मी सिंचन केव्हा करावे?)",
    submit: "सल्ला मिळवा",
    waiting: "तुमच्या प्रश्नाची वाट बघत आहे...",
    missingInfo: "कृपया सर्व आवश्यक फील्ड भरा.",
    error: "सल्ला मिळविण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा."
  }
};

export function ChatWidget({ language }: { language: string }) {
  const [formData, setFormData] = useState<Omit<CropAdvisoryInput, 'farmerQuery'>>({
    location: '',
    cropType: '',
    soilType: '',
    weatherData: 'Clear skies, 28°C',
    historicalCropData: 'Average yield for this season',
  });
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentLang = (languagePlaceholders[language as keyof typeof languagePlaceholders] || languagePlaceholders.en);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'farmerQuery') {
      setQuery(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim() || !formData.location.trim() || !formData.cropType.trim() || !formData.soilType.trim()) {
       toast({
        variant: 'destructive',
        title: currentLang.missingInfo,
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const fullInput = { ...formData, farmerQuery: query, language };
      const response = await getCropAdvisory(fullInput);
      const assistantMessage: Message = { role: 'assistant', content: response.actionableAdvice };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting crop advisory:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: currentLang.error,
      });
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>{currentLang.title}</SheetTitle>
        <SheetDescription>{currentLang.description}</SheetDescription>
      </SheetHeader>
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4 py-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8">
                <Bot className="w-12 h-12 mb-4" />
                <p>{currentLang.waiting}</p>
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
          </div>
        </ScrollArea>
        <SheetFooter>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 w-full">
              <div className="grid grid-cols-1 gap-2">
                <Input name="location" placeholder={currentLang.location} value={formData.location} onChange={handleInputChange} required />
                <Input name="cropType" placeholder={currentLang.cropType} value={formData.cropType} onChange={handleInputChange} required />
                <Input name="soilType" placeholder={currentLang.soilType} value={formData.soilType} onChange={handleInputChange} required />
              </div>
              <Textarea name="farmerQuery" placeholder={currentLang.query} value={query} onChange={handleInputChange} required />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CornerDownLeft className="mr-2 h-4 w-4" />}
                {currentLang.submit}
              </Button>
            </form>
        </SheetFooter>
      </div>
    </SheetContent>
  );
}
