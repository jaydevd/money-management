const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');

const Admin = sequelize.define("Admin", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING(100),
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(200),
        allowNull: true,
        unique: true,
    },
    tokenExpiry: {
        field: 'token_expiry',
        type: DataTypes.INTEGER
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    ...commonAttributes
},
    {
        tableName: "admins",
        timestamps: false
    }
);

module.exports = { Admin };