const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// 이후 라우팅 및 데이터베이스 연결 등을 추가합니다.
