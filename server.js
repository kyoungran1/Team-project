const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('kiosk', 'user', 'kran1014', {
    host: 'project-kiosk.cqb3xsxdgrxq.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql',
});

const OrderRecord = sequelize.define('orders', {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    users_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

sequelize.sync()
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

app.post('/api/orders', async (req, res) => {
    console.log('Received a POST request to /api/orders');
    try {
        const { users_id, order_menu_id, order_price } = req.body;

        const order = await OrderRecord.create({
            users_id,
            order_menu_id,
            order_price,
        });

        console.log('Order saved successfully:', order);

        res.json({ success: true, message: '주문이 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ success: false, message: '주문 저장 중 오류가 발생했습니다.' });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await OrderRecord.findAll();
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: '주문 목록 조회 중 오류가 발생했습니다.' });
    }
});

app.get('/api/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await OrderRecord.findByPk(orderId);

        if (!order) {
            res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
            return;
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: '주문 조회 중 오류가 발생했습니다.' });
    }
});

// 에러 핸들러 미들웨어로 등록
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
