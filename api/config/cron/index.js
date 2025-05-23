const cron = require('node-cron');
const { calculateBorrowersDueAmount } = require('../../helpers/cron/CalculateBorrowersDueAmount');
const { calculateLendersDueAmount } = require('../../helpers/cron/CalculateLendersDueAmount');

const startCronJobs = () => {

    const job = cron.schedule('0 0 * * *', async () => {
        calculateLendersDueAmount();
        calculateBorrowersDueAmount();
    });

    job.start();
};

module.exports = { startCronJobs };