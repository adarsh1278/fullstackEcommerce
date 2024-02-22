import { NextResponse } from "next/server";
import { Cart } from "@/models/cart.model"; // Adjust the path based on your project structure
import { Product } from "@/models/product.model"; // Adjust the path based on your project structure
import connectdb from "@/dbConfig/dbconfig";

export async function GET(req) {
  try {
    const userId = "65d311defa9671da833b1c20"

    console.log("User ID is given below");
    console.log(userId);

    if (!userId) {
      return NextResponse.json({ message: "Missing user ID", error: true }, { status: 400 });
    }

    await connectdb();

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found for the user", error: true }, { status: 404 });
    }

    const productIds = cart.items.map(item => item.product);

    // Use aggregation pipeline to fetch all products in a single query
    const products = await Product.aggregate([
      { $match: { _id: { $in: productIds } } },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          available: 1,
          images: 1,
          category: 1,
        },
      },
    ]);

    // Create a map for faster lookup
    const productMap = new Map(products.map(product => [product._id.toString(), product]));

    // Map cart items to include product details
    const cartItems = cart.items.map(item => {
      const product = productMap.get(item.product.toString());

      if (!product) {
        console.warn(`Product not found for ID: ${item.product}`);
        return null;
      }

      return {
        ...product,
        quantity: item.quantity,
      };
    });

    // Filter out any null values (products not found)
    const validCartItems = cartItems.filter(Boolean);

    return NextResponse.json({
      message: "Cart fetched successfully",
      cart: validCartItems,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", error: true }, { status: 500 });
  }
}
