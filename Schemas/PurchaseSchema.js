import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    billingDate: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    despatchedThrough: {
      type: String,
      required: true,
    },
    vehicleNo: {
      type: String,
    },
    driverPhoneNo: {
      type: String,
      required: true,
    },
    purchaseOrderId: {
      type: String,
      required: true,
    },
    items: [
      {
        productName: {
          type: String,
          required: true,
        },
        hsnCode: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        sellingPrice: {
          type: Number,
          required: true,
        },
        purchasePrice: {
          type: Number,
          required: true,
        },
        gst: {
          type: Number,
          required: true,
        },
        gstAmount: {
          type: Number,
        },
        total: {
          type: Number,
        },
        totalAmount: {
          type: Number,
        },
        profit: {
          type: Number,
        },
        salesQuantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

PurchaseSchema.pre("save", function (next) {
  this.items = this.items.map((item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const purchasePrice = parseFloat(item.purchasePrice) || 0;
    const sellingPrice = parseFloat(item.sellingPrice) || 0;
    const gst = parseFloat(item.gst) || 0;

    const total = quantity * purchasePrice;
    const gstAmount = (total * gst) / 100;
    const totalAmount = total + gstAmount;
    const profit = (sellingPrice - purchasePrice) * quantity;

    // ✅ Set salesQuantity only if this is a new document
    const salesQuantity =
      this.isNew || typeof item.salesQuantity === "undefined"
        ? quantity
        : item.salesQuantity;

    return {
      ...item,
      total: parseFloat(total.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      salesQuantity,
    };
  });

  next();
});

export default mongoose.model("Purchase", PurchaseSchema);
