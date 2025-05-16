const express = require('express');

const { authRoutes } = require('./auth/AuthRoutes.js');
const { dropDownRoutes } = require('./drop-down/DropDownRoutes.js');
const { adminRoutes } = require('./admin/AdminRoutes.js');
const { lenderRoutes } = require('./lender/LenderRoutes.js');
const { borrowerRoutes } = require('./borrower/BorrowerRoutes.js');
const { transactionRoutes } = require('./transaction/TransactionRoutes.js');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/lender', lenderRoutes);
router.use('/borrower', borrowerRoutes);
router.use('/transaction', transactionRoutes);
router.use('/drop-down', dropDownRoutes);
router.use('/admin', adminRoutes);

module.exports = { router };