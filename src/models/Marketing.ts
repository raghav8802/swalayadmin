import mongoose, { Schema, Document, Model } from "mongoose";

// Interface to define the shape of the document
export interface IMarketing extends Document {
  labelId: mongoose.Schema.Types.ObjectId;
  mood: string;
  aboutArtist: string;
  artistInstagramUrl: string;
  aboutSong: string;
  promotionLinks: string;
  extraFile?: string; // Optional file field
  albumId: string;
  albumName: string;
  isExtraFileRequested: boolean; // Boolean for extra file request
  comment?: string; // Optional comment field
}

// Define the schema
const MarketingSchema: Schema<IMarketing> = new Schema(
  {
    labelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labels",
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
    aboutArtist: {
      type: String,
      required: true,
      trim: true,
    },
    artistInstagramUrl: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/.test(
            v
          );
        },
        message: "Invalid Instagram URL format",
      },
    },
    aboutSong: {
      type: String,
      required: true,
      trim: true,
    },
    promotionLinks: {
      type: String,
      required: false,
      trim: true,
    },
    extraFile: {
      type: String, // Store the file path or URL for extra files
      required: false,
    },
    albumId: {
      type: String,
      required: true,
    },
    albumName: {
      type: String,
      required: true,
      trim: true,
    },
    isExtraFileRequested: {
      type: Boolean,
      required: true,
      default: false, // Default value if not provided
    },
    comment: {
      type: String,
      required: false, // Comment is optional
      trim: true,
    },
  }
);

// Define the model
const Marketing: Model<IMarketing> =
  mongoose.models.Marketing ||
  mongoose.model<IMarketing>("Marketing", MarketingSchema);

export default Marketing;
