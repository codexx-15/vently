import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { YogaAsana } from '@/lib/mongodb/models';
import { seedYoga } from '@/lib/mongodb/seed';

export async function GET() {
  try {
    await dbConnect();
    
    // Seed if empty
    const count = await YogaAsana.countDocuments();
    if (count === 0) {
      await seedYoga();
    }
    
    const asanas = await YogaAsana.find().sort({ createdAt: -1 });
    return NextResponse.json(asanas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
