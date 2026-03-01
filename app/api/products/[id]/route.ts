// c:\Users\luismarin\Documents\ProyectoNewman2\app\api\products\[id]\route.ts

import { NextResponse, type NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import { IProduct, PRODUCTS_COLLECTION } from "@/modules/product/domain/product.entity";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validamos que el ID del producto sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const { title, description, price, stock, sellerId } = body;
    
    const collection = await getCollection<IProduct>(PRODUCTS_COLLECTION);

    // Construimos el objeto con los campos a actualizar
    const updateData: Partial<IProduct> = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);

    // Ejecutamos la actualización verificando también el sellerId por seguridad
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), sellerId: new ObjectId(sellerId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { message: "Product not found or unauthorized" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}
