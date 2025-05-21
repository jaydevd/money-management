const nodemailer = require('nodemailer');

const getTransporter = () => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false
        });
        return transporter;

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { getTransporter };