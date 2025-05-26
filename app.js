require('dotenv/config');
const express = require('express');
const { sequelize } = require('./api/config/database.js');
const { router } = require('./api/routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const { bootstrap } = require('./api/config/bootstrap.js');
const { startCronJobs } = require('./api/config/cron/index.js');
const { Pool } = require('pg');

try {
    const app = express();

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    sequelize.sync().then(() => {
        console.log("Database synced successfully.");
    }).catch((err) => {
        console.error("Error syncing database:", err);
    });

    app.use(cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    }));

    app.use('/', router);

    bootstrap();
    startCronJobs();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log("Server running on http://localhost:5000");
    });

} catch (error) {
    console.log(error);
    throw new Error(error);
}