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
const { HTTP_STATUS_CODES, FORGOT_PASSWORD_URL } = require('../../config/constants');
const { VALIDATION_RULES } = require('../../config/validations');
const { User, Admin } = require('../../models');
const { userInviteMail } = require('../../helpers/mail/UserInviteMail');
const { v4: uuidv4 } = require('uuid');

const inviteUser = async (req, res) => {
    try {

        const { email, name, surname, password } = req.body;
        const validationObj = { email, name, surname };

        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.USER.NAME,
            surname: VALIDATION_RULES.USER.SURNAME,
            address: VALIDATION_RULES.USER.ADDRESS,
            amountBorrowed: VALIDATION_RULES.USER_BALANCE.AMOUNT_PAID
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }
        let user = Admin.findOne({ attributes: ['id'], where: { email } });

        if (!user) {
            user = await Admin.create({ email, name, surname });
        }

        const token = uuidv4();
        const tokenExpiry = Math.floor(Date.now() / 1000) + 3600;
        const hashedPassword = bcrypt.hash(password, 10);
        const createdAt = Math.floor(Date.now() / 1000);

        await Admin.update({ token, tokenExpiry, password: hashedPassword, createdAt }, { where: { id: user.id } });

        const URL = `http://localhost:5000/user/verify/${user.id}/${token}`;

        userInviteMail(email, URL);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'invitation mail sent to the user',
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

const deleteUser = async (req, res) => {
    try {

        const { id } = req.body;
        const admin = req.admin;
        const adminId = admin.id;

        await Admin.update({ token: null, tokenExpiry: null, isActive: false, isDeleted: true, updatedAt, updatedBy: adminId }, { where: { id: id } });

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
    deleteUser
}