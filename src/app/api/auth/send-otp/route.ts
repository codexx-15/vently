import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { User } from '@/lib/mongodb/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via Brevo
    const brevoApiKey = process.env.BREVO_API_KEY;
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Vently', email: 'no-reply@vently.com' },
        to: [{ email: user.email, name: user.name }],
        subject: 'Your Vently Login OTP',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
            <h2 style="color: #333; text-align: center;">Welcome to Vently</h2>
            <p style="font-size: 16px; color: #555;">Hello ${user.name},</p>
            <p style="font-size: 16px; color: #555;">Your one-time password (OTP) for login is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #888;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">© 2024 Vently. All rights reserved.</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
