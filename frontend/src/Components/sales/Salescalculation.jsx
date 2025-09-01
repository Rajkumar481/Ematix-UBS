import React, { useEffect, useState } from "react";
import customFetch from "../../utils/Customfetch";

const SalesCalculation = ({ products, setProducts }) => {
  console.log(products);
  const [productList, setProductList] = useState([]);

  // Fetch product list from /purchase including purchaseId
  useEffect(() => {
    customFetch
      .get("/purchase")
      .then((res) => {
        // Flatten all items from all purchases, include purchaseId
        const allItems = res.data.flatMap((purchase) =>
          (purchase.items || []).map((item) => ({
            purchaseId: purchase._id, // <-- Add purchaseId here
            productName: item.productName || item.name || item.itemName || "",
            hsnCode: item.hsnCode || "",
            rate: item.sellingPrice || 0,
          }))
        );
        setProductList(allItems);
      })
      .catch(() => console.error("Failed to load products"));
  }, []);

  console.log(productList);

  // Add product row
  const addProductRow = () => {
    setProducts((prev) => [
      ...prev,
      {
        productName: "",
        hsnCode: "",
        quantity: 1,
        rate: 0,
        discountPercentage: 0,
        amount: 0,
        purchaseId: "", // add purchaseId field
      },
    ]);
  };

  // Handle product field changes
  const handleProductChange = (index, field, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      // If product name changes, auto-fill rate, hsnCode & purchaseId
      if (field === "productName") {
        const selected = productList.find(
          (p) =>
            p.productName.toLowerCase().trim() === value.toLowerCase().trim()
        );

        if (selected) {
          updated[index].hsnCode = selected.hsnCode || "";
          updated[index].sellingPrice = selected.sellingPrice || 0;
          updated[index].purchaseId = selected.purchaseId || "";
        } else {
          updated[index].hsnCode = "";
          updated[index].sellingPrice = 0;
          updated[index].purchaseId = "";
        }
      }

      // Recalculate amount
      const qty = parseFloat(updated[index].quantity) || 0;
      const rate = parseFloat(updated[index].sellingPrice) || 0;
      const discount = parseFloat(updated[index].discountPercentage) || 0;
      updated[index].amount = qty * rate * (1 - discount / 100);

      return updated;
    });
  };

  // Remove product row
  const removeProductRow = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // Add one empty product row on mount if products is empty
  // useEffect(() => {
  //   if (products.length === 0) addProductRow();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div>
      <h3 className="font-bold mb-2">Products</h3>

      {products.map((prod, idx) => (
        <div key={idx} className="grid grid-cols-7 gap-2 mb-2">
          {/* Product Name */}
          <input
            list={`productList-${idx}`}
            placeholder="Product Name"
            value={prod.productName}
            onChange={(e) => {
              const name = e.target.value;
              handleProductChange(idx, "productName", name);

              // Find the selected product in productList
              const selected = productList.find(
                (p) => p.productName.toLowerCase() === name.toLowerCase()
              );

              if (selected) {
                handleProductChange(idx, "hsnCode", selected.hsnCode || "");
                handleProductChange(idx, "rate", selected.rate || 0);
                handleProductChange(idx, "sellingPrice", selected.rate || 0);
                handleProductChange(
                  idx,
                  "purchaseId",
                  selected.purchaseId || ""
                );
              }
            }}
            className="border rounded p-2"
          />
          <datalist id={`productList-${idx}`}>
            {productList.map((p, i) => (
              <option key={i} value={p.productName} />
            ))}
          </datalist>

          {/* HSN Code */}
          <input
            placeholder="HSN Code"
            value={prod.hsnCode}
            onChange={(e) =>
              handleProductChange(idx, "hsnCode", e.target.value)
            }
            className="border rounded p-2"
          />

          {/* Quantity */}
          <input
            type="number"
            placeholder="Qty"
            value={prod.quantity}
            onChange={(e) =>
              handleProductChange(idx, "quantity", e.target.value)
            }
            className="border rounded p-2"
          />

          {/* Rate */}
          <input
            type="number"
            placeholder="Rate"
            value={prod.sellingPrice}
            onChange={(e) =>
              handleProductChange(idx, "sellingPrice", e.target.value)
            }
            className="border rounded p-2"
          />

          {/* Discount */}
          <input
            type="number"
            placeholder="Discount %"
            value={prod.discountPercentage}
            onChange={(e) =>
              handleProductChange(idx, "discountPercentage", e.target.value)
            }
            className="border rounded p-2"
          />

          {/* Amount (Read-only) */}
          <input
            type="number"
            value={prod.amount.toFixed(2)}
            readOnly
            className="border rounded p-2 bg-gray-100"
          />

          {/* Remove button */}
          <button
            type="button"
            onClick={() => removeProductRow(idx)}
            className="bg-red-500 text-white px-2 rounded"
          >
            X
          </button>
        </div>
      ))}

      {/* Add Product Button */}
      <button
        type="button"
        onClick={addProductRow}
        className=" text-white px-4 py-2 rounded"
        style={{
          background:
            "linear-gradient(to bottom right, #f472b6, #f43f5e, #f87171)",
        }}
      >
        + Add Product
      </button>
    </div>
  );
};

export default SalesCalculation;
