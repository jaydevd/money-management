const express = require('express');
const { addLender, listLenders } = require('../../controller/lender/LenderController');
const { isAdmin } = require('../../middleware/isAdmin');
const { transactionRoutes } = require('./TransactionRoutes');
const router = express.Router();

router.route('/add')
    .all(isAdmin)
    .post(addLender);

router.route('/list')
    .all(isAdmin)
    .get(listLenders);

router.use('/transaction', transactionRoutes);

module.exports = { lenderRoutes: router };