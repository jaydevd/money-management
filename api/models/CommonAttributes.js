const { DataTypes } = require("sequelize");

const commonAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    isActive: {
        field: 'is_active',
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isDeleted: {
        field: 'is_deleted',
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.INTEGER,
        field: 'created_at',
        allowNull: false
    },
    createdBy: {
        field: 'created_by',
        type: DataTypes.STRING(100),
        allowNull: false
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.INTEGER,
    },
    updatedBy: {
        field: 'updated_by',
        type: DataTypes.STRING(100)
    }
}

module.exports = {
    commonAttributes
}