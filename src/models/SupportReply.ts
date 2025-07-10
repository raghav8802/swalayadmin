import mongoose, { Document, Schema } from 'mongoose';

interface ISupportReply extends Document {
  supportId: mongoose.Types.ObjectId;
  senderType: 'user' | 'admin';
  senderId: string;
  senderName: string;
  message: string;
  isRead: boolean;
}

const SupportReplySchema: Schema = new Schema({
  supportId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Support', 
    required: true 
  },
  senderType: { 
    type: String, 
    enum: ['user', 'admin'], 
    required: true 
  },
  senderId: { 
    type: String, 
    required: true 
  },
  senderName: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Create index for better query performance
SupportReplySchema.index({ supportId: 1, createdAt: -1 });

const SupportReply = mongoose.models.SupportReply || mongoose.model<ISupportReply>('SupportReply', SupportReplySchema);

export default SupportReply; 