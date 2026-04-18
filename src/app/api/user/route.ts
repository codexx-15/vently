import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { User } from '@/lib/mongodb/models';

// GET user profile
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST/UPDATE user profile
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: data.email },
      { $set: data },
      { new: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
