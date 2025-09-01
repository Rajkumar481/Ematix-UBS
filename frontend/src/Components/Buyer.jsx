import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import customFetch from "../utils/Customfetch";

const Buyer = () => {
  const [buyerData, setBuyerData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentBuyerId, setCurrentBuyerId] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
  });

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const res = await customFetch.get("/company");
      setBuyerData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch buyers");
    }
  };

  const handleDelete = async (buyer) => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;
    try {
      await customFetch.delete(`/company/${buyer._id}`);
      toast.success("Buyer deleted successfully");
      fetchBuyers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete buyer");
    }
  };

  const handleEdit = (buyer) => {
    setFormData({ ...buyer });
    setCurrentBuyerId(buyer._id);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await customFetch.patch(
          `/company/${currentBuyerId}`,
          formData
        );
        toast.success("Buyer updated successfully");
      } else {
        await customFetch.post("/company", formData);
        toast.success("Buyer added successfully");
      }
      fetchBuyers();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save buyer");
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      email: "",
      phone: "",
      address: "",
      gst: "",
    });
    setEditMode(false);
    setCurrentBuyerId(null);
    setOpenForm(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Buyer Details</h3>
        <button
          onClick={() => {
            resetForm();
            setOpenForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Buyer
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-center">
            {[
              "S.No",
              "Company Name",
              "Email",
              "Phone",
              "Address",
              "GST",
              "Actions",
            ].map((col) => (
              <th key={col} className="px-4 py-2 border">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buyerData.map((buyer, index) => (
            <tr key={buyer._id} className="text-center border-t">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{buyer.companyName}</td>
              <td className="px-4 py-2 border">{buyer.email}</td>
              <td className="px-4 py-2 border">{buyer.phone}</td>
              <td className="px-4 py-2 border">{buyer.address}</td>
              <td className="px-4 py-2 border">{buyer.gst}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(buyer)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(buyer)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Buyer" : "Add New Buyer"}
            </h2>
            <button
              onClick={resetForm}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["companyName", "email", "phone", "address", "gst"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field}`}
                      className="w-full mt-1 p-2 border rounded"
                      required
                    />
                  </div>
                )
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editMode ? "Update Buyer" : "Add Buyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buyer;
