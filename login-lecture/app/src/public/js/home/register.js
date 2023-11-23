"use strict";

const tel = document.querySelector("#numberInput"),
    registerBtn=document.querySelector("#button");

registerBtn.addEventListener("click",register);

// function confirmtel() {
//     const tel = document.getElementById('tel').value.trim();

//     // 팝업창 표시
//     const isConfirmed = window.confirm(`위 번호가 맞습니까?\n${tel}`);
    
//     if (isConfirmed) {
//         // 예 버튼 클릭 시 동작
//         alert('계정이 생성되었습니다.');
//         resetInput();
//         return true; // 폼 전송 허용
//     } else {
//         // 아니요 버튼 클릭 시 동작
//         return false; // 폼 전송 차단
//     }
// }

function resetInput() {
    document.getElementById('tel').value = '';}

function register(){
    if (!tel.value) return alert("전화번호를 입력해주십시오.");

    const req={
        tel:tel.value,
    };
    
    fetch("/register",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req), //데이터 전달
    })
        .then((res)=>res.json())
        .then((res)=> {
            if (res.success){
                location.href="/login";
            } else {
                if (res.err) return alert(res.err);
                alert(res.msg);
            }    
        })
        .catch((err) => {
            console.error("회원가입 중 에러 발생");
        });
}
 

