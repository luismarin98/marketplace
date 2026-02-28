import { getCollection } from "@/lib/mongodb";
import { IProduct, PRODUCTS_COLLECTION } from "@/modules/product/domain/product.entity";
import { ProductCard } from "./product-card";

// Forzamos que esta página sea dinámica para que siempre traiga los datos frescos de la BD
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // 1. Conexión a la base de datos y obtención de productos
  const collection = await getCollection<IProduct>(PRODUCTS_COLLECTION);
  const productsData = await collection.find({}).sort({ createdAt: -1 }).toArray();

  // 2. Transformación de datos (ObjectId/Date -> String) para pasar al Client Component
  const products = productsData.map((p) => ({
    ...p,
    _id: p._id.toString(),
    sellerId: p.sellerId.toString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Productos</h1>
        <p className="mt-1 text-muted-foreground">
          Explora todos los productos disponibles en el mercado
        </p>
      </div>
      
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
           <p className="text-muted-foreground">No se encontraron productos aún.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
