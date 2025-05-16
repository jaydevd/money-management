const express = require('express');
const { isAdmin } = require('../../middleware/isAdmin');
const { receiveMoney } = require('../../controller/lender/TransactionController');
const router = express.Router();

router.route('/receive')
    .all(isAdmin)
    .post(receiveMoney);

module.exports = { transactionRoutes: router };