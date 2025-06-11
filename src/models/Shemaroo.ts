import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// TypeScript interface
export interface IShemaruUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  isActive: boolean; // Optional field for user status
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ShemaruUserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],

  },
  isActive: {
    type: Boolean,
    default: false // Optional field to indicate if the user is active
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
ShemaruUserSchema.pre<IShemaruUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
ShemaruUserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create model if it doesn't exist
export default mongoose.models.ShemaruUser || mongoose.model<IShemaruUser>('ShemaruUser', ShemaruUserSchema);