"use client";

import React, { useState } from "react";
import User from "../Components/User";
import Buyer from "../Components/Buyer";
import SidebarLayout from "../Components/Sidebar";
import Product from "../Components/Product";
import SalesForm from "../Components/sales/SalesForm";
import SalesList from "../Components/sales/SalesList";
import StockPage from "../Components/Stock/StockPage";
import ProfitForm from "../Components/Profit/ProfitForm";
import StackManagement from "../Components/Stock/StackManagement";
import { Box } from "@mui/material";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("sales");

  const renderComponent = () => {
    switch (activeComponent) {
      case "user":
        return <User />;
      case "buyer":
        return <Buyer />;
      case "product":
        return <Product />;
      case "sales":
        return <SalesForm />;
      case "sales-list":
        return <SalesList />;
      case "stock":
        return <StockPage />;
      case "profit":
        return <ProfitForm />;
      case "stack-management":
        return <StackManagement />;
      default:
        return (
          <div className="text-gray-500 text-lg h-full flex items-center justify-center">
            Select a section
          </div>
        );
    }
  };

  return (
    <Box className="flex h-screen">
      {/* Sidebar */}
      <SidebarLayout setActiveComponent={setActiveComponent} />

      {/* Main Content Area */}
      <Box
        component="main"
        className="flex-1 overflow-y-auto "
        sx={{
          minHeight: "100vh",
          // padding: 4,
          // background:
          //   "linear-gradient(to right top, #d82c57, #ca295f, #bb2a66, #aa2c6a, #992e6d, #7f3575, #633b77, #483d73, #1e3e66, #073950, #143138, #1f2727)",
          color: "black",
        }}
        style={{
          // background:
          //   "linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(0,128,128,0.3))",
          // backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
