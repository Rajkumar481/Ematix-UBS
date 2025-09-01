import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    invoiceNumber: String,
    invoiceDate: String,
    billingDate: String,
    dueDate: String,

    modeOfPayment: {
      type: String,
      enum: ["Cash", "Credit"],
      required: true,
      default: "Cash",
    },
    otherRef: String,
    GRNoDate: String,
    deliveryNote: String,
    supplierRef: String,
    buyerOrderNo: String,
    deliveryNoteDate: String,
    despatchedThrough: String,
    destination: String,
    termsOfDelivery: String,

    sellerDetails: {
      _id: false,
      name: String,
      address: String,
    },
    buyerDetails: {
      _id: false,
      name: String,
      email: String,
      phone: String,
      address: String,
      state: String,
    },

    items: [
      {
        _id: false,
        productName: String,
        hsnCode: String,
        quantity: Number,
        purchaseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Purchase",
        },
        rate: Number,
        discountPercentage: { type: Number, default: 0 },
        amount: Number, // amount after discount
      },
    ],

    subTotal: Number, // before round off
    grandTotal: Number, // after round off
    roundOff: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Sales", SalesSchema);
