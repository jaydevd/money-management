/**
* @name AuthController
* @file AuthController.js
* @param {Request} req
* @param {Response} res
* @throwsF
* @description methods to log in and log out as an user
* @author Jaydev Dwivedi (Zignuts)
*/

const { HTTP_STATUS_CODES } = require('../../config/constants');
const { sequelize } = require('../../config/database');

const listTransactions = async (req, res) => {
    try {

        const { page, limit } = req.query;
        const offset = Number(page - 1) * limit;

        let selectCountClause = "SELECT COUNT(t.id)"
        let selectClause = "SELECT CONCAT(u.name, ' ', u.surname) AS full_name, t.type, t.amount, t.notes";
        const fromClause = "\n FROM transactions t JOIN users u ON u.id = t.user_id";
        let whereClause = "\n";
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectCountClause = selectCountClause
            .concat(fromClause)
            .concat(whereClause)

        const [transactions] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectCountClause);

        let count = 0;
        if (total.length > 0) count = total[0].count;

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'list of transactions',
            data: { transactions, count },
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
    listTransactions
}