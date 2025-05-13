const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/isAdmin');
const { logIn, logOut, forgotPassword, resetPassword, verifyPasswordResetLink } = require('../../controller/auth/AuthController');

router.route('/login')
    .post(logIn);

router.route('/logout')
    .all(isAdmin)
    .post(logOut);

router.route('/forgot-password')
    .post(forgotPassword);

router.route('/verify/:id/:token')
    .get(verifyPasswordResetLink);

router.route('/reset-password/:id')
    .post(resetPassword);

module.exports = { authRoutes: router };