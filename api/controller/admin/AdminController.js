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
const { sequelize } = require('../../config/database');

const inviteAdmin = async (req, res) => {
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

        let admin = await Admin.findOne({ attributes: ['id'], where: { email } });

        if (admin) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'admin already exists',
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

        admin = await Admin.create({ email, name, surname, token, tokenExpiry, password: hashedPassword, createdAt, createdBy, isActive, isDeleted });

        const url = `http://localhost:5173/admin/verify/${admin.id}/${token}`;

        await userInviteMail(name, email, url);

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

const verifyAdmin = async (req, res) => {
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
            isDeleted = false

        await Admin.update({ token: null, tokenExpiry: null, isActive, isDeleted }, { where: { id } });

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
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

const deleteAdmin = async (req, res) => {
    try {

        const { id } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.ADMIN.ID
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const admin = Admin.findOne({ attributes: ['id', 'email'], where: { id } });
        if (admin.email == process.env.ADMIN_EMAIL) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "can't delete master admin",
                data: '',
                error: ''
            })
        }

        const adminId = req.admin.id;

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
            message: 'admin deleted successfully',
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

const listAdmins = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const offset = Number(page - 1) * limit;

        let selectCountClause = "SELECT COUNT(id)"
        let selectClause = "SELECT id, CONCAT(name, ' ', surname) as full_name, email";
        const fromClause = "\n FROM admins";
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(paginationClause);

        selectCountClause = selectCountClause
            .concat(fromClause)

        const [admins] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectCountClause);

        let count = 0;
        if (total.length > 0) count = total[0].count;

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'list of admins',
            data: { admins, count },
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
    inviteAdmin,
    deleteAdmin,
    verifyAdmin,
    listAdmins
}