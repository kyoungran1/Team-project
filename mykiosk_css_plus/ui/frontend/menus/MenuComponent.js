document.addEventListener('DOMContentLoaded', () => {
    fetchMenus();

    document.getElementById('menuForm').addEventListener('submit', (event) => {
        event.preventDefault();
        addMenu();
    });

    // 이전 페이지로 이동 버튼에 이벤트 리스너 추가
    document.getElementById('goBackButton').addEventListener('click', () => {
        window.location.href = 'http://localhost:5000/';
    });
});

async function fetchMenus() {
    try {
        const response = await fetch('http://localhost:4000/api/menus'); // 수정
        const data = await response.json();

        if (data.success) {
            displayMenus(data.menus);
        } else {
            console.error('Error fetching menu:', data.message);
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

function displayMenus(menus) {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = '';

    menus.forEach((menu) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${menu.menu_title} - ${menu.menu_explain || 'No description'} - $${menu.menu_price.toFixed(2)}`; // 수정
        menuList.appendChild(listItem);
    });
}

async function addMenu() {
    const title = document.getElementById('menuTitle').value;
    const price = document.getElementById('menuPrice').value;
    const explain = document.getElementById('menuExplain').value;
    const category = document.getElementById('menuCategory').value;

    try {
        const response = await fetch('http://localhost:4000/api/menus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ menu_title: title, menu_price: parseInt(price), menu_explain: explain, menu_category: category }),
        });
        const data = await response.json();

        if (data.success) {
            // 수정된 부분: 페이지 이동 없이 데이터베이스에 저장만 함
            fetchMenus();  // Refresh menu list
            console.log('Menu added successfully:', data.message);
        } else {
            console.error('Error adding menu:', data.message);
        }
    } catch (error) {
        console.error('Error adding menu:', error);
    }
}
