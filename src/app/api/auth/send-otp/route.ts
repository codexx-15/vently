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
    
    if (!brevoApiKey) {
      console.error('CRITICAL: BREVO_API_KEY is missing from process.env');
      return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey.trim(),
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Vently Support', email: 'codexx299@gmail.com' },
        to: [{ email: user.email, name: user.name }],
        subject: 'Login Verification Code - Vently',
        htmlContent: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; border-radius: 24px; background: #ffffff; border: 1px solid #f0f0f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #000; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Vently</h1>
            </div>
            <p style="font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 24px;">Hi ${user.name}, use the code below to sign in to your account. This code will expire in 10 minutes.</p>
            <div style="background: #f8f9fa; border-radius: 16px; padding: 32px; text-align: center; font-size: 36px; font-weight: 700; color: #000; letter-spacing: 12px; margin-bottom: 24px; border: 1px solid #eeeeee;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #999; text-align: center; margin-bottom: 30px;">If you didn't request this code, you can safely ignore this email.</p>
            <div style="border-top: 1px solid #eeeeee; padding-top: 24px; text-align: center;">
              <p style="font-size: 12px; color: #bbbbbb; margin: 0;">© 2024 Vently. All rights reserved.</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('BREVO ERROR RESPONSE:', JSON.stringify(data, null, 2));
      return NextResponse.json({ 
        error: `Brevo API Error: ${data.message || 'Invalid API Key'}`,
        debug: data
      }, { status: response.status });
    }

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
