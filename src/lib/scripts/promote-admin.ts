import mongoose from 'mongoose';
import { User } from '../mongodb/models';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://codexx299_db_user:12345@fsd.kcdqapw.mongodb.net/vently?appName=FSD";

async function promoteAdmin() {
  const email = 'evilstrange154@gmail.com';
  const password = '@gTm_0215';

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB directly...');

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.findOneAndUpdate(
      { email },
      { 
        $set: { 
          role: 'admin',
          password: hashedPassword,
          name: 'Main Admin'
        } 
      },
      { upsert: true, new: true }
    );

    console.log(`Successfully updated/created admin user: ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting admin:', error);
    process.exit(1);
  }
}

promoteAdmin();
