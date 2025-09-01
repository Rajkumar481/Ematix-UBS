import express from 'express';
const router = express.Router();
import * as CompanyController from "../Controller/CompanyController.js"

router.post("/",CompanyController.createCompany);
router.get("/",CompanyController.getAllCompanys);
router.get("/:id",CompanyController.getCompanyById);
router.patch("/:id",CompanyController.updateCompany);
router.delete("/:id",CompanyController.deleteCompany);

export default router;
