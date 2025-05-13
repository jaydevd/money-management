const { getTransporter } = require("../../config/transporter");
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

const userInviteMail = async (email, URL) => {
    try {

        const templatePath = path.resolve(__dirname, '../../templates/index.hbs');
        const source = fs.readFileSync(templatePath, 'utf-8');

        const template = handlebars.compile(source);
        const html = template({ URL });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Invitation",
            html: html
        }

        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = { userInviteMail };