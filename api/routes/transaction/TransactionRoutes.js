const express = require('express');
const { makeTransaction, listTransactions } = require('../../controller/transaction/TransactionController');
const { isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/new')
    .all(isAdmin)
    .post(makeTransaction);

router.route('/list')
    .all(isAdmin)
    .post(listTransactions);

module.exports = { transactionRoutes: router };