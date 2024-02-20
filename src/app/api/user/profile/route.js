import connectdb from "@/dbConfig/dbconfig";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
export async function GET(NextRequest){
    console.log("Under profile post")
connectdb();
const request = NextRequest;
const token =  await request.cookies.get('token')?.value || ''
if(!token){
    console.log("token not found");
    return NextResponse.json({"message": "token not found"});
}

const decodedToken =  await jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
if(!decodedToken){
    return NextResponse.json({"message":"invailid roken"});

}
const _id = decodedToken._id;
const user = await User.findOne({ _id }).select("-password");
console.log(`use is ${user}`)
if(!user){
    return NextResponse.json({error: error.message}, {status: 400});
}
return NextResponse.json({
    message:"User found",
    data:user,
    "hi":"hi"
})




}