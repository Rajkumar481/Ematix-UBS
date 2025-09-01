import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toWords } from "number-to-words";

const InvoiceModal = ({ product, buyer, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!product || !buyer) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const sumField = (items, key) =>
    items?.reduce((acc, item) => acc + Number(item[key] || 0), 0);

  const totalGstAmount = sumField(product.items, "gstAmount");
  const totalAmount = sumField(product.items, "totalAmount");
  const totalProfit = sumField(product.items, "profit");
  const total = sumField(product.items, "total");

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50 overflow-auto print:static print:bg-transparent print:overflow-visible"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 mt-60 rounded-lg shadow-xl w-[559px] h-[810px] max-w-full relative text-sm my-10 print:w-full print:h-full print:shadow-none print:rounded-none print:m-0 mt-25">
        <button
          className="absolute top-2 right-4 text-xl font-bold text-red-900 mt-3"
          onClick={onClose}
          aria-label="Close modal"
        >
          x
        </button>

        <h2 className="text-xl font-bold text-center mb-2">Tax Invoice</h2>

        <div className="grid grid-cols-2 gap-4 text-xs border border-black p-4 mb-2 lh-sm">
          <div className="space-y-4">
            <h3 className="font-semibold mb-4">Buyer Details</h3>
            <p>
              <strong>Company Name:</strong> {buyer.companyName}
            </p>
            <p>
              <strong>E-mail:</strong> {buyer.email}
            </p>
            <p>
              <strong>Phone:</strong> {buyer.phone}
            </p>
            <p>
              <strong>Address:</strong> {buyer.address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <p>
              <strong>Dated</strong>
            </p>
            <p>{formatDate(product.billingDate)}</p>
            <p>
              <strong>Buyer's Order No.</strong>
            </p>
            <p>{product.purchaseOrderId}</p>
            <p>
              <strong>Dispatched through</strong>
            </p>
            <p>{product.despatchedThrough}</p>
            <p>
              <strong>Vehicle No.</strong>
            </p>
            <p>{product.vehicleNo}</p>
            <p>
              <strong>Driver Contact</strong>
            </p>
            <p>{product.driverPhoneNo}</p>
          </div>
        </div>

        <table className="w-full border border-black text-xs mb-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1">Sl No</th>
              <th className="border p-1">Description of Goods</th>
              <th className="border p-1">HSN/SAC</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {product.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-1 text-center">{idx + 1}</td>
                <td className="border p-1">{item.productName}</td>
                <td className="border p-1 text-center">{item.hsnCode}</td>
                <td className="border p-1 text-center">{item.quantity}</td>
                <td className="border p-1 text-right">₹{item.purchasePrice}</td>
                <td className="border p-1 text-right">₹{item.total}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" className="border p-1 text-right font-semibold">
                GST
              </td>
              <td className="border p-1 text-right">₹{totalGstAmount}</td>
            </tr>
            <tr>
              <td colSpan="5" className="border p-1 text-right font-bold">
                Total
              </td>
              <td className="border p-1 text-right font-bold">
                ₹{totalAmount}
              </td>
            </tr>
            <tr>
              <td colSpan="5" className="border p-1 text-right font-bold">
                Profit
              </td>
              <td className="border p-1 text-right font-bold">
                ₹{totalProfit}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-xs border border-black mb-2">
          <table className="w-full text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1">Taxable Value</th>
                <th className="border p-1">Tax (Rate)</th>
                <th className="border p-1">Tax (Amt)</th>
                <th className="border p-1">Total Tax</th>
                <th className="border p-1">Total Amount</th>
                <th className="border p-1">Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1">₹{total}</td>
                <td className="border p-1">{product.items[0]?.gst}%</td>
                <td className="border p-1">₹{totalGstAmount}</td>
                <td className="border p-1">₹{totalGstAmount * 2}</td>
                <td className="border p-1">₹{totalAmount}</td>
                <td className="border p-1">₹{totalProfit}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-xs mb-4">
          <p>
            <strong>Tax Amount (in words):</strong> Indian Rupee{" "}
            {toWords(Math.round(totalGstAmount * 2)).toUpperCase()} Only
          </p>
          <p>
            <strong>Amount Chargeable (in words):</strong> Indian Rupee{" "}
            {toWords(Math.round(totalAmount)).toUpperCase()} Only
          </p>
        </div>

        <div className="border-t pt-2 text-xs text-gray-700 italic">
          <p>
            We declare that this invoice shows the actual price of the goods
            described and that all particulars are true and correct.
          </p>
        </div>

        <p className="text-right text-xs">Authorised Signatory</p>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 text-sm"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
