// src/components/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/Customfetch";

const getToday = () => new Date().toISOString().substring(0, 10);

const AddProduct = ({ setActiveComponent }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [buyers, setBuyers] = useState([]);
  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    purchaseId: "",
  });

  const [formDetails, setFormDetails] = useState({
    invoiceNo: "",
    billingDate: getToday(),
    deliveryDate: "",
    vehicleNo: "",
    driverPhoneNo: "",
    purchaseOrderId: "",
  });

  const [productRows, setProductRows] = useState([
    {
      productName: "",
      hsnCode: "",
      quantity: "",
      purchasePrice: "",
      sellingPrice: "",
      gst: "",
    },
  ]);

  useEffect(() => {
    customFetch
      .get("/company")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error("Failed to fetch buyers", err));
  }, []);

  useEffect(() => {
    if (!id || buyers.length === 0) return;

    customFetch
      .get(`/purchase/${id}`)
      .then((res) => {
        const data = res.data;
        const company = buyers.find((b) => b._id === data.purchaseId);

        setCompanyData({
          companyName: company?.companyName || "",
          email: company?.email || "",
          phone: company?.phone || "",
          address: company?.address || "",
          purchaseId: data.purchaseId || "",
        });

        setFormDetails({
          invoiceNo: data.invoiceNo || "",
          billingDate: getToday(), // Force today's date
          deliveryDate: data.deliveryDate?.substring(0, 10) || "",
          vehicleNo: data.vehicleNo || "",
          driverPhoneNo: data.driverPhoneNo || "",
          purchaseOrderId: data.purchaseOrderId || "",
        });

        setProductRows(
          data.items?.length
            ? data.items.map((item) => ({
                productName: item.productName,
                hsnCode: item.hsnCode,
                quantity: item.quantity,
                purchasePrice: item.purchasePrice,
                sellingPrice: item.sellingPrice,
                gst: item.gst,
              }))
            : [
                {
                  productName: "",
                  hsnCode: "",
                  quantity: "",
                  purchasePrice: "",
                  sellingPrice: "",
                  gst: "",
                },
              ]
        );
      })
      .catch((err) => console.error("Failed to fetch product", err));
  }, [id, buyers]);

  const handleCompanyChange = (e) => {
    const name = e.target.value;
    setCompanyData((prev) => ({ ...prev, companyName: name }));

    const matched = buyers.find(
      (b) => b.companyName.toLowerCase() === name.toLowerCase()
    );
    if (matched) {
      setCompanyData((prev) => ({
        ...prev,
        companyName: matched.companyName,
        email: matched.email,
        phone: matched.phone,
        address: matched.address,
        purchaseId: matched._id,
      }));
    } else {
      setCompanyData((prev) => ({
        ...prev,
        email: "",
        phone: "",
        address: "",
        purchaseId: "",
      }));
    }
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...productRows];
    updatedRows[index][name] = value;
    setProductRows(updatedRows);
  };

  const addRow = () => {
    const lastRow = productRows[productRows.length - 1];
    const allFilled = Object.values(lastRow).every(
      (val) => val.toString().trim() !== ""
    );

    if (!allFilled) {
      alert("Please fill all fields before adding a new row.");
      return;
    }

    setProductRows([
      ...productRows,
      {
        productName: "",
        hsnCode: "",
        quantity: "",
        purchasePrice: "",
        sellingPrice: "",
        gst: "",
      },
    ]);
  };

  const calculate = (row) => {
    const qty = parseFloat(row.quantity) || 0;
    const pp = parseFloat(row.purchasePrice) || 0;
    const sp = parseFloat(row.sellingPrice) || 0;
    const gst = parseFloat(row.gst) || 0;

    const total = qty * pp;
    const gstAmount = (total * gst) / 100;
    const totalAmount = total + gstAmount;
    const profit = (sp - pp) * qty;

    return { total, gstAmount, totalAmount, profit };
  };

  const handleSubmit = async () => {
    try {
      const items = productRows.map((product) => {
        const { gstAmount, total, totalAmount, profit } = calculate(product);
        return {
          productName: product.productName,
          hsnCode: product.hsnCode,
          quantity: parseFloat(product.quantity),
          purchasePrice: parseFloat(product.purchasePrice),
          sellingPrice: parseFloat(product.sellingPrice),
          gst: parseFloat(product.gst),
          gstAmount,
          total,
          totalAmount,
          profit,
        };
      });

      const payload = {
        purchaseId: companyData.purchaseId,
        invoiceNo: formDetails.invoiceNo,
        billingDate: getToday(),
        deliveryDate: formDetails.deliveryDate,
        despatchedThrough: "lorry",
        vehicleNo: formDetails.vehicleNo,
        driverPhoneNo: formDetails.driverPhoneNo,
        purchaseOrderId: formDetails.purchaseOrderId,
        items,
      };

      console.log("Sending full payload:", payload);

      if (id) {
        await customFetch.patch(`/purchase/${id}`, payload);
      } else {
        await customFetch.post("/purchase", payload);
      }

      alert(
        id
          ? "Product updated successfully!"
          : "Products submitted successfully!"
      );
      if (setActiveComponent) setActiveComponent("product");
      navigate("/");
    } catch (error) {
      console.error("Error submitting products:", error);
      toast.error("Failed to submit products");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-5">
          {/* Company fields */}
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              required
              type="text"
              value={
                companyData.companyName || companyData.purchaseId.companyName
              }
              onChange={handleCompanyChange}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Enter or select company name"
              list="company-list"
            />
            <datalist id="company-list">
              {buyers.map((b) => (
                <option key={b._id} value={b.companyName} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              required
              type="email"
              value={companyData.email || companyData.purchaseId.email}
              onChange={(e) =>
                setCompanyData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              required
              type="tel"
              value={companyData.phone || companyData.purchaseId.phone}
              onChange={(e) =>
                setCompanyData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              required
              value={companyData.address || companyData.purchaseId.address}
              onChange={(e) =>
                setCompanyData((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Invoice No</label>
            <input
              required
              className="w-full px-2 py-1 border rounded text-sm"
              value={formDetails.invoiceNo}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  invoiceNo: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Billing Date</label>
            <input
              type="date"
              className="w-full px-2 py-1 border rounded text-sm cursor-not-allowed"
              value={getToday()}
              disabled
            />
          </div>

          {["Delivery Date", "Vehicle No", "Driver No", "Purchase ID"].map(
            (label, i) => {
              const fieldMap = {
                "Delivery Date": "deliveryDate",
                "Vehicle No": "vehicleNo",
                "Driver No": "driverPhoneNo",
                "Purchase ID": "purchaseOrderId",
              };
              const field = fieldMap[label];
              return (
                <div key={i}>
                  <label className="block text-sm font-medium">{label}</label>
                  <input
                    required
                    type={label.includes("Date") ? "date" : "text"}
                    className="w-full px-2 py-1 border rounded text-sm"
                    value={formDetails[field]}
                    onChange={(e) =>
                      setFormDetails((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      </form>

      {/* Table of Products */}
      <table className="w-full border-collapse mt-6 text-sm table-fixed">
        <thead>
          <tr className="bg-gray-100">
            {[
              "S.No",
              "Product Name",
              "HSN",
              "Quantity",
              "Purchase Price",
              "Selling Price",
              "GST (%)",
              "GST Amount",
              "Total",
              "Total Amount",
              "Profit",
            ].map((h, i) => (
              <th key={i} className="border px-2 py-1">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productRows.map((row, index) => {
            const { gstAmount, total, totalAmount, profit } = calculate(row);
            return (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                {[
                  "productName",
                  "hsnCode",
                  "quantity",
                  "purchasePrice",
                  "sellingPrice",
                  "gst",
                ].map((field, i) => (
                  <td key={i} className="border px-2 py-1">
                    <input
                      required
                      name={field}
                      value={row[field]}
                      onChange={(e) => handleRowChange(index, e)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          index === productRows.length - 1
                        ) {
                          addRow();
                        }
                      }}
                      className="w-full px-1 py-0.5"
                    />
                  </td>
                ))}
                <td className="border px-2 py-1 text-center">{gstAmount}</td>
                <td className="border px-2 py-1 text-center">{total}</td>
                <td className="border px-2 py-1 text-center">{totalAmount}</td>
                <td className="border px-2 py-1 text-center">{profit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end mt-12 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
