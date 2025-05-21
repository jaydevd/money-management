const { User, UserBalance } = require('../../models');
const { sequelize } = require('./../../config/database');

const calculateDueAmount = async () => {
    try {

        let selectClause = `SELECT `;
        const fromClause = `\n FROM users u JOIN user_balance ub ON u.id = ub.user_id JOIN transactions t ON u.id = t.user_id`;
        const whereClause = `\n WHERE`;
        
        const [result] = await sequelize.query(selectClause);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { calculateDueAmount };