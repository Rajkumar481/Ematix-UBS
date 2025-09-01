import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/DashboradPage";
import AddProduct from "./pages/AddProduct";
import SalesDetails from "./Components/sales/SalesDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit/add-product/:id" element={<AddProduct />} />
        <Route path="/sales/:id" element={<SalesDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
