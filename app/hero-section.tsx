"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.08,transparent_60%)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center md:px-6 md:pb-32 md:pt-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          <ShoppingBag className="h-4 w-4 text-primary" />
          Your trusted online marketplace
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Buy and sell with{" "}
          <span className="text-primary">confidence</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Connect with buyers and sellers in a secure, modern marketplace. List your products or find exactly what you need.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2">
            <Link href="/register">
              Start selling
              <Store className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <Link href="/products">
              Browse products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid w-full max-w-2xl grid-cols-3 gap-8">
          {[
            { value: "10K+", label: "Active sellers" },
            { value: "50K+", label: "Products listed" },
            { value: "99%", label: "Satisfaction rate" },
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
