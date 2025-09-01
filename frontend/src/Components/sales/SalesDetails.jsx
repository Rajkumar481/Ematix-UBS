import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import img from "../../assets/images/INVOICE.jpg";
import customFetch from "../../utils/Customfetch";

export default function SalesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: saleData } = await customFetch.get(`/sales/${id}`);
        setSale(saleData);
        setLoading(false);
      } catch (error) {
        setError("Failed to load sales details.");
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!sale) return <div className="text-center py-12">No sale found.</div>;

  // ✅ Calculations
  const taxableValue =
    sale.items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  const totalQuantity =
    sale.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const totalRate =
    sale.items?.reduce(
      (sum, item) => sum + (item.rate*item.quantity || item.purchaseId?.sellingPrice || 0),
      0
    ) || 0;

  const totalDiscount = taxableValue - totalRate;

  const totalGST = sale.gstAmount || 0;
  const grandTotal = taxableValue + totalGST + (sale.roundOff || 0);

  return (
    <div className="relative w-[900px] mx-auto mb-5">
      {/* ✅ Invoice Background */}
      <img src={img} alt="Invoice Template" className="w-full" />

      {/* ✅ Overlay Data */}
      <div className="absolute top-0 left-0 w-full h-full p-8 text-sm">
        {/* ✅ Invoice Info */}
        <p style={{ position: "absolute", top: 78, left: 465, fontWeight: "bold" }}>
          {sale.invoiceNumber || "N/A"}
        </p>
        <p style={{ position: "absolute", top: 78, left: 680, fontWeight: "bold" }}>
          {formatDate(sale.invoiceDate) || "N/A"}
        </p>
        <p style={{ position: "absolute", top: 122, left: 620, fontWeight: "bold" }}>
          {sale.modeOfPayment || "N/A"}
        </p>

        {/* ✅ Extra Invoice Meta Info */}
        <p style={{ position: "absolute", top: 165, left: 465, fontWeight: "bold" }}>
          {sale.buyerOrderNo || "N/A"}
        </p>

        {/* <p style={{ position: "absolute", top: 160, left: 120 }}>
          Supplier Ref: {sale.supplierRef || "N/A"}
        </p>
        <p style={{ position: "absolute", top: 180, left: 120 }}>
          Other Ref: {sale.otherRef || "N/A"}
        </p> */}

        {/* <p style={{ position: "absolute", top: 200, left: 800 }}>
          Delivery Note: {sale.deliveryNote || "N/A"}
        </p> */}

        <p style={{ position: "absolute", top: 205, left: 680, fontWeight: "bold" }}>
          {formatDate(sale.deliveryNoteDate) || "N/A"}
        </p>

        {/* <p style={{ position: "absolute", top: 240, left: 400 }}>
          GR/No Date: {sale.GRNoDate || "N/A"}
        </p> */}

        <p style={{ position: "absolute", top: 162, left: 680, fontWeight: "bold" }}>
          {formatDate(sale.billingDate) || "N/A"}
        </p>

        {/* <p style={{ position: "absolute", top: 280, left: 400 }}>
          Due Date: {sale.dueDate || "N/A"}
        </p> */}

        <p style={{ position: "absolute", top: 245, left: 510, fontWeight: "bold" }}>
          {sale.despatchedThrough || "N/A"}
        </p>
        <p style={{ position: "absolute", top: 245, left: 680, fontWeight: "bold" }}>
          {sale.destination || "N/A"}
        </p>
        <p style={{ position: "absolute", top: 340, left: 600, fontWeight: "bold" }}>
          {sale.termsOfDelivery || "N/A"}
        </p>

        {/* ✅ Buyer Details */}
        <p style={{ position: "absolute", top: 330, left: 190, fontWeight: "bold" }}>
          Name: {sale.buyerDetails?.name || "N/A"}
        </p>
        <p style={{ position: "absolute", top: 350, left: 190, fontWeight: "bold" }}>
          Address: {sale.buyerDetails?.address}
        </p>
        <p style={{ position: "absolute", top: 370, left: 190, fontWeight: "bold" }}>
          State: {sale.buyerDetails?.state}
        </p>
        <p style={{ position: "absolute", top: 390, left: 190, fontWeight: "bold" }}>
          Email: {sale.buyerDetails?.email}
        </p>
        <p style={{ position: "absolute", top: 410, left: 190, fontWeight: "bold" }}>
          Phone: {sale.buyerDetails?.phone}
        </p>

        {/* <p style={{ position: "absolute", top: 380, left: 620, fontWeight: "bold" }}>
          {sale.sellerDetails?.name || "Seller N/A"}
        </p>
        <p style={{ position: "absolute", top: 400, left: 620 }}>
          {sale.sellerDetails?.address || ""}
        </p> */}

        {/* ✅ Items List */}
        {sale.items?.map((item, idx) => {
          const rowTop = 500 + idx * 30;
          return (
            <React.Fragment key={idx}>
              <p style={{ position: "absolute", top: rowTop, left: 95, fontWeight: "bold" }}>
                {idx + 1}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 140, fontWeight: "bold" }}>
                {item.productName || "N/A"}
              </p>
              {/* <p style={{ position: "absolute", top: rowTop, left: 320 }}>
                {item.hsnCode || item.purchaseId?.hsnCode || "N/A"}
              </p> */}
              <p style={{ position: "absolute", top: rowTop, left: 483, fontWeight: "bold" }}>
                {item.quantity || 0}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 540, fontWeight: "bold" }}>
                ₹{(item.rate || item.purchaseId?.sellingPrice || 0).toFixed(2)}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 677, fontWeight: "bold" }}>
                {item.discountPercentage || 0}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 740, fontWeight: "bold" }}>
                ₹{(item.amount || 0).toFixed(2)}
              </p>
            </React.Fragment>
          );
        })}

        {/* ✅ Totals Row (aligned with columns) */}
        <p style={{ position: "absolute", top: 760, left: 483, fontWeight: "bold" }}>
          {totalQuantity}
        </p>
        <p style={{ position: "absolute", top: 760, left: 540, fontWeight: "bold" }}>
          ₹{totalRate.toFixed(2)}
        </p>
        <p style={{ position: "absolute", top: 760, left: 660, fontWeight: "bold" }}>
          ₹{(totalDiscount.toFixed(2)*-1)}
        </p>
        <p style={{ position: "absolute", top: 760, left: 740, fontWeight: "bold" }}>
          ₹{taxableValue.toFixed(2)}
        </p>

        {/* <p style={{ position: "absolute", top: 670, left: 650 }}>
          ₹{totalGST.toFixed(2)}
        </p>
        <p style={{ position: "absolute", top: 690, left: 650 }}>
          ₹{(sale.roundOff || 0).toFixed(2)}
        </p> */}

        {/* ✅ Grand Total */}
        <p style={{ position: "absolute", top: 905, left: 710, fontWeight: "bold" }}>
          ₹{grandTotal.toFixed(2)}
        </p>

        {/* ✅ Amount in Words */}
        <p
          style={{
            position: "absolute",
            top: 790,
            left: 350,
            fontSize: "18px",
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          {numberToWords(grandTotal)} Only
        </p>

        {/* <p style={{ position: "absolute", bottom: 100, left: 60, fontSize: "10px" }}>
          Prepared By: {sale.userId?.userName || "N/A"} ({sale.userId?.email})
        </p>
        <p style={{ position: "absolute", bottom: 60, left: 60, fontSize: "10px" }}>
          Authorized Signatory
        </p> */}

        {/* ✅ Buttons */}
        <div
          className="flex justify-end mt-8 gap-4 no-print"
          style={{ position: "absolute", bottom: -30, right: 320, fontWeight: "bold" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 no-print"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 no-print"
          >
            Print Invoice
          </button>
        </div>
      </div>

      {/* ✅ Print Styles */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            @page {
              margin: 0;
            }
            body {
              margin: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

function numberToWords(amount) {
  if (isNaN(amount) || amount <= 0) return "Zero";
  const words = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"];

  const numToWords = (n) => {
    if (n < 20) return words[n];
    if (n < 100) return `${tens[Math.floor(n / 10)]} ${words[n % 10]}`.trim();
    if (n < 1000) return `${words[Math.floor(n / 100)]} Hundred ${numToWords(n % 100)}`.trim();
    if (n < 100000) return `${numToWords(Math.floor(n / 1000))} Thousand ${numToWords(n % 1000)}`.trim();
    return n.toString();
  };

  return numToWords(Math.round(amount));
}

// ✅ Helper: Format Date to DD-MM-YYYY
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; // fallback if invalid
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
