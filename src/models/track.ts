import mongoose, { Schema, Document } from "mongoose";

// Define the Track interface extending Document
export interface ITrack extends Document {
  albumId: mongoose.Schema.Types.ObjectId;
  songName: string | null;
  primarySinger: string | null;
  singers: string[] | null; // it will store array of string like this ['singerid', 'singerid', 'singerid']
  composers: string[] | null; // it will store array of string like this ['singerid', 'singerid', 'singerid']
  lyricists: string[] | null; // it will store array of string like this ['singerid', 'singerid', 'singerid']
  producers: string[] | null; // it will store array of string like this ['singerid', 'singerid', 'singerid']
  audioFile: string | null; 
  audioFileWav: string | null;
  isrc: string | null;
  duration: string | null;
  crbt: string | null;
  platformLinks: { 
    SpotifyLink: string | null, 
    AppleLink: string | null, 
    Instagram: string | null, 
    Facebook: string | null 
  } | null;
  category: string | null;
  version: string | null;
  trackType: string | null;
  trackOrderNumber: string | null;
}

// Define the schema
const trackSchema: Schema<ITrack> = new Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "albums",
    required: true
  },
  songName: {
    type: String,
    default: null,
  },
  primarySinger: {
    type: String,
    default: null,
  },
  singers: {
    type: [String],
    default: null,
  },
  composers: {
    type: [String],
    default: null,
  },
  lyricists: {
    type: [String],
    default: null,
  },
  producers: {
    type: [String],
    default: null,
  },
  audioFile: {
    type: String,
    default: null,
  },
  audioFileWav: {
    type: String,
    default: null,
  },
  isrc: {
    type: String,
    default: null,
  },
  duration: {
    type: String,
    default: null,
  },
  crbt: {
    type: String,
    default: null,
  },
  platformLinks: {
    type: {
      SpotifyLink: { type: String, default: null },
      AppleLink: { type: String, default: null },
      Instagram: { type: String, default: null },
      Facebook: { type: String, default: null },
    },
    default: null,
  },
  category: {
    type: String,
    default: null,
  },
  version: {
    type: String,
    default: null,
  },
  trackType: {
    type: String,
    default: null,
  },
  trackOrderNumber: {
    type: String,
    default: null,
  },
});


// Define the model
const Track = mongoose.models.Track || mongoose.model<ITrack>("Track", trackSchema);
export default Track;
