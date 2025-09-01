import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/Customfetch";

const StackManagement = () => {
  const [flattenedItems, setFlattenedItems] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    productName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchAndFlatten();
  }, []);

  const fetchAndFlatten = async () => {
    try {
      const response = await customFetch.get("/purchase");
      const data = response.data;
      console.log(data, "de");

      // Flatten each item's invoice context into individual product rows
      const allItems = data.flatMap((invoice) =>
        invoice.items.map((item) => ({
          ...item,
          invoiceNo: invoice.invoiceNo,
          billingDate: invoice.billingDate,
          deliveryDate: invoice.deliveryDate,
          purchaseId: invoice.purchaseId,
          vehicleNo: invoice.vehicleNo,
          despatchedThrough: invoice.despatchedThrough,
          driverPhoneNo: invoice.driverPhoneNo,
          createdAt: invoice.createdAt,
        }))
      );

      setFlattenedItems(allItems);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch purchase data.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = flattenedItems.filter((item) => {
    const companyMatch = filters.companyName
      ? item.purchaseId?.companyName
          .toLowerCase()
          .includes(filters.companyName.toLowerCase())
      : true;

    const productMatch = filters.productName
      ? item.productName
          .toLowerCase()
          .includes(filters.productName.toLowerCase())
      : true;

    const startDateMatch = filters.startDate
      ? new Date(item.createdAt) >= new Date(filters.startDate)
      : true;

    const endDateMatch = filters.endDate
      ? new Date(item.createdAt) <= new Date(filters.endDate)
      : true;

    return companyMatch && productMatch && startDateMatch && endDateMatch;
  });

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Product Details</h3>

      {/* Filters */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="companyName"
          value={filters.companyName}
          onChange={handleFilterChange}
          placeholder="Filter by Company Name"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="productName"
          value={filters.productName}
          onChange={handleFilterChange}
          placeholder="Filter by Product Name"
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-2 border">S.No</th>
              <th className="px-4 py-2 border">Company Name</th>
              {/* <th className="px-4 py-2 border">Invoice No</th> */}
              <th className="px-4 py-2 border">Product Name</th>
              {/* <th className="px-4 py-2 border">HSN</th> */}
              <th className="px-4 py-2 border">Quantity</th>
              {/* <th className="px-4 py-2 border">Purchase Price</th> */}
              <th className="px-4 py-2 border">Selling Price</th>
              {/* <th className="px-4 py-2 border">Profit</th> */}
              {/* <th className="px-4 py-2 border">GST %</th> */}
              {/* <th className="px-4 py-2 border">GST Amt</th> */}
              {/* <th className="px-4 py-2 border">Total</th> */}
              {/* <th className="px-4 py-2 border">Billing Date</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item._id || index} className="text-center border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">
                  {item.purchaseId?.companyName || "N/A"}
                </td>
                {/* <td className="px-4 py-2 border">{item.invoiceNo}</td> */}
                <td className="px-4 py-2 border">{item.productName}</td>
                {/* <td className="px-4 py-2 border">{item.hsnCode}</td> */}
                <td className="px-4 py-2 border">{item.salesQuantity}</td>
                {/* <td className="px-4 py-2 border">₹{item.purchasePrice}</td> */}
                <td className="px-4 py-2 border">₹{item.sellingPrice}</td>
                {/* <td className="px-4 py-2 border">₹{item.profit}</td> */}
                {/* <td className="px-4 py-2 border">{item.gst}%</td> */}
                {/* <td className="px-4 py-2 border">₹{item.gstAmount}</td> */}
                {/* <td className="px-4 py-2 border">₹{item.totalAmount}</td> */}
                {/* <td className="px-4 py-2 border">{item.billingDate}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StackManagement;
