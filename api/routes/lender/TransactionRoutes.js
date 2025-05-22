const express = require('express');
const { isAdmin } = require('../../middleware/isAdmin');
const { receiveMoney } = require('../../controller/lender/TransactionController');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.route('/receive')
    .all(isAdmin, upload.none())
    .post(receiveMoney);

module.exports = { transactionRoutes: router };