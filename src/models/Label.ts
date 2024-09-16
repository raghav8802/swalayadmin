import mongoose, { Schema, Document } from 'mongoose';

export interface iLabel extends Document {
  username: string;
  email: string;
  contact: string;
  razor_contact: string;
  password: string;
  usertype: string;
  verifyCode: string;
  verifyCodeExpiry: Date | null; // Corrected type
  isVerified: boolean;
  isLable: boolean;
  lable: string | null; // Specify this can also be null
  joinedAt: Date;
  subscriptionEndDate: Date;
}

const LabelSchema: Schema<iLabel> = new Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    trim: true,
    unique: true,
    // eslint-disable-next-line no-useless-escape
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  contact: {
    type: String, // Changed from Number to String
    required: [true, 'Number required'],
    trim: true,
    unique: true,
    match: [/^(\+?\d{1,4}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?[\d\s.-]{7,10}$/, 'Please use a valid contact number'],
  },
  razor_contact: {
    type: String,
    required: [true, 'Razorpay contact ID required'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    trim: true,
  },
  usertype: {
    type: String,
    enum: ['normal', 'super'],
    default: 'super',
  },
  verifyCode: {
    type: String,
    default: undefined,
  },
  verifyCodeExpiry: {
    type: Date,
    default: undefined,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isLable: {
    type: Boolean,
    default: false,
  },
  lable: {
    type: String,
    default: null,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  subscriptionEndDate: {
    type: Date,
    default: Date.now,
  },
});

const Label = (mongoose.models.Labels as mongoose.Model<iLabel>) || mongoose.model<iLabel>('Labels', LabelSchema);

export default Label;