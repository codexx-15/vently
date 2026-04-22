import dbConnect from './client';
import { YogaAsana } from './models';

const initialAsanas = [
  // ARMS & SHOULDERS
  {
    name: "Phalakasana (Plank Pose)",
    images: ["https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Strengthens arms", "Tones core", "Improves posture"],
    bodyParts: ["Arms", "Shoulders", "Core"],
    youtubeLink: "https://www.youtube.com/watch?v=pvIjsGZfVfM"
  },
  {
    name: "Chaturanga Dandasana (Four-Limbed Staff Pose)",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Strengthens triceps", "Develops core stability", "Tones wrists"],
    bodyParts: ["Arms", "Shoulders", "Triceps"],
    youtubeLink: "https://www.youtube.com/watch?v=5yWvS9p3R3Q"
  },
  {
    name: "Bakasana (Crow Pose)",
    images: ["https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Extreme arm strength", "Improves balance", "Tones abdominal organs"],
    bodyParts: ["Arms", "Shoulders", "Wrists"],
    youtubeLink: "https://www.youtube.com/watch?v=WGN_fH_O_w0"
  },
  {
    name: "Urdhva Mukha Svanasana (Upward-Facing Dog)",
    images: ["https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Opens chest", "Strengthens shoulders", "Stretches spine"],
    bodyParts: ["Shoulders", "Arms", "Chest"],
    youtubeLink: "https://www.youtube.com/watch?v=V9X9eX_0Bmk"
  },

  // LEGS & THIGHS
  {
    name: "Virabhadrasana I (Warrior I)",
    images: ["https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Strengthens thighs", "Stretches hip flexors", "Increases stamina"],
    bodyParts: ["Thighs", "Legs", "Hips"],
    youtubeLink: "https://www.youtube.com/watch?v=1W9u86D2M6g"
  },
  {
    name: "Virabhadrasana II (Warrior II)",
    images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Strengthens legs and ankles", "Stretches groins", "Stimulates digestion"],
    bodyParts: ["Legs", "Thighs", "Ankles"],
    youtubeLink: "https://www.youtube.com/watch?v=4Ejz7I6_U_g"
  },
  {
    name: "Utkatasana (Chair Pose)",
    images: ["https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Tones thighs", "Strengthens spine", "Stimulates heart"],
    bodyParts: ["Thighs", "Legs", "Ankles"],
    youtubeLink: "https://www.youtube.com/watch?v=LqUe_Y9E1-o"
  },
  {
    name: "Garudasana (Eagle Pose)",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Strengthens calves", "Stretches upper back", "Improves focus"],
    bodyParts: ["Legs", "Calves", "Thighs"],
    youtubeLink: "https://www.youtube.com/watch?v=L-K09Rpx-6A"
  },

  // CORE
  {
    name: "Navasana (Boat Pose)",
    images: ["https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Strengthens abdomen", "Improves digestion", "Relieves stress"],
    bodyParts: ["Core", "Abdominals"],
    youtubeLink: "https://www.youtube.com/watch?v=S9E_7Y9_Q_w"
  },
  {
    name: "Kumbhakasana (Forearm Plank)",
    images: ["https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Total core engagement", "Strengthens back", "Tones shoulders"],
    bodyParts: ["Core", "Back", "Shoulders"],
    youtubeLink: "https://www.youtube.com/watch?v=yW63v0H5vYc"
  },
  {
    name: "Vasisthasana (Side Plank)",
    images: ["https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Strengthens obliques", "Tones arms", "Improves balance"],
    bodyParts: ["Core", "Arms", "Shoulders"],
    youtubeLink: "https://www.youtube.com/watch?v=Jp_yD_W6_s8"
  },

  // HAMSTRINGS
  {
    name: "Paschimottanasana (Seated Forward Bend)",
    images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Deep hamstring stretch", "Calms mind", "Stretches spine"],
    bodyParts: ["Hamstrings", "Back", "Spine"],
    youtubeLink: "https://www.youtube.com/watch?v=pS3tM1a0T9k"
  },
  {
    name: "Uttanasana (Standing Forward Fold)",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Stretches hamstrings", "Relieves headaches", "Improves digestion"],
    bodyParts: ["Hamstrings", "Calves", "Back"],
    youtubeLink: "https://www.youtube.com/watch?v=g7U6_Y6_g8o"
  },
  {
    name: "Janu Sirsasana (Head-to-Knee Pose)",
    images: ["https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800"],
    benefits: ["Stretches hamstrings and groins", "Calms heart", "Relieves mild depression"],
    bodyParts: ["Hamstrings", "Groins", "Hips"],
    youtubeLink: "https://www.youtube.com/watch?v=o04i65oM6j0"
  }
];

export async function seedYoga() {
  try {
    await dbConnect();
    const count = await YogaAsana.countDocuments();
    if (count === 0) {
      await YogaAsana.insertMany(initialAsanas);
      console.log('Yoga asanas seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding yoga asanas:', error);
  }
}
