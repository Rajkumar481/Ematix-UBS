import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import customFetch from "../utils/Customfetch";

const User = () => {
  const [userdata, setUserData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openAddUser, setOpenAddUser] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customFetch.get("/user");
      setUserData(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await customFetch.delete(`/user/${user._id}`);
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setFormData({ ...user });
    setCurrentUserId(user._id);
    setEditMode(true);
    setOpenAddUser(true);
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
          `/user/${currentUserId}`,
          formData
        );
        toast.success("User updated successfully");
      } else {
        await customFetch.post("/user", formData);
        toast.success("User added successfully");
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save user");
    }
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      phone: "",
      address: "",
      gst: "",
    });
    setEditMode(false);
    setCurrentUserId(null);
    setOpenAddUser(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">User Details</h3>
        <button
          onClick={() => setOpenAddUser(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2 border">S.No</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">GST</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userdata.map((user, index) => (
            <tr key={user._id} className="text-center border-t">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{user.userName}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.phone}</td>
              <td className="px-4 py-2 border">{user.address}</td>
              <td className="px-4 py-2 border">{user.gst}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openAddUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-lg font-semibold mb-4">
              {editMode ? "Edit User" : "Add New User"}
            </h2>
            <button
              onClick={resetForm}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["userName", "email", "phone", "address", "gst"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize">
                    {field}
                  </label>
                  <input
                    required
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editMode ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
