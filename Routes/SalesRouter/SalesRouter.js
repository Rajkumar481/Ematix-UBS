import { Router } from "express";
import {
  createSales,
  deleteSales,
  getAllSales,
  getSalesById,
  updateSales,
} from "../../Controller/Sales/SalesContoller.js";

const router = Router();

router.route("/").get(getAllSales).post(createSales);
router.route("/:id").get(getSalesById).patch(updateSales).delete(deleteSales);

export default router;
