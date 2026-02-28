"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";

const formatNumber = (num: number): string => {
  if (typeof num !== 'number') {
    return "0";
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M+`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  }
  return num.toString();
};

interface HeroSectionProps {
  sellerCount: number;
  productCount: number;
}

export function HeroSection({ sellerCount, productCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.08,transparent_60%)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center md:px-6 md:pb-32 md:pt-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          <ShoppingBag className="h-4 w-4 text-primary" />
          Tu mercado en línea de confianza
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Compra y vende con{" "}
          <span className="text-primary">confianza</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Conecta con compradores y vendedores en un mercado seguro y moderno. Publica tus productos o encuentra exactamente lo que necesitas.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2">
            <Link href="/register">
              Empezar a vender
              <Store className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <Link href="/products">
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid w-full max-w-2xl grid-cols-3 gap-8">
          {[
            { value: formatNumber(sellerCount), label: "Vendedores activos" },
            { value: formatNumber(productCount), label: "Productos listados" },
            { value: "99%", label: "Tasa de satisfacción" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
