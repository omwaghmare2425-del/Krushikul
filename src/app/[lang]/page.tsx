import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AiAdvisory } from "@/components/landing/ai-advisory";
import { PestDetection } from "@/components/landing/pest-detection";
import { Impact } from "@/components/landing/impact";
import { Stakeholders } from "@/components/landing/stakeholders";
import { Contact } from "@/components/landing/contact";
import { Separator } from "@/components/ui/separator";
import { Weather } from "@/components/landing/weather";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "../../../i18n-config";
import { MarketPrices } from "@/components/landing/market-prices";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col">
      <Hero dictionary={dictionary.hero} />
      <Features dictionary={dictionary.features} />
      <div className="container">
        <Separator className="my-12 md:my-20" />
      </div>
      <Weather dictionary={dictionary.weather} />
      <div className="container">
        <Separator className="my-12 md:my-20" />
      </div>
       <MarketPrices dictionary={dictionary.marketPrices} />
      <div className="container">
        <Separator className="my-12 md:my-20" />
      </div>
      <AiAdvisory dictionary={dictionary.aiAdvisory} />
      <div className="container">
        <Separator className="my-12 md:my-20" />
      </div>
      <PestDetection dictionary={dictionary.pestDetection} />
      <Impact dictionary={dictionary.impact} />
      <Stakeholders dictionary={dictionary.stakeholders} />
      <Contact dictionary={dictionary.contact} />
    </div>
  );
}
