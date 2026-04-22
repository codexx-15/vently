import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/client';
import { Settings } from '@/lib/mongodb/models';

// GET settings
export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Settings.create({
        siteName: "Vently",
        logo: "",
        footerText: "Your safe space to vent, reflect, and be understood. Built for a calmer, more human connection.",
        socialLinks: {
          instagram: "#",
          twitter: "#",
          linkedin: "#"
        },
        heroImages: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"],
        heroVideos: [],
        emotionalImages: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop"
        ]
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE settings
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true }
    );
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
