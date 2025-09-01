import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
    },
    email: {
      type: String,
      required: true,
      // lowercase: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      //   },
      //   message: 'Invalid email format',
      // },
    },
    phone: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[6-9]\d{9}$/.test(v);
      //   },
      //   message: 'Invalid phone number',
      // },
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

export default mongoose.model("Company", CompanySchema);
