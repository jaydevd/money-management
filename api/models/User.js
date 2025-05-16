const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');
const { USER_TYPE } = require("../config/constants");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM(USER_TYPE.LENDER, USER_TYPE.BORROWER),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING(100),
    },
    address: {
        type: DataTypes.TEXT
    },
    ...commonAttributes
},
    {
        tableName: "users",
        timestamps: false
    }
);

module.exports = { User };