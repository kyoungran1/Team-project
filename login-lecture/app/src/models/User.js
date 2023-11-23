"use strict";

const UserStorage=require("./UserStorage");

class User{
    constructor(body) {
        this.body=body;
    }

    async login(){
        const client=this.body;
        try{
            const {tel}=await UserStorage.getUserInfo(client.tel);

            if (tel){
                if (tel===client.tel){
                    return {success:true};
                }
                // return {success:false,msg:"비밀번호가 틀렸습니다."};
            }
            return {success:false,msg:"존재하지 않는 전화번호입니다."};
        } catch (err){
            return {success:false,err};
        }
    }

    async register(){
        const client=this.body;
        try{
            const response=await UserStorage.save(client);
            return response;
        }   catch (err){
            return {success:false,err};
        }
    }
}

module.exports=User;