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
                // 회원가입 성공 시 바로 로그인 페이지로 이동
                window.location.href = '/login.html';
            } else {
                // 로그인 성공 시 리다이렉션 처리
                window.location.href = 'http://localhost:5000'; // 여기를 원하는 주소로 변경
            }
        })
        .catch(error => console.error('Error:', error));
    }

    document.getElementById('loginForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('registerForm').addEventListener('submit', handleFormSubmit);
});
