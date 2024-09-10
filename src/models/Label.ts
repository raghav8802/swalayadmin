import mongoose, { Schema, Document } from "mongoose";

export interface iLabel extends Document {
  username: string;
  email: string;
  contact: string;
  password: string;
  usertype: string;
  verifyCode: string;
  verifyCodeExpiry: Date | null;
  isVerified: boolean;
  isLable: boolean;
  lable: string;
  joinedAt: Date;
  subscriptionEndDate: Date;
  state: string;
  status: string;
  
}

const LabelSchema: Schema<iLabel> = new Schema({
  username: {
    type: String,
    required: [true, "Username required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password required"],
    trim: true,
  },
  contact: {
    type: String,
    required: [true, "Contact required"],
    trim: true,
  },
  usertype: {
    type: String,
    enum: ["normal", "super"],
    default: "super",
  },
  verifyCode: {
    type: String,
    default: undefined,
  },
  verifyCodeExpiry: {
    type: Date || null,
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
  state: {
    type: String,
    default: "active",
  },
  status: {
    type: String,
    default: "active",
  }
});

const Label =
  (mongoose.models.Labels as mongoose.Model<iLabel>) ||
  mongoose.model<iLabel>("Labels", LabelSchema);

export default Label;

