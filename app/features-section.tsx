import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Zap, Users } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Transacciones Seguras",
    description:
      "Cada transacción está protegida con pagos encriptados y verificación de comprador/vendedor.",
  },
  {
    icon: Zap,
    title: "Publicación Rápida",
    description:
      "Publica tus productos en segundos con nuestras herramientas optimizadas para vendedores.",
  },
  {
    icon: Users,
    title: "Comunidad de Confianza",
    description:
      "Únete a miles de compradores y vendedores verificados en un mercado basado en la confianza.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Todo lo que necesitas para comerciar en línea
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Una plataforma completa tanto para compradores como para vendedores.
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
