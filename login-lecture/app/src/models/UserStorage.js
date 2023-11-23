"use strict";

const db=require("../config/db");

class UserStorage {
    static getUserInfo(tel){
        return new Promise((resolve,reject)=>{
            const query="SELECT * FROM users WHERE tel=?;";
            db.query(query,[tel],(err,data)=>{
                if (err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    } //데이터베이스에 접근 후 정보 반환

    static async save(userInfo){        
        return new Promise((resolve,reject)=>{
            const query="INSERT INTO users(tel) VALUES(?);";
            db.query(query,[userInfo.tel],(err)=>{
                if (err) reject(`${err}`);
                resolve({success:true});
            });
        });
    }
}

module.exports=UserStorage;