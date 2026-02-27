import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Marketplace</span>
        </div>
        <nav className="flex gap-6">
          <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Products
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Log in
          </Link>
          <Link href="/register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Register
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          {"2026 Marketplace. All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
