import { Users, Building, Handshake, Landmark } from "lucide-react";

export function Stakeholders({ dictionary }: { dictionary: any }) {

  const stakeholderList = [
    { name: dictionary.farmers, icon: <Users className="w-10 h-10 text-primary" /> },
    { name: dictionary.agricultureOfficers, icon: <Landmark className="w-10 h-10 text-primary" /> },
    { name: dictionary.ngos, icon: <Handshake className="w-10 h-10 text-primary" /> },
    { name: dictionary.agriTechStartups, icon: <Building className="w-10 h-10 text-primary" /> },
  ];

  return (
    <section id="stakeholders" className="container mx-auto py-12 md:py-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.title}</h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stakeholderList.map((stakeholder) => (
          <div key={stakeholder.name} className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4">{stakeholder.icon}</div>
            <h3 className="font-semibold text-lg">{stakeholder.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
