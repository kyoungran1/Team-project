// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const sequelize = new Sequelize('mykios', 'user', 'kran1014', {
    host: 'mykios.cqb3xsxdgrxq.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql',
});

const Menu = sequelize.define('menus', {
    menu_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    menu_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    menu_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    menu_explain: {
        type: DataTypes.STRING,
    },
    menu_category: {
        type: DataTypes.STRING,
    },
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// 메뉴 조회 엔드포인트
app.get('/api/menus', async (req, res) => {
    try {
        const menus = await Menu.findAll();
        res.json({ success: true, menus });
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ success: false, message: '메뉴 조회 중 오류가 발생했습니다.' });
    }
});

// 메뉴 추가 엔드포인트
app.post('/api/menus', async (req, res) => {
    try {
        const { menu_title, menu_price, menu_explain, menu_category } = req.body;

        const menu = await Menu.create({
            menu_title,
            menu_price,
            menu_explain,
            menu_category,
        });

        console.log('Menu added successfully:', menu);

        res.json({ success: true, message: '메뉴가 성공적으로 추가되었습니다.' });
    } catch (error) {
        console.error('Error adding menu:', error);
        res.status(500).json({ success: false, message: '메뉴 추가 중 오류가 발생했습니다.' });
    }
});

app.use(express.static(path.join(__dirname, 'menus')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

app.get('/MenuComponent.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'MenuComponent.js'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});