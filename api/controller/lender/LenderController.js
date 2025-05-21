/**
* @name lenderController
* @file LenderController.js
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

const listLenders = async (req, res) => {
    try {

        const { page, limit } = req.query;
        const offset = Number(page - 1) * limit;

        // const simpleInterest = (ub.totalAmount * ub.interest * ub.period) / 100;
        // const totalSum = parseInt(ub.totalAmount) + simpleInterest;
        // const remainingAmount = totalSum - parseInt(amount);
        // const dueAmount = installmentsDue(ub, t);

        let selectCountClause = "SELECT COUNT(u.id)"
        let selectClause = `SELECT u.id, concat(u.name, ' ', u.surname) AS full_name, ub.total_amount, ub.interest, ub.amount_received, ub.period, ub.remaining_amount, ub.due_amount `;
        const fromClause = "\n FROM users u JOIN user_balance ub ON u.id = ub.user_id";
        let whereClause = "\n WHERE type = 'lender'";
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectCountClause = selectCountClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        const [lenders] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectCountClause);


        let count = 0;
        if (total.length > 0) count = total[0].count;

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'list of lenders',
            data: { lenders, count },
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

const addLender = async (req, res) => {
    try {

        const { name, surname, address, amountBorrowed, interest, period } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.USER.NAME,
            surname: VALIDATION_RULES.USER.SURNAME,
            address: VALIDATION_RULES.USER.ADDRESS,
            amountBorrowed: VALIDATION_RULES.USER_BALANCE.TOTAL_AMOUNT,
            interest: VALIDATION_RULES.USER.INTEREST,
            period: VALIDATION_RULES.USER.PERIOD
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
            type = USER_TYPE.LENDER,
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
                message: 'failed to add new user',
                data: '',
                error: ''
            });
        }

        const transaction = await Transaction.create({
            userId: newUser.id,
            amount: amountBorrowed,
            type: "borrowed",
            date: Math.floor(Date.now() / 1000)
        })

        if (!transaction) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'failed to make the transaction',
                data: '',
                error: ''
            });
        }

        const remainingAmount = parseInt(amountBorrowed) + (parseInt(amountBorrowed * interest * period)) / 100;

        const userBalance = await UserBalance.create({
            userId: newUser.id,
            totalAmount: amountBorrowed,
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

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'lender added',
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

module.exports = {
    listLenders,
    addLender
}