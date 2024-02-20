// pages/api/sendEmail.js
// pages/api/sendEmail.js
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { OTPModel } from '@/models/otp.model';
import connectdb from '@/dbConfig/dbconfig';

connectdb();

function generateOTP() {
  // Generate a random 4-digit number
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString(); // Convert to string if needed
}

export async function POST(NextRequest) {
  const { email } = await NextRequest.json();
  console.log(NextRequest)
  const to = email;

  console.log("Under POST..............");

  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const otp = generateOTP();
    const otpDocument = new OTPModel({
      email: to,
      otp,
    });
    await otpDocument.save();
    console.log("OTP saved successfully");

    const subject = "OTP Verification";
    const text = `Your OTP for login nextauth.com is ${otp}`;

    // Create an email message
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, {status:"200"});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error sending email' });
  }
}
