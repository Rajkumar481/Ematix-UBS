import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditSaleModal from "./EditSales";
import customFetch from "../../utils/Customfetch";

export default function SalesList() {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  const [searchProduct, setSearchProduct] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch all sales on mount
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get("/sales");
      setSalesData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      alert("Failed to fetch sales data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Apply filters on salesData or filter inputs change
  useEffect(() => {
    const filtered = salesData.filter((item) => {
      const { items, userId, createdAt } = item;

      // Filter by product name in any item
      const productMatch = searchProduct
        ? items?.some((it) =>
            it.productName?.toLowerCase().includes(searchProduct.toLowerCase())
          )
        : true;

      // Filter by user company/name
      const companyMatch = searchCompany
        ? userId?.userName?.toLowerCase().includes(searchCompany.toLowerCase())
        : true;

      // Filter by date range on createdAt
      const createdDate = new Date(createdAt).toISOString().split("T")[0];
      const afterStart = startDate ? createdDate >= startDate : true;
      const beforeEnd = endDate ? createdDate <= endDate : true;

      return productMatch && companyMatch && afterStart && beforeEnd;
    });

    setFilteredData(filtered);
  }, [searchProduct, searchCompany, startDate, endDate, salesData]);

  // Open modal and enrich sale items for editing
  const handleEdit = async (id) => {
    const sale = salesData.find((item) => item._id === id);
    if (!sale) return;

    try {
      const enrichedItems = await Promise.all(
        sale.items.map(async (item) => {
          if (!item.purchaseId?._id) return item;
          const res = await customFetch.get(
            `/purchase/${item.purchaseId._id}`
          );
          return { ...item, purchaseId: res.data };
        })
      );
      setEditingSale({ ...sale, items: enrichedItems });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching purchase detail", err);
      alert("Failed to fetch purchase details for editing.");
    }
  };

  // Save edited sale and update UI
  const handleModalSave = async (updatedSale) => {
    try {
      const {
        _id,
        billingDate,
        deliveryDate,
        dueDate,
        modeOfPayment,
        orderId,
        items,
        userId,
      } = updatedSale;

      const payload = {
        billingDate,
        deliveryDate,
        dueDate,
        modeOfPayment,
        orderId,
        items,
        userId: userId?._id || userId,
      };

      const response = await customFetch.patch(
        `/sales/${_id}`,
        payload
      );

      setSalesData((prev) =>
        prev.map((sale) => (sale._id === _id ? response.data : sale))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating sale", error);
      alert("Failed to update sale.");
    }
  };

  // Delete sale and update UI
  const handleDelete = async (id) => {
    try {
      await customFetch.delete(`/sales/${id}`);
      setSalesData((prev) => prev.filter((sale) => sale._id !== id));
    } catch (error) {
      console.error("Error deleting sale", error);
      alert("Failed to delete sale.");
    }
  };

  const grandTotal = filteredData.reduce(
    (sum, item) => sum + Number(item.grandTotal || 0),
    0
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sales List</h1>

      <div className="bg-white shadow p-4 rounded grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label>Product</label>
          <input
            type="text"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded p-1"
            placeholder="Search by product"
          />
        </div>
        <div>
          <label>Company</label>
          <input
            type="text"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded p-1"
            placeholder="Search by company"
          />
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded p-1"
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded p-1"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">S.No</th>
              <th className="p-2">Products</th>
              <th className="p-2">Company</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
            {filteredData.map((item, idx) => {
              const quantity = item.items?.reduce(
                (sum, i) => sum + i.quantity,
                0
              );
              return (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/sales/${item._id}`)}
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">
                    {item.items?.map((i) => i.productName).join(", ")}
                  </td>
                  <td className="p-2">{item.userId?.userName || "N/A"}</td>
                  <td className="p-2">{quantity || 0}</td>
                  <td className="p-2 text-center">
                    <button
                      className="mr-2 text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item._id);
                      }}
                      title="Edit Sale"
                    >
                      ✏
                    </button>
                    <button
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "Are you sure you want to delete this sale?"
                          )
                        ) {
                          handleDelete(item._id);
                        }
                      }}
                      title="Delete Sale"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan="4" className="text-right p-2">
                  Grand Total
                </td>
                <td className="text-green-600 p-2">₹{grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {loading && <div className="text-center mt-6">Loading...</div>}

      {isModalOpen && editingSale && (
        <EditSaleModal
          open={isModalOpen}
          sale={editingSale}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
