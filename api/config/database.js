const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(process.env.DB_URL, {
//     dialect: process.env.DB_DIALECT,
//     protocol: "postgres",
//     logging: false,
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false, // Needed for Render's SSL
//         }
//     }
// });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
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