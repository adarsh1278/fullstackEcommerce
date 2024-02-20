import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
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
    console.error("Error generating tokens:", error);
    throw new Error("Error generating tokens");
  }
};

export async function POST(NextRequest) {
  try {
    connectdb();
    const { username, password, email } = await NextRequest.json();

    if (!username && !email) {
      return NextResponse.json({
        status: 400,
        body: {
          message: "Username or email is required",
          success: false,
        },
      });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

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
    };

    console.log("Login successful");

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    }, { status: "200" });

    response.cookies.set("token", accessToken, options);

    console.log("Cookie sent successfully");
    return response;
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "Internal Server Error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      status: 500,
      body: {
        message: errorMessage,
        success: false,
      },
    });
  }
}
