const express = require('express');

const { authRoutes } = require('./auth/AuthRoutes.js');
const { dropDownRoutes } = require('./drop-down/DropDownRoutes.js');
const { userRoutes } = require('./user/UserRoutes.js');
const { transactionRoutes } = require('./transaction/TransactionRoutes.js');
const { lenderRoutes } = require('./lender/LenderRoutes.js');
const { borrowerRoutes } = require('./borrower/BorrowerRoutes.js');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/lender', lenderRoutes);
router.use('/borrower', borrowerRoutes);
router.use('/transaction', transactionRoutes);
router.use('/drop-down', dropDownRoutes);
router.use('/user', userRoutes);

module.exports = { router };