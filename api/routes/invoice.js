import express from 'express';
import invoiceController from '../controllers/invoice.controller.js';
import { auth } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

// Admin routes
router.post('/', auth, authorizeRoles(['admin']), invoiceController.createManualInvoice);
router.get('/', auth, authorizeRoles(['admin']), invoiceController.getAllInvoices);
router.get('/statistics', auth, authorizeRoles(['admin']), invoiceController.getRevenueStatistics);
router.get('/:invoiceId', auth, authorizeRoles(['admin']), invoiceController.getInvoiceById);
router.patch('/:invoiceId/confirm-payment', auth, authorizeRoles(['admin']), invoiceController.confirmPayment);
router.patch('/:invoiceId/refund', auth, authorizeRoles(['admin']), invoiceController.refundInvoice);

export default router;
