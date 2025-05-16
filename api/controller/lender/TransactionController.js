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

const receiveMoney = async (req, res) => {
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

        const transactionType = "received";

        await Transaction.create({
            userId,
            type: transactionType,
            amount,
            date,
            notes
        });

        await UserBalance.findOne({ attributes: ['id', 'userId', 'amountReceived', 'totalAmount', 'remainingAmount', 'interest'] }, { where: { userId } })

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
    receiveMoney
}