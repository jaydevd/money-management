const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/isAdmin');
const { logIn, logOut, forgotPassword, resetPassword, verifyPasswordResetLink } = require('../../controller/auth/AuthController');
const multer = require('multer');
const upload = multer();

router.route('/login')
    .all(upload.none())
    .post(logIn);

router.route('/logout')
    .all(isAdmin)
    .post(logOut);

router.route('/forgot-password')
    .all(upload.none())
    .post(forgotPassword);

router.route('/verify/:id/:token')
    .get(verifyPasswordResetLink);

router.route('/reset-password/:id')
    .all(upload.none())
    .post(resetPassword);

module.exports = { authRoutes: router };