import mongoose from "mongoose";
import Purchase from "../../Schemas/PurchaseSchema.js";
import Sales from "../../Schemas/Sales/SalesSchema.js";

function getFinancialYear(date = new Date()) {
  const year = date.getFullYear(); // 2025
  const month = date.getMonth() + 1; // Aug -> 8

  if (month >= 4) {
    // April to Dec → current year / next year
    return `${String(year).slice(2)}-${String(year + 1).slice(2)}`;
  } else {
    // Jan to March → previous year / current year
    return `${String(year - 1).slice(2)}-${String(year).slice(2)}`;
  }
}
function getMonthCode(date = new Date()) {
  return String(date.getMonth() + 1).padStart(2, "0");
}

async function generateInvoiceId() {
  const prefix = "EMA24"; // change if needed
  const now = new Date();
  const finYear = getFinancialYear(now);
  const month = getMonthCode(now);

  // Determine FY start and end dates
  const fyStart = new Date(
    now.getMonth() + 1 >= 4 ? now.getFullYear() : now.getFullYear() - 1,
    3,
    1
  );
  const fyEnd = new Date(fyStart.getFullYear() + 1, 2, 31, 23, 59, 59);

  // Count invoices only within current FY
  const count = await Sales.countDocuments({
    createdAt: { $gte: fyStart, $lte: fyEnd },
  });

  const invoiceNo = String(count + 1).padStart(2, "0");

  return `${prefix}/${finYear}/${month}/${invoiceNo}`;
}

// GET a single sales record by ID
export const getSalesById = async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.id)
      .populate({
        path: "items.purchaseId",
        select: "productName hsnCode sellingPrice gst",
      })
      .populate("userId");
    if (!sales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error in getSalesById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Sales
export const updateSales = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Update request for Sale ID:", req.body);

    // Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Sale ID" });
    }

    // Update data from req.body
    const updatedSale = await Sales.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ msg: "Sale not found" });
    }

    res.status(201).json({
      msg: "Sale updated successfully",
      sale: updatedSale,
    });
  } catch (error) {
    console.error("Update Sale Error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE a sales record by ID
export const deleteSales = async (req, res) => {
  try {
    const deletedSales = await Sales.findByIdAndDelete(req.params.id);
    if (!deletedSales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json({ message: "Sales record deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSales:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const createSales = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log(data);

//     const {
//       userId,
//       invoiceNumber,
//       invoiceDate,
//       billingDate,
//       dueDate,
//       modeOfPayment,
//       otherRef,
//       GRNoDate,
//       deliveryNote,
//       supplierRef,
//       buyerOrderNo,
//       deliveryNoteDate,
//       despatchedThrough,
//       destination,
//       termsOfDelivery,
//       sellerDetails,
//       buyerDetails,
//       roundOff = 0,
//       items: salesArray,
//     } = data;

//     if (!modeOfPayment) {
//       return res.status(400).json({ message: "modeOfPayment is required" });
//     }

//     if (!Array.isArray(salesArray) || salesArray.length === 0) {
//       return res.status(400).json({ message: "No sales items provided" });
//     }

//     if (!["Cash", "Credit"].includes(modeOfPayment)) {
//       return res.status(400).json({ message: "Invalid modeOfPayment value" });
//     }

//     const items = [];
//     let subTotal = 0;

//     console.log(salesArray);

//     for (const salesItem of salesArray) {
//       const {
//         productName,
//         quantity,
//         purchaseId,
//         discountPercentage = 0,
//       } = salesItem;

//       if (!purchaseId) {
//         return res
//           .status(400)
//           .json({ message: "purchaseId is required for each sales item" });
//       }

//       const purchase = await Purchase.findById(purchaseId);
//       if (!purchase) {
//         return res
//           .status(404)
//           .json({ message: Purchase with ID '${purchaseId}' not found });
//       }

//       const matchingItem = purchase.items.find(
//         (item) =>
//           item.productName.trim().toLowerCase() ===
//           productName.trim().toLowerCase()
//       );

//       if (!matchingItem) {
//         return res.status(404).json({
//           message: Product '${productName}' not found in Purchase items,
//         });
//       }

//       const qty = Number(quantity) || 0;

//       if (matchingItem.salesQuantity === undefined) {
//         return res.status(400).json({
//           message: salesQuantity not initialized for product '${productName}',
//         });
//       }

//       if (matchingItem.salesQuantity < qty) {
//         return res
//           .status(400)
//           .json({ message: Insufficient stock for product '${productName}' });
//       }

//       const totalBeforeDiscount = qty * matchingItem.sellingPrice;
//       const discountValue = (discountPercentage / 100) * totalBeforeDiscount;
//       const amountAfterDiscount = totalBeforeDiscount - discountValue;

//       matchingItem.salesQuantity -= qty;
//       purchase.markModified("items");
//       await purchase.save();

//       items.push({
//         purchaseId: purchase._id,
//         productName,
//         hsnCode: matchingItem.hsnCode,
//         quantity: qty,
//         rate: matchingItem.sellingPrice,
//         discountPercentage,
//         amount: Number(amountAfterDiscount.toFixed(2)),
//       });

//       subTotal += amountAfterDiscount;
//     }

//     const grandTotal = Number((subTotal + roundOff).toFixed(2));

//     const salesDoc = new Sales({
//       userId,
//       invoiceNumber,
//       invoiceDate,
//       billingDate,
//       dueDate,
//       modeOfPayment,
//       otherRef,
//       GRNoDate,
//       deliveryNote,
//       supplierRef,
//       buyerOrderNo,
//       deliveryNoteDate,
//       despatchedThrough,
//       destination,
//       termsOfDelivery,
//       sellerDetails,
//       buyerDetails,
//       roundOff,
//       subTotal: Number(subTotal.toFixed(2)),
//       grandTotal,
//       items,
//     });

//     const savedSales = await salesDoc.save();
//     res.status(201).json(savedSales);
//   } catch (error) {
//     console.error("Error in createSales:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const createSales = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const {
      userId,
      invoiceDate,
      billingDate,
      dueDate,
      modeOfPayment,
      otherRef,
      GRNoDate,
      deliveryNote,
      supplierRef,
      buyerOrderNo,
      deliveryNoteDate,
      despatchedThrough,
      destination,
      termsOfDelivery,
      sellerDetails,
      buyerDetails,
      roundOff = 0,
      items: salesArray,
    } = data;

    if (!modeOfPayment) {
      return res.status(400).json({ message: "modeOfPayment is required" });
    }

    if (!Array.isArray(salesArray) || salesArray.length === 0) {
      return res.status(400).json({ message: "No sales items provided" });
    }

    if (!["Cash", "Credit"].includes(modeOfPayment)) {
      return res.status(400).json({ message: "Invalid modeOfPayment value" });
    }

    // 🔹 Auto-generate Invoice Number
    const invoiceNumber = await generateInvoiceId();

    const items = [];
    let subTotal = 0;

    for (const salesItem of salesArray) {
      const {
        productName,
        quantity,
        purchaseId,
        discountPercentage = 0,
      } = salesItem;

      if (!purchaseId) {
        return res
          .status(400)
          .json({ message: "purchaseId is required for each sales item" });
      }

      const purchase = await Purchase.findById(purchaseId);
      if (!purchase) {
        return res
          .status(404)
          .json({ message: `Purchase with ID '${purchaseId}' not found` });
      }

      const matchingItem = purchase.items.find(
        (item) =>
          item.productName.trim().toLowerCase() ===
          productName.trim().toLowerCase()
      );

      if (!matchingItem) {
        return res.status(404).json({
          message: `Product '${productName}' not found in Purchase items`,
        });
      }

      const qty = Number(quantity) || 0;

      if (matchingItem.salesQuantity === undefined) {
        return res.status(400).json({
          message: `salesQuantity not initialized for product '${productName}'`,
        });
      }

      if (matchingItem.salesQuantity < qty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product '${productName}' `});
      }

      const totalBeforeDiscount = qty * matchingItem.sellingPrice;
      const discountValue = (discountPercentage / 100) * totalBeforeDiscount;
      const amountAfterDiscount = totalBeforeDiscount - discountValue;

      matchingItem.salesQuantity -= qty;
      purchase.markModified("items");
      await purchase.save();

      items.push({
        purchaseId: purchase._id,
        productName,
        hsnCode: matchingItem.hsnCode,
        quantity: qty,
        rate: matchingItem.sellingPrice,
        discountPercentage,
        amount: Number(amountAfterDiscount.toFixed(2)),
      });

      subTotal += amountAfterDiscount;
    }

    const grandTotal = Number((subTotal + roundOff).toFixed(2));

    const salesDoc = new Sales({
      userId,
      invoiceNumber, // 🔹 Auto-set here
      invoiceDate,
      billingDate,
      dueDate,
      modeOfPayment,
      otherRef,
      GRNoDate,
      deliveryNote,
      supplierRef,
      buyerOrderNo,
      deliveryNoteDate,
      despatchedThrough,
      destination,
      termsOfDelivery,
      sellerDetails,
      buyerDetails,
      roundOff,
      subTotal: Number(subTotal.toFixed(2)),
      grandTotal,
      items,
    });

    const savedSales = await salesDoc.save();
    res.status(201).json(savedSales);
  } catch (error) {
    console.error("Error in createSales:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .populate("userId", "userName email")
      .populate("items.purchaseId", "despatchedThrough") // nested populate
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Server error" });
  }
};