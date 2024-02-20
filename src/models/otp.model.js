// otp.model.js
import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
 
  email: {
    type: String,
    required: true,
    unique:true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 10 * 60 * 1000, // 10 minutes expiration
  },
});

// Define a TTL index for automatic expiration after 10 minutes
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

let OTPModel;

try {
  // Attempt to retrieve the existing model
  OTPModel = mongoose.model("OTP");
} catch (e) {
  // If the model doesn't exist, create and compile it
  OTPModel = mongoose.model("OTP", OTPSchema);
}

export { OTPModel };
