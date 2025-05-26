const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: process.env.DB_DIALECT,
    protocol: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Needed for Render's SSL
        }
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error("Unable to connect the database.", error);
    }
}
connectDB();

module.exports = { sequelize };