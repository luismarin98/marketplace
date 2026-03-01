// c:\Users\luismarin\Documents\ProyectoNewman2\app\api\orders\route.ts
import { NextResponse, type NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import { IOrder, ORDERS_COLLECTION, OrderStatus } from "@/modules/order/domain/order.entity";
import { IProduct, PRODUCTS_COLLECTION } from "@/modules/product/domain/product.entity";
import { verifyToken } from "@/lib/jwt";
import { logToSentinel } from "@/lib/sentinel";

// GET /api/orders - Obtener historial de compras del usuario
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role");

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    // Asumimos que el payload tiene userId (ajustar según tu implementación de JWT)
    const userId = (payload as any).userId || (payload as any).sub;

    const collection = await getCollection<IOrder>(ORDERS_COLLECTION);
    
    let query = {};
    if (role === "seller") {
      query = { "products.sellerId": new ObjectId(userId as string) };
    } else {
      query = { buyerId: new ObjectId(userId as string) };
    }

    const orders = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    await logToSentinel(request, {
      action: "fetch_orders",
      userId,
      role: role || "buyer",
      resultCount: orders.length,
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - Crear nueva orden de compra
export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    const userId = (payload as any).userId || (payload as any).sub;

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Invalid items" }, { status: 400 });
    }

    const productsCollection = await getCollection<IProduct>(PRODUCTS_COLLECTION);
    const ordersCollection = await getCollection<IOrder>(ORDERS_COLLECTION);

    // 1. Validar stock y calcular total con precios actuales de la BD
    let totalAmount = 0;
    const orderProducts = [];
    const productIds = items.map((i: any) => new ObjectId(i._id));
    
    const dbProducts = await productsCollection.find({ _id: { $in: productIds } }).toArray();

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p._id.toString() === item._id);
      
      if (!dbProduct) {
        return NextResponse.json({ message: `Producto no encontrado: ${item.title}` }, { status: 400 });
      }
      if (dbProduct.stock < item.cartQuantity) {
        return NextResponse.json({ message: `Stock insuficiente para: ${dbProduct.title}` }, { status: 400 });
      }

      totalAmount += dbProduct.price * item.cartQuantity;
      
      // Guardamos snapshot del producto
      orderProducts.push({
        productId: dbProduct._id,
        quantity: item.cartQuantity,
        title: dbProduct.title,
        price: dbProduct.price,
        sellerId: dbProduct.sellerId
      });
    }

    // 2. Descontar stock (Bulk Write)
    const operations = items.map((item: any) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: { $inc: { stock: -item.cartQuantity } },
      },
    }));

    await productsCollection.bulkWrite(operations);

    // 3. Crear la Orden
    const newOrder: Omit<IOrder, "_id"> = {
      buyerId: new ObjectId(userId as string),
      products: orderProducts,
      totalAmount,
      status: OrderStatus.COMPLETED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(newOrder as IOrder);

    await logToSentinel(request, {
      action: "create_order",
      userId,
      orderId: result.insertedId,
      totalAmount,
      itemsCount: items.length,
    });

    return NextResponse.json({ success: true, orderId: result.insertedId }, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
