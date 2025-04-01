import mongoose, { Document, Schema } from 'mongoose';

// Interface for the ProfileBankDetails document
interface IProfileBankDetails extends Document {
  labelId: mongoose.Schema.Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  pan: string;
  gstNo: string;
}

// Schema definition
const ProfileBankDetailsSchema: Schema<IProfileBankDetails> = new Schema({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Labels"
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  branchName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true
  },
  upiId: {
    type: String,
    trim: true
  },
  pan: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gstNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});


const BankData = mongoose.models.bank as mongoose.Model<IProfileBankDetails> || mongoose.model<IProfileBankDetails>('bank', ProfileBankDetailsSchema);

export default BankData
