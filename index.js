import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import path, { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
// import connectDB from './db.js';
const app = express();

app.use(express.static(path.resolve(__dirname, "frontend/dist")));
app.use(cors());
app.use(express.json());


//*------------Routers--------------------------
import userRoutes from "./Routes/UserRoutes.js";
import purchaseRoutes from "./Routes/PurchaseRoutes.js";
import companyRoutes from "./Routes/CompanyRoutes.js";
import salesRouter from "./Routes/SalesRouter/SalesRouter.js";
import { fileURLToPath } from "url";



app.use("/api/v1/user", userRoutes);
app.use("/api/v1/purchase", purchaseRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/sales", salesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1); 
}

