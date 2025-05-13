const express = require('express');
const router = express.Router();
const { getUsers } = require('../../../controller/drop-down/DropDownController');

router.route('/users')
    .get(getUsers);

module.exports = { dropDownRoutes: router };