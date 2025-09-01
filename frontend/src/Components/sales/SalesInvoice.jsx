import React from "react";
import img from "../../Assets/logo.png";

export default function InvoicePage({ sale }) {
  if (!sale) return <div className="text-center py-10">Loading invoice...</div>;

  // Totals calculation
  const taxableValue =
    sale.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
  const totalGST =
    sale.items?.reduce((sum, item) => sum + (Number(item.gstAmount) || 0), 0) ||
    0;
  const grandTotal = sale.grandTotal || taxableValue + totalGST;

  return (
    <div className="relative w-[900px] mx-auto">
      {/* Invoice Template Image */}
      <img
        src={img}
        style={{ height: "500px" }}
        alt="Invoice Template"
        className="w-full"
      />

      {/* Overlayed Data */}
      <div className="absolute top-0 left-0 w-full h-full p-8 text-sm">
        {/* Invoice Info */}
        <div style={{ position: "absolute", top: 130, left: 600 }}>
          <p>{sale.orderId}</p>
          <p style={{ marginTop: 10 }}>{sale.billingDate}</p>
          <p style={{ marginTop: 10 }}>{sale.modeOfPayment}</p>
        </div>

        {/* Buyer Details */}
        <div style={{ position: "absolute", top: 240, left: 120 }}>
          <p>
            <strong>{sale.userId?.userName}</strong>
          </p>
          <p>{sale.userId?.email}</p>
          <p>{sale.userId?.phone}</p>
          <p>{sale.userId?.address}</p>
        </div>

        {/* Items */}
        {sale.items?.map((item, idx) => {
          const rowTop = 390 + idx * 30;
          return (
            <React.Fragment key={idx}>
              <p style={{ position: "absolute", top: rowTop, left: 60 }}>
                {idx + 1}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 100 }}>
                {item.productName}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 320 }}>
                {item.purchaseId?.hsnCode || "N/A"}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 420 }}>
                {item.quantity}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 520 }}>
                ₹{(item.total / item.quantity).toFixed(2)}
              </p>
              <p style={{ position: "absolute", top: rowTop, left: 650 }}>
                ₹{item.total.toFixed(2)}
              </p>
            </React.Fragment>
          );
        })}

        {/* Totals */}
        <div style={{ position: "absolute", top: 520, left: 650 }}>
          <p>₹{taxableValue.toFixed(2)}</p>
          <p style={{ marginTop: 20 }}>₹{totalGST.toFixed(2)}</p>
          <p style={{ marginTop: 40, fontWeight: "bold" }}>
            ₹{grandTotal.toFixed(2)}
          </p>
        </div>

        {/* Amount in words */}
        <p
          style={{
            position: "absolute",
            top: 620,
            left: 60,
            fontSize: "10px",
            fontStyle: "italic",
          }}
        >
          Amount Chargeable (in words): Rupees {grandTotal} Only
        </p>

        {/* Footer - Bank Details */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            fontSize: "10px",
          }}
        >
          <p>
            <strong>Bank:</strong> IDFC FIRST BANK
          </p>
          <p>A/C No: 10211547596</p>
          <p>Branch & IFSC: Salem - IDFB0080591</p>
        </div>
      </div>
    </div>
  );
}
