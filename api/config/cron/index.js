const cron = require('node-cron');

const startCronJobs = () => {

    const job = cron.schedule('0 20 * * *', async () => {
        calculateDueAmount();
    });

    job.start();
};

module.exports = { startCronJobs };