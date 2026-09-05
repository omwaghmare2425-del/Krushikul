"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Contact({ dictionary }: { dictionary: any }) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const webhookUrl = 'https://sih2k25.app.n8n.cloud/webhook/1b35bd2e-9ee0-4d71-8b7b-46a41d016ef7';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('language', language);
    formData.append('message', message);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // This will help with CORS issues for "fire-and-forget" requests
      });
      
      toast({
        title: dictionary.toast.title,
        description: dictionary.toast.description,
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setLanguage('');
      setMessage('');

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-secondary/50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.subtitle}
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.form.title}</CardTitle>
              <CardDescription>{dictionary.form.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="text" placeholder={dictionary.form.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
                <Input type="email" placeholder={dictionary.form.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="tel" placeholder={dictionary.form.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Select required value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={dictionary.form.languagePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder={dictionary.form.messagePlaceholder} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} 
                  {isLoading ? 'Sending...' : dictionary.form.submitButton}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card className="flex items-center p-6">
              <MessageCircle className="w-8 h-8 text-primary mr-6 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">{dictionary.whatsapp.title}</h3>
                <p className="text-muted-foreground">{dictionary.whatsapp.description}</p>
                <a href="https://wa.me/27604133434" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold mt-1 block hover:underline">{dictionary.whatsapp.cta}</a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
