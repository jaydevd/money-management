const express = require('express');
const { addBorrower, listBorrowers } = require('../../controller/borrower/BorrowerController');
const { isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/add')
    .all(isAdmin)
    .post(addBorrower);

router.route('/list')
    .all(isAdmin)
    .get(listBorrowers);

module.exports = { borrowerRoutes: router };