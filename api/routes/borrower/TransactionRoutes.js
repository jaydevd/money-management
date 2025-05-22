const express = require('express');
const { isAdmin } = require('../../middleware/isAdmin');
const { payMoney } = require('../../controller/borrower/TransactionController');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.route('/pay')
    .all(isAdmin, upload.none())
    .post(payMoney);

module.exports = { transactionRoutes: router };