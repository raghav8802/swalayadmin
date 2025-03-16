import mongoose from "mongoose";

const recognitionSchema = new mongoose.Schema({
  trackId: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  acrCloudFileId: {
    type: String,
    required: true,
  },
  recognitionDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Check if the model exists before creating a new one
const Recognition = mongoose.models.Recognition || mongoose.model('Recognition', recognitionSchema);

export default Recognition; 