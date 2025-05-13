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
const { HTTP_STATUS_CODES } = require('../../config/constants');
const { VALIDATION_RULES } = require('../../config/validations');
const { Admin } = require('../../models');
const { userInviteMail } = require('../../helpers/mail/UserInviteMail');
const { v4: uuidv4 } = require('uuid');

const inviteUser = async (req, res) => {
    try {

        const { email, name, surname, password } = req.body;
        const validationObj = req.body;

        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.ADMIN.NAME,
            surname: VALIDATION_RULES.ADMIN.SURNAME,
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

        let user = await Admin.findOne({ attributes: ['id'], where: { email } });

        if (user) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'user already exists',
                data: '',
                error: ''
            })
        }

        const
            token = uuidv4(),
            tokenExpiry = Math.floor(Date.now() / 1000) + 3600,
            hashedPassword = await bcrypt.hash(password, 10),
            createdAt = Math.floor(Date.now() / 1000),
            createdBy = req.admin.id,
            isActive = false,
            isDeleted = false;

        user = await Admin.create({ email, name, surname, token, tokenExpiry, password: hashedPassword, createdAt, createdBy, isActive, isDeleted });

        const url = `http://localhost:5000/user/verify/${user.id}/${token}`;

        await userInviteMail(name, email, url);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'invitation mail sent to the user',
            data: url,
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

const verifyUser = async (req, res) => {
    try {
        const { id, token } = req.params;

        const validationObj = req.params;
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.ADMIN.ID,
            token: VALIDATION_RULES.ADMIN.TOKEN
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const admin = await Admin.findOne({ attributes: ['id', 'token', 'tokenExpiry'], where: { id } });

        if (!admin) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'no user found, verification failed',
                data: '',
                error: ''
            })
        }

        if (token != admin.token) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'token is invalid',
                data: '',
                error: ''
            })
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (admin.tokenExpiry <= currentTime) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'token is expired',
                data: '',
                error: ''
            })
        }

        const
            isActive = true,
            isDeleted = false,
            updatedBy = req.admin.id,
            updatedAt = Math.floor(Date.now() / 1000);

        await Admin.update({ token: null, tokenExpiry: null, isActive, isDeleted, updatedAt, updatedBy }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'user verified and activated',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {

        const { id } = req.body;
        const admin = req.admin;
        const adminId = admin.id;

        const
            token = null,
            tokenExpiry = null,
            isActive = false,
            isDeleted = true,
            updatedAt = Math.floor(Date.now() / 1000),
            updatedBy = adminId;

        await Admin.update({ token, tokenExpiry, isActive, isDeleted, updatedAt, updatedBy }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'user deleted successfully',
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
    inviteUser,
    deleteUser,
    verifyUser
}