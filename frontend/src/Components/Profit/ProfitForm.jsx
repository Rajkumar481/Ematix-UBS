import React, { useEffect, useState } from "react";
import customFetch from "../../utils/Customfetch";

const ProfitForm = () => {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    today: new Date().toISOString().split("T")[0],
    startDate: "",
    endDate: "",
    companySearch: "",
  });

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      const res = await customFetch.get("/sales");
      const data = res.data;

      const flattened = data.flatMap((entry) =>
        entry.items.map((item) => ({
          id: item._id,
          companyName: entry.userId?.userName || "N/A",
          quantity: item.quantity,
          profit: item.profit,
          billingDate: entry.billingDate,
        }))
      );

      setRows(flattened);
    } catch (err) {
      console.error("Error fetching profit data:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRows = rows.filter((row) => {
    const matchesCompany = row.companyName
      .toLowerCase()
      .includes(filters.companySearch.toLowerCase());

    const date = new Date(row.billingDate);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    const matchesDate = (!start || date >= start) && (!end || date <= end);

    return matchesCompany && matchesDate;
  });

  const grandTotalProfit = filteredRows.reduce(
    (sum, row) => sum + parseFloat(row.profit || 0),
    0
  );

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Profit Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Today</label>
          <input
            type="date"
            name="today"
            value={filters.today}
            onChange={handleFilterChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="companySearch"
            value={filters.companySearch}
            onChange={handleFilterChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Search Company"
          />
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">S.No</th>
            <th className="border px-4 py-2">Company Name</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Profit</th>
            <th className="border px-4 py-2">Billing Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, idx) => (
            <tr key={row.id}>
              <td className="border px-4 py-2">{idx + 1}</td>
              <td className="border px-4 py-2">{row.companyName}</td>
              <td className="border px-4 py-2">{row.quantity}</td>
              <td className="border px-4 py-2">{row.profit}</td>
              <td className="border px-4 py-2">{row.billingDate}</td>
            </tr>
          ))}
          {filteredRows.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Grand Total section below table */}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-lg font-semibold">
            Grand Total Profit:{" "}
            <span className="text-green-600">
              ₹{grandTotalProfit.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitForm;
