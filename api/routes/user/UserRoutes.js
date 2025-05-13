const express = require('express');
const { inviteUser, deleteUser, verifyUser } = require('../../controller/user/UserController');
const { isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();

router.route('/invite')
    .all(isAdmin)
    .post(inviteUser);

router.route('/verify/:id/:token')
    .all(isAdmin)
    .get(verifyUser);

router.route('/delete')
    .all(isAdmin)
    .post(deleteUser);

module.exports = { userRoutes: router }