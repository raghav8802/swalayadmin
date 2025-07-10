import mongoose, { Document, Schema } from 'mongoose';

interface ISupport extends Document {
  name: string;
  email: string;
  labelId: string;
  subject: string;
  message: string;
  status: string;
  isClosed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}
//support schema

const SupportSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  labelId: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved'], 
    default: 'pending' 
  },
  isClosed: { 
    type: Boolean, 
    default: false 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  category: { 
    type: String, 
    default: 'general' 
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
SupportSchema.index({ status: 1, createdAt: -1 });
SupportSchema.index({ isClosed: 1, priority: 1 });

const Support = mongoose.models.Support || mongoose.model<ISupport>('Support', SupportSchema);

export default support;
