const express = require('express');
const { makeTransaction, listTransactions } = require('../../controller/transaction/TransactionController');
const { isUser } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/new')
    .all(isUser)
    .post(makeTransaction);

router.route('/list')
    .all(isUser)
    .post(listTransactions);

module.exports = { transactionRoutes: router };