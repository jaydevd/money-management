const { getTransporter } = require("../../config/transporter");
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

const userInviteMail = async (name, email, URL) => {
    try {

        const templatePath = path.resolve(__dirname, '../../templates/userInvitation.hbs');
        const source = fs.readFileSync(templatePath, 'utf-8');

        const template = handlebars.compile(source);
        const html = template({ name, URL });

        const mailOptions = {
            from: 'admin@xiu4cjlm.mailosaur.net',
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