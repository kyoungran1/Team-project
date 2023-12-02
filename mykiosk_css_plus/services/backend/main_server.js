const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // 추가: CORS 미들웨어를 사용하기 위한 모듈 추가

const app = express();
const path = require('path');


app.use(express.static('PROJECT'));
app.use(cors()); // 추가: CORS 미들웨어를 사용

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, '..', '..', 'ui', 'frontend', 'project')));

// 기본 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'ui', 'frontend', 'project', 'index.html'));
});

const port = 5000;

const connection = mysql.createConnection({
  host: 'mykios.cqb3xsxdgrxq.ap-northeast-2.rds.amazonaws.com',
  user: 'user',
  password: 'kran1014',
  database: 'mykios',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(bodyParser.json());

app.post('/api/placeOrder', (req, res) => {
  const orders = req.body;

  orders.forEach(order => {
    const { name, quantity } = order;
    connection.query(
      'INSERT INTO order_history (item_name, quantity) VALUES (?, ?)',
      [name, quantity],
      (err, results) => {
        if (err) {
          console.error('Error inserting order:', err);
          res.status(500).send('Error placing order');
        } else {
          console.log('Order inserted:', results);
        }
      }
    );
  });

  res.json({ message: 'Orders placed successfully' });
});

// 추가: 결제 확인을 위한 엔드포인트
app.get('/api/confirmPayment', (req, res) => {
  res.json({ message: 'Payment confirmed successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  connection.end();
  process.exit();
});

module.exports = app;