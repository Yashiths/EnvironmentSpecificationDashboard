import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['User', 'Admin', 'Super Admin'],
      default: 'User'
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
