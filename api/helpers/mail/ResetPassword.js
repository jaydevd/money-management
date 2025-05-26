const { getTransporter } = require("../../config/transporter");
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

const resetPasswordMail = async (url, email) => {
    try {
        const templatePath = path.resolve(__dirname, '../../templates/passwordReset.hbs');
        const source = fs.readFileSync(templatePath, 'utf-8');

        const template = handlebars.compile(source);
        const html = template({ url });

        const mailOptions = {
            from: `admin@xiu4cjlm.mailosaur.net`,
            to: email,
            subject: 'Password Reset',
            html: html,
        };

        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);
        console.log("email sent!");
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = { resetPasswordMail };