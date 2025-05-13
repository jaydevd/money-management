const express = require('express');
const { addBorrower, listBorrowers } = require('../../controller/borrower/BorrowerController');
const { isUser } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/add')
    .all(isUser)
    .post(addBorrower);

router.route('/list')
    .all(isUser)
    .get(listBorrowers);

module.exports = { borrowerRoutes: router };