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

// Login route
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

// Registration route
app.post('/register', async (req, res) => {
    try {
        const phone = req.body.phone || req.query.registerPhone;
        console.log('Received phone:', phone);

        const sql = 'INSERT INTO users (phone) VALUES (?)';
        console.log(sql);

        await executeQuery(sql, [phone]);
        console.log('User registered successfully');
        // Redirect URL on successful registration
        res.status(200).json({ message: 'User registered successfully', redirectTo: '/login.html' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});

// Serving static files
app.use(express.static(path.join(__dirname, '..', '..' , 'ui', 'frontend', 'auth')));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..' , 'ui', 'frontend', 'auth', 'index.html'));
});

// Login page route
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..' , 'ui', 'frontend', 'auth', 'login.html'));
});

// Registration page route
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..' , 'ui', 'frontend', 'auth', 'register.html'));
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
