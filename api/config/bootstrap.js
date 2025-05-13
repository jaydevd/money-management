const { Admin } = require("../models/index");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports.bootstrap = async () => {
    try {

        const admin = await Admin.findOne({ attributes: ['id'] });
        if (admin) return;

        const
            name = "John",
            surname = "Doe",
            email = "jaydevd@zignuts.com",
            password = process.env.USER_PASSWORD,
            hashedPassword = await bcrypt.hash(password, 10),
            createdAt = Math.floor(Date.now() / 1000),
            createdBy = 1,
            isActive = true,
            isDeleted = false;

        await Admin.create({
            name,
            surname,
            email,
            password: hashedPassword,
            createdAt,
            createdBy,
            isActive,
            isDeleted
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};