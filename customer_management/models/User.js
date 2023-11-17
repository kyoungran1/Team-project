// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('customer_management/server'); // 경로에 따라 수정

const User = sequelize.define('user', {
    users_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = User;
