document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();

    document.getElementById('userForm').addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser();
    });
});

async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:4000/api/users');
        const data = await response.json();

        if (data.success) {
            displayUsers(data.users);
        } else {
            console.error('Error fetching users:', data.message);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function registerUser() {
    const phoneNumber = document.getElementById('phoneNumber').value;

    try {
        const response = await fetch('http://localhost:4000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: phoneNumber }),
        });
        const data = await response.json();

        if (data.success) {
            console.log('User registered successfully:', data.message);
            fetchUsers();  // 등록 후에 fetchUsers 호출
        } else {
            console.error('Error registering user:', data.message);
        }
    } catch (error) {
        console.error('Error registering user:', error);
    }
}


function displayUsers(users) {
    const userList = document.getElementById('users');
    userList.innerHTML = '';

    users.forEach((user) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.phoneNumber}`;
        userList.appendChild(listItem);
    });
}