import mongoose from "mongoose";



const leadSchema = new mongoose.Schema({
  labelName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: false  // Made optional since it might not always be needed
  }
}, {
  timestamps: true
});

// Make sure we're using a consistent model name
const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead; 