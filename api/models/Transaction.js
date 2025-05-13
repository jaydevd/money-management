const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');
const { TRANSACTION_TYPE } = require("../config/constants");

const Transaction = sequelize.define("Transaction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM(TRANSACTION_TYPE.BORROWED, TRANSACTION_TYPE.LENDED, TRANSACTION_TYPE.PAID, TRANSACTION_TYPE.RECEIVED)
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},
    {
        tableName: "transactions",
        timestamps: false
    }
);

module.exports = { Transaction };