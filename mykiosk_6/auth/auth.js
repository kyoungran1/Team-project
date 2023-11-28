// auth.js

document.addEventListener('DOMContentLoaded', function () {
    let isFirstLogin = true;

    function handleFormSubmit(event) {
        event.preventDefault();

        const phone = document.getElementById('phone').value;

        fetch(isFirstLogin ? '/register' : '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);

            if (isFirstLogin) {
                // 회원가입 성공 시 로그인 폼으로 전환
                document.getElementById('loginForm').reset();
                document.getElementById('registerForm').style.display = 'none';
                document.getElementById('loginForm').style.display = 'block';
                isFirstLogin = false;
            } else {
                // 로그인 성공 시 메뉴로 이동
                window.location.href = '/menu.html';
            }
        })
        .catch(error => console.error('Error:', error));
    }

    document.getElementById('loginForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('registerForm').addEventListener('submit', handleFormSubmit);
});
