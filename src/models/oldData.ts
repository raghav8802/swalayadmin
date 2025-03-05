import mongoose from "mongoose";

const oldDataSchema = new mongoose.Schema({
  UPC: { type: String },
  Album: { type: String },
  Song: { type: String },
  ISRC: { type: String },
  Label: { type: String },
  DateOfRelease: { type: Date  }, // Changed to Date type
  ArtistName: { type: String},
  Composer: { type: String },
  Lyricist: { type: String },
  Language: { type: String },
  Duration: { type: String }, // Could be converted to seconds if needed
  Stats: { type: String  },
});

// Create and export the model
// const oldData = mongoose.model("oldalbumData", oldDataSchema);
const oldData = mongoose.models.oldalbumData ||mongoose.model("oldalbumData", oldDataSchema);
export default oldData;