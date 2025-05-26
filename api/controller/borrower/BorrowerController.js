/**
* @name borrowerController
* @file borrowerController.js
* @param {Request} req
* @param {Response} res
* @throwsF
* @description methods to log in and log out as an user
* @author Jaydev Dwivedi (Zignuts)
*/

const Validator = require('validatorjs');
const { HTTP_STATUS_CODES, USER_TYPE } = require('../../config/constants');
const { VALIDATION_RULES } = require('../../config/validations');
const { User, UserBalance, Transaction } = require('../../models');
const { sequelize } = require('../../config/database');
const { calculateBorrowersDueAmount } = require('../../helpers/cron/CalculateBorrowersDueAmount');

const addBorrower = async (req, res) => {
    try {
        const { name, surname, address, amountLended, interest, period } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.USER.NAME,
            surname: VALIDATION_RULES.USER.SURNAME,
            address: VALIDATION_RULES.USER.ADDRESS,
            amountLended: VALIDATION_RULES.USER_BALANCE.TOTAL_AMOUNT,
            interest: VALIDATION_RULES.USER_BALANCE.INTEREST,
            period: VALIDATION_RULES.USER_BALANCE.PERIOD
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            });
        }

        const
            type = USER_TYPE.BORROWER,
            createdAt = Math.floor(Date.now() / 1000),
            createdBy = req.admin.id,
            isActive = true,
            isDeleted = false

        const newUser = await User.create({
            name,
            surname,
            address,
            type,
            createdAt,
            createdBy,
            isActive,
            isDeleted
        });

        if (!newUser) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'failed to save the new user',
                data: '',
                error: ''
            });
        }

        const
            userId = newUser.id,
            amount = amountLended,
            transactionType = "lended",
            date = Math.floor(Date.now() / 1000);

        const transaction = await Transaction.create({
            userId,
            amount,
            type: transactionType,
            date
        });

        if (!transaction) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'failed to make the transaction',
                data: '',
                error: ''
            });
        }

        const remainingAmount = parseInt(amountLended) + (parseInt(amountLended * interest * period)) / 100;

        const userBalance = await UserBalance.create({
            userId: newUser.id,
            totalAmount: amountLended,
            interest,
            period,
            remainingAmount,
            amountPaid: 0,
            amountReceived: 0,
            dueAmount: 0
        });

        if (!userBalance) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'failed to update the user balance',
                data: '',
                error: ''
            });
        }
        calculateBorrowersDueAmount(newUser.id);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'borrower added',
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
        });
    }
}

const listBorrowers = async (req, res) => {
    try {

        const { page, limit } = req.query;
        const offset = Number(page - 1) * limit;

        let selectCountClause = "SELECT COUNT(u.id)"
        let selectClause = "SELECT u.id, CONCAT(u.name, ' ', u.surname) AS full_name, ub.total_amount, ub.amount_paid, ub.interest, ub.period, ub.remaining_amount, ub.due_amount ";
        const fromClause = "\n FROM users u JOIN user_balance ub ON u.id = ub.user_id";
        let whereClause = "\n WHERE type = 'borrower'";
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectCountClause = selectCountClause
            .concat(fromClause)
            .concat(whereClause)

        const [borrowers] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectCountClause);

        let count = 0;
        if (total.length > 0) count = total[0].count;

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'list of borrowers',
            data: { borrowers, count },
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

module.exports = {
    addBorrower,
    listBorrowers
}