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
        type: DataTypes.ENUM(USER_TYPE.LENDER, USER_TYPE.BORROWER)
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
    address: {
        type: DataTypes.TEXT
    },
    interestRate: {
        field: 'interest_rate',
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    ...commonAttributes
},
    {
        tableName: "users",
        timestamps: false
    }
);

module.exports = { User };