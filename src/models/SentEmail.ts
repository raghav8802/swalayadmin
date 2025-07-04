import mongoose, { Schema, Document } from 'mongoose';

export interface ISentEmail extends Document {
  recipients: Array<{ _id: string; username: string; email: string }>;
  subject: string;
  html: string;
  sentAt: Date;
  sender?: { _id?: string; username?: string; email?: string };
}

const SentEmailSchema: Schema<ISentEmail> = new Schema({
  recipients: [
    {
      _id: { type: String, required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
  subject: { type: String, required: true },
  html: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  sender: {
    _id: { type: String },
    username: { type: String },
    email: { type: String },
  },
});

const SentEmail = mongoose.models.SentEmail || mongoose.model<ISentEmail>('SentEmail', SentEmailSchema);

export default SentEmail; 