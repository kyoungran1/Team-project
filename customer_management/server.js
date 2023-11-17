const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

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

const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('kiosk', 'user', 'kran1014', {
    host: 'project-kiosk.cqb3xsxdgrxq.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql',
});

// 사용자 정보 모델에 phone_number 추가
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

sequelize.sync({ alter: true})
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// 사용자 등록 부분 수정
app.post('/api/users', async (req, res) => {
    console.log('Received a POST request to /api/users');
    try {
        const { phone_number } = req.body;

        // phone_number만 사용하여 사용자 생성
        const user = await User.create({
            phone_number,
        });

        console.log('User saved successfully:', user);

        res.json({ success: true, message: '사용자가 성공적으로 등록되었습니다.' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ success: false, message: '사용자 등록 중 오류가 발생했습니다.' });
    }
});

// 사용자 목록 조회 부분 추가
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: '사용자 목록 조회 중 오류가 발생했습니다.' });
    }
});

// 사용자 조회 부분 추가
app.get('/api/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: '사용자 조회 중 오류가 발생했습니다.' });
    }
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'project/customer_management')));

// 수정: 루트 경로에 대한 요청 처리
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'new_customer.html'));
});

// 추가: /customer.js 경로에 대한 요청 처리
app.get('/customer.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'customer.js'));
});

// 에러 처리 미들웨어
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다.', error: error.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});