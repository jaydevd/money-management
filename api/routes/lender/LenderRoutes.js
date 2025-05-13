const express = require('express');
const { addLender, listLenders } = require('../../controller/lender/LenderController');
const { isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/add')
    .all(isAdmin)
    .post(addLender);

router.route('/list')
    .all(isAdmin)
    .post(listLenders);

module.exports = { lenderRoutes: router };