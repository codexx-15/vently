import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { Feedback } from '@/lib/mongodb/models';

// GET feedback
export async function GET() {
  try {
    await dbConnect();
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST feedback
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const feedback = await Feedback.create(data);
    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH feedback (visibility toggle)
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, isVisible } = await req.json();
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { isVisible },
      { new: true }
    );
    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE feedback
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Feedback.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
