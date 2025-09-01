import React, { useState, useEffect } from "react";
import customFetch from "../../utils/Customfetch";

const StockPage = () => {
  const [filters, setFilters] = useState({
    productName: "",
    userName: "",
    startDate: "",
    endDate: "",
    modeOfPayment: "",
    quantity: "",
  });

  const [salesData, setSalesData] = useState([]);
  const [filteredStock, setFilteredStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const response = await customFetch.get("/sales");
      setSalesData(response.data);
      setFilteredStock(response.data);
      console.log("Fetched sales:", response.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, salesData]);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const applyFilters = () => {
    let filtered = [...salesData];

    if (filters.productName) {
      filtered = filtered.filter((item) =>
        item.items.some((i) =>
          i.productName
            .toLowerCase()
            .includes(filters.productName.toLowerCase())
        )
      );
    }

    if (filters.userName) {
      filtered = filtered.filter((item) =>
        item.userId?.userName
          ?.toLowerCase()
          .includes(filters.userName.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (item) => new Date(item.billingDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (item) => new Date(item.billingDate) <= new Date(filters.endDate)
      );
    }

    if (filters.modeOfPayment) {
      filtered = filtered.filter(
        (item) => item.modeOfPayment === filters.modeOfPayment
      );
    }

    if (filters.quantity) {
      filtered = filtered.filter((item) => {
        const totalQty = item.items.reduce(
          (sum, i) => sum + Number(i.quantity || 0),
          0
        );
        return totalQty === Number(filters.quantity);
      });
    }

    setFilteredStock(filtered);
  };

  const grandTotal = filteredStock.reduce(
    (sum, item) => sum + (Number(item.grandTotal) || 0),
    0
  );

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-lg font-medium">Loading sales data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <h1 className="text-3xl font-bold mb-6">Stock Sales Overview</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            name="productName"
            value={filters.productName}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="User Name"
            name="userName"
            value={filters.userName}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <select
            name="modeOfPayment"
            value={filters.modeOfPayment}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="">All Modes</option>
            <option value="Credit">Credit</option>
            <option value="Cash">Cash</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            name="quantity"
            value={filters.quantity}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Products</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Billing Date</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Mode</th>
              <th className="py-2 px-4 text-left"> Amount</th>
            </tr>
          </thead>
          <tbody className="">
            {filteredStock.length > 0 ? (
              filteredStock.map((item) => (
                <tr
                  key={item._id}
                  className="border-b  last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{item.orderId}</td>
                  <td className="py-2 px-4">
                    {item.items?.map((i) => i.productName).join(", ") || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {item.userId?.userName || "N/A"}
                  </td>
                  <td className="py-2 px-4">{formatDate(item.billingDate)}</td>
                  <td className="py-2 px-4">
                    {item.items?.reduce(
                      (sum, i) => sum + Number(i.quantity || 0),
                      0
                    )}
                  </td>
                  <td className="py-2 px-4">{item.modeOfPayment}</td>
                  <td className="py-2 px-4">{item.grandTotal}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right">
        <p className="text-lg text-green-600 font-semibold">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default StockPage;
