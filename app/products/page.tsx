import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="mt-1 text-muted-foreground">
          Browse all available products on the marketplace
        </p>
      </div>
      <Card className="border-border">
        <CardContent className="flex flex-col items-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <PackageSearch className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">No products yet</h2>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Products will appear here once sellers start listing them. Be the first to list a product!
          </p>
          <Button asChild>
            <Link href="/register">Become a seller</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
