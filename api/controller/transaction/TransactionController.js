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
const { Transaction, User, UserBalance } = require('../../models');

const makeTransaction = async (req, res) => {
    try {

        const { userId, transactionType, amount, date, notes } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            userId: VALIDATION_RULES.TRANSACTION.USER_ID,
            transactionType: VALIDATION_RULES.TRANSACTION.TYPE,
            amount: VALIDATION_RULES.TRANSACTION.AMOUNT,
            date: VALIDATION_RULES.TRANSACTION.DATE,
            notes: VALIDATION_RULES.TRANSACTION.NOTES
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        await Transaction.create({ userId, type: transactionType, amount, date, notes });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'transaction was successful',
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

const listTransactions = async (req, res) => {
    try {

        const { page, limit } = req.body;
        const offset = Number(page - 1) * limit;

        let selectCountClause = "SELECT COUNT(t.id)"
        let selectClause = "SELECT t.id, CONCAT(u.name, ' ', u.surname) AS full_name, t.type, t.amount, t.notes";
        const fromClause = "\n FROM transactions JOIN users u ON u.id = t.user_id";
        let whereClause = "\n";
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectCountClause = selectCountClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        const users = await sequelize.query(selectClause);
        const total = await sequelize.query(selectCountClause);

        const count = 0;
        if (total.length > 0) count = total[0].count;

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { users, count },
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

module.exports = {
    makeTransaction,
    listTransactions
}