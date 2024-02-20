import { NextResponse } from "next/server";
import { Product } from "@/models/product.model";
import connectdb from "@/dbConfig/dbconfig";

export async function GET() {
  try {
    await connectdb();

    const categoryFilter = 'men'; // Set the desired category

    // Filter products based on category (men and both, excluding womenmen)
    const filteredProducts = await Product.find({
      category: { $nin: ['womenmen'] }
    });

    return NextResponse.json({
      message: "Products fetched successfully",
      products: filteredProducts,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", error: true }, { status: 500 });
  }
}
