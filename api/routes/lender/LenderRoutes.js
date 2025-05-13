const express = require('express');
const { addLender, listLenders } = require('../../controller/lender/LenderController');
const { isUser } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/add')
    .all(isUser)
    .post(addLender);

router.route('/list')
    .all(isUser)
    .post(listLenders);

module.exports = { lenderRoutes: router };