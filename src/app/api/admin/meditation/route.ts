import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { Meditation } from '@/lib/mongodb/models';

// CREATE meditation
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const created = await Meditation.create(data);
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE meditation
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, ...data } = await req.json();
    const updated = await Meditation.findByIdAndUpdate(id, { $set: data }, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE meditation
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Meditation.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
