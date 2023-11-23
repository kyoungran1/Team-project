"use strict";

const tel = document.querySelector("#numberInput"),
    loginBtn=document.querySelector("#button");

loginBtn.addEventListener("click",login);

function login(){
    if (!tel.value) return alert("전화번호를 입력해주십시오.");
    
    const req={
        tel: tel.value,
    };
    
    fetch("/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req), //데이터 전달
    })
        .then((res)=>res.json())
        .then((res)=> {
            if (res.success){
                location.href="/";
            } else {
                if (res.err) return alert(res.err);
                alert("res.msg");
            }    
        })
        .catch((err) => {
            console.error("로그인 중 에러 발생");
        });
}