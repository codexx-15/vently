import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { User } from '@/lib/mongodb/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password, otp, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check role if specified
    if (role === 'admin' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. User is not an administrator.' }, { status: 403 });
    }

    if (otp) {
      // OTP Login
      if (user.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
      }
      if (new Date() > user.otpExpires) {
        return NextResponse.json({ error: 'OTP has expired' }, { status: 401 });
      }
      // Clear OTP after successful login
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
    } else if (password) {
      // Password Login
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Password or OTP is required' }, { status: 400 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
