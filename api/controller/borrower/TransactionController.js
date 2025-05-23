/**
* @name TransactionController
* @file TransactionController.js
* @param {Request} req
* @param {Response} res
* @throwsF
* @description methods to make transactions.
* @author Jaydev Dwivedi (Zignuts)
*/

const Validator = require('validatorjs');
const { HTTP_STATUS_CODES } = require('../../config/constants');
const { VALIDATION_RULES } = require('../../config/validations');
const { Transaction, UserBalance } = require('../../models');
const { calculateBorrowersDueAmount } = require('../../helpers/cron/CalculateBorrowersDueAmount');

const payMoney = async (req, res) => {
    try {

        const { userId, amount, date, notes } = req.body;
        const validationObj = req.body;

        const validation = new Validator(validationObj, {
            userId: VALIDATION_RULES.TRANSACTION.ID,
            amount: VALIDATION_RULES.TRANSACTION.AMOUNT,
            date: VALIDATION_RULES.TRANSACTION.DATE,
            notes: VALIDATION_RULES.TRANSACTION.NOTES
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const transactionType = "paid";

        await Transaction.create({
            userId,
            type: transactionType,
            amount,
            date,
            notes
        });

        const ub = await UserBalance.findOne({ attributes: ['id', 'userId', 'amountPaid', 'totalAmount', 'remainingAmount', 'interest', 'period'] }, { where: { userId } })

        const simpleInterest = (ub.totalAmount * ub.interest * ub.period) / 100;
        const totalSum = parseInt(ub.totalAmount) + simpleInterest;
        const remainingAmount = totalSum - parseInt(amount);

        await UserBalance.update({ amountPaid: amount, remainingAmount }, { where: { userId } });
        calculateBorrowersDueAmount(userId);

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

module.exports = {
    payMoney
}