import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Bug, CloudSun, BarChart3 } from "lucide-react";
import Link from "next/link";

export function Features({ dictionary }: { dictionary: any }) {

  const featuresList = [
    {
      icon: <Sprout className="w-8 h-8 text-primary" />,
      title: dictionary.soilHealth.title,
      description: dictionary.soilHealth.description,
      href: "#advisory",
    },
    {
      icon: <Bug className="w-8 h-8 text-primary" />,
      title: dictionary.pestDetection.title,
      description: dictionary.pestDetection.description,
      href: "#pest-detection",
    },
    {
      icon: <CloudSun className="w-8 h-8 text-primary" />,
      title: dictionary.weatherAlerts.title,
      description: dictionary.weatherAlerts.description,
      href: "#weather",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: dictionary.marketPrices.title,
      description: dictionary.marketPrices.description,
      href: "#market-prices"
    },
  ];

  return (
    <section id="features" className="container mx-auto py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuresList.map((feature, index) => (
          <Link key={index} href={feature.href}>
            <Card className="text-center bg-card hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 h-full">
              <CardHeader className="items-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
