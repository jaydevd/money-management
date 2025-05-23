const { sequelize } = require("../../config/database");
const { UserBalance } = require("../../models");

const calculateLendersDueAmount = async () => {
    try {
        let selectClause = "SELECT u.id, ub.total_amount, ub.interest, ub.period, ub.amount_received, t.date";
        const fromClause = "\n FROM users u JOIN user_balance ub ON u.id = ub.user_id JOIN transactions t ON t.user_id = u.id";
        let whereClause = "\n WHERE u.type='lender' AND u.is_active = true AND t.type='borrowed' AND t.user_id = u.id";

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause);

        console.log(selectClause);

        console.log("calculating lender's due amount...");
        const [users] = await sequelize.query(selectClause);
        console.log(users);

        users.forEach((u) => {
            console.log(`calculating ${u.id}'s due amount...`);

            const then = new Date(u.date * 1000);
            const now = new Date();

            const years = now.getFullYear() - then.getFullYear();
            const months = now.getMonth() - then.getMonth();
            const monthsPassed = years * 12 + months;

            // check the installments
            const simpleInterest = (u.total_amount * u.interest * u.period) / 100;
            console.log('simpleInterest: ', simpleInterest);
            const totalSum = parseInt(u.total_amount) + simpleInterest;
            console.log('totalSum: ', totalSum);
            const installmentAmount = totalSum / 12;
            console.log('installmentAmount: ', installmentAmount);
            const installmentsReceived = u.amount_received / installmentAmount;
            console.log('installmentsReceived: ', installmentsReceived);

            if (installmentsReceived == monthsPassed) {
                console.log('installmentsReceived == monthsPassed: ', installmentsReceived == monthsPassed);
                UserBalance.update({ dueAmount: 0 }, { where: { id: u.id } });
            }

            if (installmentsReceived < monthsPassed) {
                console.log('installmentsReceived < monthsPassed: ', installmentsReceived < monthsPassed);
                const installmentsDue = monthsPassed - installmentsReceived;
                const dueAmount = installmentsDue * installmentAmount;
                UserBalance.update({ dueAmount }, { where: { id: u.id } });
            }
        });

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = { calculateLendersDueAmount };