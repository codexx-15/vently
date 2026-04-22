import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { Meditation } from '@/lib/mongodb/models';

export async function GET() {
  try {
    await dbConnect();
    const meditations = await Meditation.find().sort({ createdAt: -1 });
    return NextResponse.json(meditations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
