const express = require('express');
const { isAdmin } = require('../../middleware/isAdmin');
const { listTransactions } = require('../../controller/transaction/TransactionController');
const router = express.Router();

router.route('/list')
    .all(isAdmin)
    .get(listTransactions);

module.exports = { transactionRoutes: router };