import { NextResponse } from "next/server";
import { Product } from "@/models/product.model"; // Adjust the path based on your project structure
import connectdb from "@/dbConfig/dbconfig";

export async function POST(req) {
  try {
    const { name, price, available, description, images, owner , category } = await req.json();

    console.log("Data is given below");
    console.log(name, price, available, description, images, owner);

    if (!name || !price) {
      return NextResponse.json({ message: "Missing required fields", error: true }, { status: 400 });
    }

    await connectdb();

    const newProduct = new Product({
      name,
      price,
      available: available || true, // Default to true if not provided
      description: description || "node", // Default to "node" if not provided
      images: images || [], // Default to an empty array if not provided
      owner: owner || "admin", // Default to "admin" if not provided
      category:category||"both"
    
    });

    const savedProduct = await newProduct.save();
    console.log(savedProduct);

    if (!savedProduct) {
      return NextResponse.json({ message: "Internal Server Error", error: true }, { status: 500 });
    }

    return NextResponse.json({
      message: "Product added successfully",
      product: savedProduct,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", error: true }, { status: 500 });
  }
}
