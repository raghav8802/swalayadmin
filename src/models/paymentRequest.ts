import mongoose, { Document, Schema } from "mongoose";

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

interface IPaymentRequest extends Document {
  labelId: string;
  amount: number;
  request_at: Date;
  update_at: Date;
  status: PaymentStatus;
}

const PaymentRequestSchema: Schema = new Schema({
  labelId: { type: String, required: true },
  amount: { type: Number, required: true },
  request_at: {
    type: Date,
    default: Date.now(),
  },
  update_at: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: [PaymentStatus.PENDING, PaymentStatus.APPROVED],
    default: PaymentStatus.PENDING,
    required: true,
  }
});

const PaymentRequest =
  mongoose.models.PaymentRequest ||
  mongoose.model<IPaymentRequest>("PaymentRequest", PaymentRequestSchema);

export default PaymentRequest;
