const { sequelize } = require("../../config/database");
const { UserBalance } = require("../../models");

const calculateBorrowersDueAmount = async () => {
    try {

        let selectClause = "SELECT u.id, ub.total_amount, ub.interest, ub.period, ub.amount_paid, t.date";
        const fromClause = "\n FROM users u JOIN user_balance ub ON u.id = ub.user_id JOIN transactions t ON t.user_id = u.id";
        const whereClause = "\n WHERE u.type='borrower' AND u.is_active = true AND t.type='lended' AND t.user_id = u.id";

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause);

        const [users] = await sequelize.query(selectClause);

        users.forEach((u) => {

            const then = new Date(u.date * 1000);
            const now = new Date();

            const years = now.getFullYear() - then.getFullYear();
            const months = now.getMonth() - then.getMonth();
            const monthsPassed = years * 12 + months;

            // check the installments
            const simpleInterest = (u.total_amount * u.interest * u.period) / 100;
            const totalSum = parseInt(u.total_amount) + simpleInterest;
            const installmentAmount = totalSum / 12;
            const installmentsPaid = u.amount_paid / installmentAmount;

            if (installmentsPaid == monthsPassed) {
                UserBalance.update({ dueAmount: 0 }, { where: { id: u.id } });
            }

            if (installmentsPaid < monthsPassed) {
                const installmentsDue = monthsPassed - installmentsPaid;
                const dueAmount = installmentsDue * installmentAmount;
                UserBalance.update({ dueAmount }, { where: { id: u.id } });
            }
        });

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = { calculateBorrowersDueAmount };