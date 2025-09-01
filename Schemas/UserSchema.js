import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      // match: /^[a-zA-Z]{3,}$/, 'Invalid username'
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
      required: true,
      unique: true,
      // match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN']
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
