import mongoose, { Document, Schema } from "mongoose";

interface IYoutube extends Document {
  labelId: mongoose.Schema.Types.ObjectId;
  albumId: mongoose.Schema.Types.ObjectId;
  link: string | null;
  title: string | null;
  status: boolean;
  comment: string | null;
}

const youtubeSchema: Schema<IYoutube> = new Schema({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Labels",
    required: true,
  },

  link: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
    default: null,
  },
});


const Youtube =
  mongoose.models.Youtube || mongoose.model<IYoutube>("Youtube", youtubeSchema);

export default Youtube;
