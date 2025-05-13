const express = require('express');
const { inviteUser, deleteUser } = require('../../controller/user/UserController');
const { isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/invite')
    .all(isUser)
    .post(inviteUser);

router.route('/delete')
    .all(isAdmin)
    .post(deleteUser);

module.exports = { userRoutes: router }