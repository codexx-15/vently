import mongoose, { Schema, model, models } from 'mongoose';

// User Profile Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Added password field
  phone: { type: String },
  address: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

// Feedback Schema
const FeedbackSchema = new Schema({
  userName: { type: String, required: true },
  userAvatar: { type: String },
  content: { type: String, required: true },
  isVisible: { type: Boolean, default: false },
  date: { type: String },
}, { timestamps: true });

// Site Settings Schema
const SettingsSchema = new Schema({
  siteName: { type: String, default: 'Vently' },
  logo: { type: String },
  footerText: { type: String, default: 'Your safe space to vent, reflect, and be understood. Built for a calmer, more human connection.' },
  socialLinks: {
    instagram: { type: String, default: '#' },
    twitter: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
  },
  heroImages: [{ type: String }],
  heroVideos: [{ type: String }],
  emotionalImages: [{ type: String }],
}, { timestamps: true });

// Yoga Asana Schema
const YogaAsanaSchema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }], // Changed from image to images
  benefits: [{ type: String }],
  howItHelps: { type: String },
  bodyParts: [{ type: String }],
  youtubeLink: { type: String },
}, { timestamps: true });

// Meditation Content Schema
const MeditationSchema = new Schema({
  title: { type: String, required: true },
  images: [{ type: String, required: true }], // Changed from image to images
  mood: { type: String, required: true }, // Anxiety, Sadness, Overthinking, Sleep, Energy
  duration: { type: String },
  youtubeLink: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);
export const Feedback = models.Feedback || model('Feedback', FeedbackSchema);
export const Settings = models.Settings || model('Settings', SettingsSchema);
export const YogaAsana = models.YogaAsana || model('YogaAsana', YogaAsanaSchema);
export const Meditation = models.Meditation || model('Meditation', MeditationSchema);
