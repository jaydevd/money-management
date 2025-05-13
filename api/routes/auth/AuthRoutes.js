const express = require('express');
const router = express.Router();
const { isUser } = require('../../middleware/isAdmin');
const { logIn, logOut, forgotPassword, resetPassword } = require('../../controller/auth/AuthController');

router.route('/login')
    .post(logIn);

router.route('/logout')
    .all(isUser)
    .post(logOut);

router.route('/forgot-password')
    .post(forgotPassword);

router.route('/reset-password/:token')
    .post(resetPassword);

module.exports = { authRoutes: router };