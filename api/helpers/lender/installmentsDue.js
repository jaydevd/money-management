const installmentsDue = async (ub, t_date) => {
    try {
        const then = new Date(t_date * 1000); // convert from seconds to ms
        const now = new Date();

        const years = now.getFullYear() - then.getFullYear();
        const months = now.getMonth() - then.getMonth();
        const monthsPassed = years * 12 + months;

        // check the installments
        const simpleInterest = (ub.totalAmount * ub.interest * ub.period) / 100;
        const totalSum = parseInt(ub.totalAmount) + simpleInterest;
        const installmentAmount = totalSum / 12;
        const installmentsPaid = ub.amountReceived / installmentAmount;

        if (installmentsPaid == monthsPassed) return 0;
        const installmentsDue = monthsPassed - installmentsPaid;

        console.log(installmentsPaid);

        return installmentsDue * installmentAmount;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = { installmentsDue };