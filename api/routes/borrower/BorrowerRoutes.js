const express = require('express');
const { addBorrower, listBorrowers } = require('../../controller/borrower/BorrowerController');
const { isAdmin } = require('../../middleware/isAdmin');
const { transactionRoutes } = require('./TransactionRoutes');
const router = express.Router();

const multer = require('multer');
const upload = multer();

router.route('/add')
    .all(isAdmin, upload.none())
    .post(addBorrower);

router.route('/list')
    .all(isAdmin)
    .get(listBorrowers);

router.use('/transaction', transactionRoutes)

module.exports = { borrowerRoutes: router };