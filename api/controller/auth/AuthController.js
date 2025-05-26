/**
 * @name AuthController
 * @file AuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description methods to log in and log out as an user
 * @author Jaydev Dwivedi (Zignuts)
 */

const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('../../config/constants');
const { VALIDATION_RULES } = require('../../config/validations');
const { Admin } = require('../../models');
const { resetPasswordMail } = require('../../helpers/mail/ResetPassword');
const { v4: uuidv4 } = require('uuid');

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validationObj = req.body;

        const validation = new Validator(validationObj, {
            email: VALIDATION_RULES.ADMIN.EMAIL,
            password: VALIDATION_RULES.ADMIN.PASSWORD
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const admin = await Admin.findOne({ attributes: ['id', 'name', 'surname', 'email', 'password'], where: { email } });

        if (!admin) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: "admin not found",
                data: "",
                error: ""
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
                message: "password doesn't match",
                data: "",
                error: ""
            })
        }

        const token = jwt.sign({
            id: admin.id,
        }, process.env.SECRET_KEY, { expiresIn: '1h' });

        await Admin.update({ token }, { where: { id: admin.id } });

        const adminDetails = {
            id: admin.id,
            name: admin.name,
            surname: admin.surname,
            email: admin.email
        };

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { adminDetails, token },
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        });
    }
}

const logOut = async (req, res) => {
    try {
        const admin = req.admin;
        const id = admin.id;
        const updatedAt = Math.floor(Date.now() / 1000);

        await Admin.update({ token: null, updatedAt, updatedBy: id }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'Logged out successfully',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            email: VALIDATION_RULES.ADMIN.EMAIL
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const admin = await Admin.findOne({ attributes: ['id', 'email'], where: { email } });

        if (!admin) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: "admin with this email doesn't exist",
                data: '',
                error: ''
            });
        }

        const token = uuidv4(),
            tokenExpiry = Math.floor(Date.now() / 1000) + 3600,
            updatedAt = Math.floor(Date.now() / 1000),
            updatedBy = admin.id;

        await Admin.update({ token, tokenExpiry, updatedAt, updatedBy }, { where: { id: admin.id } });

        const url = `https://money-management-front-end-pn8h.vercel.app//auth/reset-password/${admin.id}/${token}`;

        await resetPasswordMail(url, email);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'email sent to the user',
            data: '',
            error: ''
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

const verifyPasswordResetLink = async (req, res) => {
    try {
        const { id, token } = req.params;

        const admin = await Admin.findOne({ attributes: ['id', 'token', 'tokenExpiry'], where: { id } });

        if (!admin) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'user not found',
                data: '',
                error: ''
            })
        }

        if (admin.token != token) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'invalid token',
                data: '',
                error: ''
            })
        }

        const currentTime = Math.floor(Date.now() / 1000);

        if (admin.tokenExpiry <= currentTime) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'token expired',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'link is valid',
            data: id,
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: id,
            error: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            password: VALIDATION_RULES.ADMIN.PASSWORD
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const admin = await Admin.findOne({ attributes: ['id', 'tokenExpiry'], where: { id } });

        if (!admin) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: 'user not found',
                data: '',
                error: ''
            })
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (admin.tokenExpiry <= currentTime) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: 'token expired',
                data: '',
                error: ''
            })
        }

        const
            hashedPassword = await bcrypt.hash(password, 10),
            updatedAt = Math.floor(Date.now() / 1000),
            updatedBy = id;

        await Admin.update({ password: hashedPassword, token: null, tokenExpiry: null, updatedAt, updatedBy }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'password reset successfully',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

module.exports = {
    logIn,
    logOut,
    forgotPassword,
    resetPassword,
    verifyPasswordResetLink
}