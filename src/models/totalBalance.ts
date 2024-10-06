// src/models/totalBalance.model.ts

import mongoose, { Document, Schema } from 'mongoose';

interface ITotalBalance extends Document {
  labelId: string;
  totalBalance: number;
}

const TotalBalanceSchema: Schema = new Schema({
  labelId: { type: String, required: true, unique: true },
  totalBalance: { type: Number, required: true, default: 0 },
});

const TotalBalance = mongoose.models.TotalBalance || mongoose.model<ITotalBalance>('TotalBalance', TotalBalanceSchema);

export default TotalBalance;