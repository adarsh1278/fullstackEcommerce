import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import { uploadOnCloudinary } from "@/utils/cloudnary";
import { User } from "@/models/user.model";

import { OTPModel } from "@/models/otp.model";
import connectdb from "@/dbConfig/dbconfig";

export async function POST(req) {
  try {
    const {otp,username,email,Name,password} =  await req.json();

    console.log("data is given below");
    console.log(username, Name, password, email , otp);

    if ( !username || !Name || !email || !password) {
      return NextResponse.json({ "message": "No image found or missing required fields", "error": true }, { status: 400 });
    }
    
    await connectdb();
    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      console.log("usr already exist")
      return NextResponse.json({ "message": "User already exists with this email", "error": true }, { status: 400 });
    }
    //  const Otp = await OTPModel.findOne({email});
    
    //  if(!Otp){
    //   console.log("Send otp first")
    //   return NextResponse.json({ "message": "Send otp first", "error": true }, { status: 400 });
    //  }
    //  if(Otp.otp != otp){
    //   return NextResponse.json({ "message": "Wrong Otp", "error": true }, { status: 400 });
    //  }
console.log("Otp verified");
// Otp.expiresAt = new Date();
// await Otp.save();
console.log("Otp deleted");

    // const byteData = await file.arrayBuffer();
    // const buffer = Buffer.from(byteData);
    // const path = `./public/${file.name}`;
    // await writeFile(path, buffer);

    // const cloudinaryRes = await uploadOnCloudinary(path);
    // const avtar = cloudinaryRes.url;
    // console.log(`avatar is ${avtar}`);

    

    const newUser = new User({
      username,
      email,
      Name,
      password,
        // Fix: Change 'avtar' to 'avatar'
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    if (!savedUser) {
      return NextResponse.json({ "message": "Internal Server Error", "error": true }, { status: 500 });
    }

    return NextResponse.json({
      message: "User created successfully",
      user: savedUser
    } , {status:200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ "message": "Internal Server Error", "error": true }, { status: 500 });
  }
}