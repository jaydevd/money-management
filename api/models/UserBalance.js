const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');

const UserBalance = sequelize.define("UserBalance", {
    user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: "users",
            key: 'id'
        }
    },
    totalAmount: {
        field: 'total_amount',
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    amountPaid: {
        field: 'amount_paid',
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    },
    amountReceived: {
        field: 'amount_received',
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    },
    remainingAmount: {
        field: 'remaining_amount',
        type: DataTypes.DECIMAL(10, 2)
    },
},
    {
        tableName: "user_balance",
        timestamps: false
    }
);

module.exports = { UserBalance };