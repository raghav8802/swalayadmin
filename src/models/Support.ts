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
  ticketId: string;
}

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
  },
  ticketId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Function to generate ticket ID
async function generateTicketId() {
  try {
    // Find the latest ticket
    const latestTicket = await mongoose.models.Support.findOne(
      {},
      {},
      { sort: { ticketId: -1 } }
    );

    let nextNumber = 20725; // Starting number
    
    if (latestTicket && latestTicket.ticketId) {
      // Extract the number from the latest ticket ID and increment it
      const latestNumber = parseInt(latestTicket.ticketId);
      if (!isNaN(latestNumber)) {
        nextNumber = latestNumber + 1;
      }
    }

    return nextNumber.toString();
  } catch (error) {
    console.error('Error generating ticket ID:', error);
    throw new Error(`Failed to generate ticket ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


// Pre-save middleware
SupportSchema.pre('save', async function(next) {
  try {
    
    
    if (!this.ticketId) {
      console.log('No ticketId found, generating new one');
      const generatedId = await generateTicketId();
      console.log('Generated ID:', generatedId);
      this.ticketId = generatedId;
    }
    
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error as Error);
  }
});

// Create indexes for better query performance
SupportSchema.index({ status: 1, createdAt: -1 });
SupportSchema.index({ isClosed: 1, priority: 1 });




const Support = mongoose.models.Support || mongoose.model<ISupport>('Support', SupportSchema);

export default Support;
