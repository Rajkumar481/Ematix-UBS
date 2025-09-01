import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import InvoiceModal from "./InvoiceModal";
import customFetch from "../utils/Customfetch";

const Product = () => {
  const [userdata, setUserData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customFetch.get("/purchase");
      setUserData(response.data);
      console.log("Data fetched successfully", response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  const handleDelete = async (purchase) => {
    try {
      await customFetch.delete(`/purchase/${purchase._id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const sumItemsField = (items, key) => {
    return items?.reduce((acc, item) => acc + Number(item[key] || 0), 0);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Product Details</h3>
        <Link
          to="/add-product"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 !no-underline"
        >
          Add Product
        </Link>
      </div>

      <table className="min-w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2 border">S.No</th>
            <th className="px-4 py-2 border">Company Name</th>
            <th className="px-4 py-2 border">Product Name(s)</th>
            <th className="px-4 py-2 border">GST Amount</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Total Amount</th>
            <th className="px-4 py-2 border">Profit</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userdata.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            userdata.map((purchase, index) => (
              <tr
                key={purchase._id}
                className="text-center border-t cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedProduct(purchase)} // opens invoice modal
              >
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">
                  {purchase.purchaseId?.companyName || "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {purchase.items?.map((item) => item.productName).join(", ")}
                </td>
                <td className="px-4 py-2 border">
                  {sumItemsField(purchase.items, "gstAmount")}
                </td>
                <td className="px-4 py-2 border">
                  {sumItemsField(purchase.items, "total")}
                </td>
                <td className="px-4 py-2 border">
                  {sumItemsField(purchase.items, "totalAmount")}
                </td>
                <td className="px-4 py-2 border">
                  {sumItemsField(purchase.items, "profit")}
                </td>
                <td className="px-4 py-2 border">
                  <div
                    className="flex items-center justify-center space-x-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        navigate(`/edit/add-product/${purchase._id}`)
                      }
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(purchase)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedProduct && (
        <InvoiceModal
          product={selectedProduct}
          buyer={selectedProduct?.purchaseId}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Product;
