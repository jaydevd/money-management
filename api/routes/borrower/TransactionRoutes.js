const express = require('express');
const { isAdmin } = require('../../middleware/isAdmin');
const { payMoney } = require('../../controller/borrower/TransactionController');
const router = express.Router();

router.route('/pay')
    .all(isAdmin)
    .post(payMoney);

module.exports = { transactionRoutes: router };