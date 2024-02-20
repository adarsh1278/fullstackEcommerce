import { NextResponse } from "next/server";
import { Product } from "@/models/product.model"; // Adjust the path based on your project structure
import connectdb from "@/dbConfig/dbconfig";

export async function GET() {
  try {
    await connectdb();

    const allProducts = await Product.find();

    return NextResponse.json({
      message: "All products fetched successfully",
      products: allProducts,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", error: true }, { status: 500 });
  }
}
