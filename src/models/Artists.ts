// src/models/artist.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface Iartist extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  labelId: mongoose.Schema.Types.ObjectId;
  artistName: string;
  iprs: boolean;
  iprsNumber?: number;
  facebook?: string;
  appleMusic?: string;
  spotify?: string;
  instagram?: string;
  profileImage?: string;
  isSinger: boolean;
  isLyricist: boolean;
  isComposer: boolean;
  isProducer: boolean;

}

const artistSchema: Schema<Iartist> = new Schema({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    ref: "Labels"
  },
  artistName: {
    type: String,
    required: true,
  },
  iprs: {
    type: Boolean,
    required: true,
  },
  iprsNumber: {
    type: String
  },
  facebook: {
    type: String,
  },
  appleMusic: {
    type: String
  },
  spotify: {
    type: String
  },
  instagram: {
    type: String
  },
  profileImage: {
    type: String
  },
  isSinger: {
    type: Boolean,
    default: false
  },
  isLyricist: {
    type: Boolean,
    default: false
  },
  isComposer: {
    type: Boolean,
    default: false
  },
  isProducer: {
    type: Boolean,
    default: false
  },

});


const Artist = mongoose.models.artist as mongoose.Model<Iartist> || mongoose.model<Iartist>('artist', artistSchema);

export default Artist

