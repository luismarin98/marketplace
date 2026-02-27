import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Zap, Users } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    description:
      "Every transaction is protected with encrypted payments and buyer/seller verification.",
  },
  {
    icon: Zap,
    title: "Quick Listing",
    description:
      "List your products in seconds with our streamlined seller tools and dashboard.",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description:
      "Join thousands of verified buyers and sellers in a marketplace built on trust.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to trade online
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            A complete platform for both buyers and sellers.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
