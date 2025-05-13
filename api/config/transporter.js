const nodemailer = require('nodemailer');

const getTransporter = () => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        return transporter;

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { getTransporter };