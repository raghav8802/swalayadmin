import mongoose, { Document, Schema } from 'mongoose';

interface ISupport extends Document {
  name: string;
  email: string;
  labelId: string;
  subject: string;
  message: string;
  reply: string;
  status: string;
  field1: string; // Extra field for future use
  field2: string; // Extra field for future use
}

const SupportSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  labelId: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  field1: { type: String, default: '' },
  field2: { type: String, default: '' }
}, {
  timestamps: true
});

const Support = mongoose.models.Support || mongoose.model<ISupport>('Support', SupportSchema);

export default Support;