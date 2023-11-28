document.addEventListener('DOMContentLoaded', () => {
    fetchMenus();

    document.getElementById('menuForm').addEventListener('submit', (event) => {
        event.preventDefault();
        addMenu();
    });
});

async function fetchMenus() {
    try {
        const response = await fetch('/api/menus'); // 수정: 상대 경로로 엔드포인트 지정
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
        listItem.textContent = `${menu.menu_title} - ${menu.menu_explain || 'No description'} - $${menu.menu_price.toFixed(2)}`;
        menuList.appendChild(listItem);
    });
}

async function addMenu() {
    const title = document.getElementById('menuTitle').value;
    const price = document.getElementById('menuPrice').value;
    const explain = document.getElementById('menuExplain').value;
    const category = document.getElementById('menuCategory').value;

    try {
        const response = await fetch('/api/menus', { // 수정: 상대 경로로 엔드포인트 지정
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ menu_title: title, menu_price: parseInt(price), menu_explain: explain, menu_category: category }),
        });
        const data = await response.json();

        if (data.success) {
            fetchMenus();  // Refresh menu list
            console.log('Menu added successfully:', data.message);
        } else {
            console.error('Error adding menu:', data.message);
        }
    } catch (error) {
        console.error('Error adding menu:', error);
    }
}
