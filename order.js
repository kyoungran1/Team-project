async function submitOrder(orderData) {
    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (result.success) {
            console.log('주문이 성공적으로 저장되었습니다.');
        } else {
            console.error('주문 저장 실패:', result.message);
        }
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
    }
}

const orderData = {
    users_id: 1,          // 사용자 ID (로그인 등의 방법으로 얻어와야 함)
    order_menu_id: 2,     // 주문한 메뉴의 ID
    order_price: 15000,   // 주문한 메뉴의 가격
};

submitOrder(orderData);