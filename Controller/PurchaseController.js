import CompanySchema from "../Schemas/CompanySchema.js";
import Purchase from "../Schemas/PurchaseSchema.js";

export const createPurchase = async (req, res) => {
  try {
    const company = await CompanySchema.findById(req.body.purchaseId);

    if (!company) {
      return res
        .status(400)
        .json({ error: "Company not found with the given ID" });
    }

    req.body.items = (req.body.items || []).map((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const purchasePrice = parseFloat(item.purchasePrice) || 0;
      const sellingPrice = parseFloat(item.sellingPrice) || 0;
      const gst = parseFloat(item.gst) || 0;

      const total = quantity * purchasePrice;
      const gstAmount = (total * gst) / 100;
      const totalAmount = total + gstAmount;
      const profit = (sellingPrice - purchasePrice) * quantity;

      return {
        ...item,
        total: parseFloat(total.toFixed(2)),
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
      };
    });

    const saved = await Purchase.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("purchaseId");
    res.status(200).json(purchases);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch purchases", error: err.message });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate({
      path: "purchaseId",
      select: "companyName email phone address",
    });
    if (!purchase) return res.status(404).json({ error: "Purchase not found" });
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    if (req.body.items && Array.isArray(req.body.items)) {
      req.body.items = req.body.items.map((item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const purchasePrice = parseFloat(item.purchasePrice) || 0;
        const sellingPrice = parseFloat(item.sellingPrice) || 0;
        const gst = parseFloat(item.gst) || 0;

        const total = quantity * purchasePrice;
        const gstAmount = (total * gst) / 100;
        const totalAmount = total + gstAmount;
        const profit = (sellingPrice - purchasePrice) * quantity;

        return {
          ...item,
          total: parseFloat(total.toFixed(2)),
          gstAmount: parseFloat(gstAmount.toFixed(2)),
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          profit: parseFloat(profit.toFixed(2)),
        };
      });
    }

    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Purchase not found");
    res.send("Purchase deleted");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
