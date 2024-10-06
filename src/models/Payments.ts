import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the interface for the Payment document
interface IPayment extends Document {
  labelId: ObjectId;
  label: string;
  amount: string;
  status?: number;
  time: Date;
  type: string;
  payout_report_url?: string | null;
}

// Define the schema for the Payment collection
const PaymentSchema: Schema<IPayment> = new Schema<IPayment>({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Labels",
    required: true,
  },
  amount: {
    type: String,
    required: [true, "Enter Amount"],
  },
  status: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Date,
    required: [true, "Enter Time"],
  },
  type: { type: String, default: "Royalty" },
  payout_report_url: { type: String },
});

// Create the model for the Payment collection
const Payment =
  (mongoose.models.Payment as mongoose.Model<IPayment>) ||
  mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;

