const express = require('express');
const { inviteAdmin, deleteAdmin, verifyAdmin, listAdmins } = require('../../controller/admin/AdminController');
const { isAdmin } = require('../../middleware/isAdmin');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.route('/invite')
    .all(isAdmin, upload.none())
    .post(inviteAdmin);

router.route('/list')
    .all(isAdmin)
    .get(listAdmins);

router.route('/verify/:id/:token')
    .get(verifyAdmin);

router.route('/delete')
    .all(isAdmin, upload.none())
    .post(deleteAdmin);

module.exports = { adminRoutes: router }