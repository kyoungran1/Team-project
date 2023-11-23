const mysql=require("mysql");

const db=mysql.createConnection({
    host:"mykios.cqb3xsxdgrxq.ap-northeast-2.rds.amazonaws.com",
    user:"user",
    password:"kran1014",
    database:"mykios",
});

db.connect();

module.exports=db;