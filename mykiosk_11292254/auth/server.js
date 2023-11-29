const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const pool = mysql.createPool({
    host: 'mykios.cqb3xsxdgrxq.ap-northeast-2.rds.amazonaws.com',
    user: 'user',
    password: 'kran1014',
    database: 'mykios',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const executeQuery = async (sql, values) => {
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.execute(sql, values);
        return rows;
    } finally {
        connection.release();
    }
};

// 로그인 라우트
app.post('/login', async (req, res) => {
    try {
        const { phone } = req.body;
        const sql = 'SELECT * FROM users WHERE phone = ?';
        const result = await executeQuery(sql, [phone]);

        if (result.length > 0) {
            console.log('Login successful');
            res.status(200).json({ message: 'Login successful', redirectTo: 'http://localhost:5000' });
        } else {
            console.log('Invalid phone number');
            res.status(401).json({ error: 'Invalid phone number' });
        }
    } catch (error) {
        console.log('Error logging in:', error.message);
        res.status(500).json({ error: 'Error logging in' });
    }
});



// 회원가입 라우트
app.post('/register', async (req, res) => {
    try {
        const phone = req.body.phone || req.query.registerPhone;
        console.log('Received phone:', phone);

        const sql = 'INSERT INTO users (phone) VALUES (?)';
        console.log(sql);

        await executeQuery(sql, [phone]);
        console.log('User registered successfully');
        // 회원가입 성공 시 리다이렉션 URL 전송
        res.status(200).json({ message: 'User registered successfully', redirectTo: '/login.html' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});

// 기본 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 로그인 페이지 라우트
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 회원가입 페이지 라우트
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// 정적 파일 서빙
app.use(express.static('auth'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
