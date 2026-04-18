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
  heroImages: [{ type: String }],
  emotionalImages: [{ type: String }],
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);
export const Feedback = models.Feedback || model('Feedback', FeedbackSchema);
export const Settings = models.Settings || model('Settings', SettingsSchema);
