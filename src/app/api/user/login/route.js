import { User } from "@/models/user.model";
import { Jwt } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connectdb from "@/dbConfig/dbconfig";

connectdb();
const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error("Error generating tokens");
  }
};

export async function POST(NextRequest) {
  try {
    connectdb();
   console.log("username below");
   const { username, password, email } = await NextRequest.json();

 
   console.log("username", username)
  console.log("username up???");

 
    if (!username && !email) {
      return NextResponse.json({
        status: 400,
        body: {
          message: "Username or email is required",
          success: false,
        },
      });
    }

    const user = await User.findOne({  $or: [{username}, {email}] });

    if (!user) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "User does not exist",
          success: false,
        },
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return NextResponse.json({
        status: 401,
        body: {
          message: "Invalid user credentials",
          success: false,
        },
      });
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true,
      maxage:1,
    };
console.log("Login succefully")

const response = NextResponse.json({

  status: 200,
  body: {
    message: "User login succefully",
    success: true,
  },

})
response.cookies.set("token", accessToken, options
)
console.log("cokkie send succefully");
// console.log(`response status is ${response.data.status}`)
return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Internal Server Error",
        success: false,
      },
    });
  }
}
