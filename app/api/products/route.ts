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