// models/OrderRecord.js
const { DataTypes } = require('sequelize');
const sequelize = require('customer_management/server'); // 경로에 따라 수정

const OrderRecord = sequelize.define('order', {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },
});

module.exports = OrderRecord;
