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
const { User, UserBalance } = require('../../models');

const listLenders = async (req, res) => {
    try {

        const { page, limit } = req.body;
        const offset = Number(page - 1) * limit;

        let selectCountClause = "SELECT COUNT(u.id)"
        let selectClause = `SELECT u.id, concat(u.name, ' ', u.surname) AS full_name, ub.total_amount, u.interest_rate, ub.amount_paid, (ub.total_amount * u.interest_rate * 0.1)/100 as interest_paid, ub.remaining_amount `;
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

        const lenders = await sequelize.query(selectClause);
        const total = await sequelize.query(selectCountClause);

        const count = 0;
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

        const { name, surname, address, amountBorrowed, interestRate } = req.body;

        const validationObj = { name, surname, address, amountBorrowed, interestRate };
        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.USER.NAME,
            surname: VALIDATION_RULES.USER.SURNAME,
            address: VALIDATION_RULES.USER.ADDRESS,
            amountBorrowed: VALIDATION_RULES.USER_BALANCE.TOTAL_AMOUNT,
            interestRate: VALIDATION_RULES.USER.INTEREST_RATE
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const
            type = USER_TYPE.LENDER,
            createdAt = Math.floor(Date.now() / 1000),
            createdBy = req.admin.id,
            isActive = true,
            isDeleted = false;

        const newUser = await User.create({
            name,
            surname,
            address,
            interestRate,
            type,
            createdAt,
            createdBy,
            isActive,
            isDeleted
        });

        await UserBalance.create({
            user_id: newUser.id,
            totalAmount: amountBorrowed
        })

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
        })
    }
}

module.exports = {
    listLenders,
    addLender
}