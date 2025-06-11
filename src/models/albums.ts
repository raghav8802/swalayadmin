import mongoose, { Schema, Document } from "mongoose";

export enum AlbumStatus {
  Draft = 0, // on information submit
  Processing = 1, // on final submit
  Approved = 2,
  Rejected = 3,
  Live = 4,
}


export enum ShemarooStatus {
  Draft = 0, // Shemaroo draft - album is in draft state
  Approved = 1, // Shemaroo approved - send album to Shemaroo
  Live = 2, // Shemaroo live - album is live on Shemaroo
  Rejected = 3, // Shemaroo rejected - album is not live on Shemaroo
}

// Define the interface for the Album document
interface IAlbum extends Document {
  labelId: mongoose.Schema.Types.ObjectId;
  title?: string | null;
  thumbnail?: string | null;
  language?: string | null;
  genre?: string | null;
  releasedate?: Date | null;
  totalTracks?: number;
  upc?: string | null;
  artist?: string | null;
  cline?: string | null;
  pline?: string | null;
  status: AlbumStatus; //update album status
  tags?: string[] | null;
  comment: string;
  shemaroDeliveryStatus?: ShemarooStatus;
}

// Define the schema for the Album collection
const albumSchema: Schema = new Schema({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Labels",
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
  genre: {
    type: String,
    default: null,
  },
  releasedate: {
    type: Date,
    default: null,
  },
  totalTracks: {
    type: Number,
    default: 0,
  },
  upc: {
    type: String,
    default: null,
  },
  artist: {
    type: String,
    default: null,
  },
  cline: {
    type: String,
    default: null,
  },
  pline: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    enum: AlbumStatus,
    required: true,
    default: AlbumStatus.Draft,
  },
  tags: {
    type: [String],
    default: [],
  },
  comment: {
    type: String,
    default: null,
  },
  shemaroDeliveryStatus: {
    type: Number,
    enum: ShemarooStatus,
    default: ShemarooStatus.Draft,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Create the model for the Album collection
const Album = mongoose.models.Album || mongoose.model<IAlbum>("Album", albumSchema);

export default Album;
