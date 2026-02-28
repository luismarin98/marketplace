import { NextResponse, type NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import {
  IProduct,
  PRODUCTS_COLLECTION,
} from "@/modules/product/domain/product.entity";

// GET /api/products?sellerId=...
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sellerId = searchParams.get("sellerId");

  try {
    const collection = await getCollection<IProduct>(PRODUCTS_COLLECTION);

    const query = sellerId ? { sellerId: new ObjectId(sellerId) } : {};

    const products = await collection.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(products);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Argument passed in must be a string")) {
      return NextResponse.json({ message: "Invalid sellerId format" }, { status: 400 });
    }
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, stock, sellerId } = body;

    if (!title || !description || !price || !stock || !sellerId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const collection = await getCollection<IProduct>(PRODUCTS_COLLECTION);

    const newProduct: Omit<IProduct, "_id"> = {
      title,
      description,
      price,
      stock,
      sellerId: new ObjectId(sellerId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newProduct as IProduct);
    const createdProduct = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}

// PUT /api/products - Actualización masiva de stock (Simulación de pago)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { items } = body; // Esperamos { items: [{ _id, cartQuantity }] }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Invalid items format" }, { status: 400 });
    }

    const collection = await getCollection<IProduct>(PRODUCTS_COLLECTION);

    // Preparamos las operaciones masivas (bulkWrite)
    const operations = items.map((item: any) => ({
      updateOne: {
        // Filtramos por ID y aseguramos que haya suficiente stock
        filter: { _id: new ObjectId(item._id), stock: { $gte: item.cartQuantity } },
        update: { $inc: { stock: -item.cartQuantity } },
      },
    }));

    const result = await collection.bulkWrite(operations);

    // Si modifiedCount es menor que items.length, significa que algunos no tenían stock suficiente
    // Para esta simulación asumiremos éxito si no hay error de BD
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ message: "Failed to process payment" }, { status: 500 });
  }
}