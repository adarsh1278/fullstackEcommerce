import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { Cart } from "@/models/cart.model"; // Adjust the path based on your project structure
import connectdb from "@/dbConfig/dbconfig";
import { User } from "@/models/user.model";
import { Product } from "@/models/product.model";

export async function POST(req) {
  try {
    const token = String(await req.cookies.get('token')?.value||""); // Explicitly cast to string
    const { productId, quantity = 1 } = await req.json();
     await connectdb();
    if (!token) {
      return NextResponse.json({ message: "Invalid or missing token", error: true }, { status: 400 });
    }

      const decodedToken =  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!decodedToken || typeof decodedToken !== 'object') {
        return NextResponse.json({ message: "Invalid decoded token", error: true }, { status: 400 });
      }

      const userId = decodedToken._id;
      const user = await User.findById(userId).select("-password");

      console.log(`user found ${user}`);

      console.log("Data is given below");
      console.log(productId, quantity);

      if (!userId || !productId) {
        return NextResponse.json({ message: "Missing required fields", error: true }, { status: 400 });
      }

      const product = await Product.findById(productId).select("-owner");

      if (!product) {
        return NextResponse.json({ message: "Product does not exist", error: true }, { status: 400 });
      }

      console.log(`product is ${product}`);

      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        // If the cart doesn't exist, create a new one
        cart = new Cart({
          user: userId,
          items: [{ product: productId, quantity }],
        });
      } else {
        // If the cart exists, check if the product is already in the cart
        const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (existingItemIndex !== -1) {
          // If the product already exists, increase the quantity
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // If the product doesn't exist, add it to the cart
          cart.items.push({ product: productId, quantity });
        }
      }

      const updatedCart = await cart.save();
      console.log(updatedCart);

      return NextResponse.json({
        message: "Product added to the cart successfully",
        cart: updatedCart,
        product: product,
        user: user,
      }, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", error: true }, { status: 500 });
  }

}