import express from 'express';
const router = express.Router();
import * as purchaseController from '../Controller/PurchaseController.js'

router.post('/', purchaseController.createPurchase);
router.get('/', purchaseController.getAllPurchases);
router.get('/:id', purchaseController.getPurchaseById);
router.patch('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);

export default router;
