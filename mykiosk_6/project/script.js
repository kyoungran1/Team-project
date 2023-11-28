let selectedItems = [];
let popupMessage;
let confirmPaymentButton;

// 추천 메뉴를 가져오는 함수 (임의의 로직으로 대체)
function getRecommendedMenu() {
  const menuList = ['새로운 아이스 커피', '특별한 디저트', '신선한 과일 차', '프리미엄 블렌드'];
  const randomIndex = Math.floor(Math.random() * menuList.length);
  return menuList[randomIndex];
}

function orderMenu() {
  // 여기서 신메뉴를 추천하는 로직을 추가합니다.
  const recommendedMenu = getRecommendedMenu(); // 추천 메뉴를 가져오는 함수

  // 모달 팝업을 열고 추천 내용을 표시합니다.
  alert(`추천 메뉴: ${recommendedMenu}`);
}

let isFirstOrder = true; // 추가된 변수

function sendOrderToServer() {
  fetch('/api/placeOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedItems),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Order placed successfully:', data);
      // 서버로부터 응답 받은 후에 팝업 업데이트
      const popupContent = selectedItems.length > 0 ? `선택한 메뉴: ${selectedItems.map(item => `${item.name} x${item.quantity}`).join(', ')}` : '장바구니가 비어 있습니다.';
      popupMessage.textContent = popupContent;
      popup.style.display = 'block';
      confirmPaymentButton.style.display = selectedItems.length > 0 ? 'block' : 'none';

      // 변경된 부분: 첫 번째 주문일 때만 추천 메뉴 표시
      if (selectedItems.length > 0 && isFirstOrder) {
        orderMenu();
        isFirstOrder = false; // 더 이상 첫 번째 주문이 아님을 표시
      }
    })
    .catch(error => {
      console.error('Error placing order:', error);
    });
}



document.addEventListener('DOMContentLoaded', () => {
  let cartItems = document.getElementById('cart-items');
  const checkoutButton = document.getElementById('checkout-button');
  const popup = document.getElementById('popup');
  popupMessage = document.getElementById('popup-message');
  const closePopupButton = document.getElementById('close-popup');
  confirmPaymentButton = document.getElementById('confirm-payment');


  // 초기화된 변수들

  // '담기' 버튼에 대한 공통 이벤트 리스너
  function addToCartHandler(itemName) {
    console.log('담기 버튼 클릭됨');

    // 수량 관리
    const existingItem = selectedItems.find(item => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      selectedItems.push({ name: itemName, quantity: 1 });
    }

    // UI 업데이트
    updateCartUI();

    // 추가: 서버로 주문 정보 전송
    sendOrderToServer(selectedItems);
  }

  // 추가: 결제 확인
  function confirmPayment() {
    if (selectedItems.length > 0) {
      // 결제 완료 후 서버로부터 응답을 받아 팝업 업데이트
      fetch('/api/confirmPayment')
      .then(response => response.json())
      .then(data => {
        console.log('Payment confirmed:', data);
        popupMessage.textContent = '결제가 완료되었습니다';
        selectedItems.length = 0; // 선택된 아이템 초기화
        updateCartUI(); // 카트 UI 업데이트
        confirmPaymentButton.style.display = 'none'; // 결제 버튼 숨기기
      })
      .catch(error => {
        console.error('Error confirming payment:', error);
      });
    }
  }

  // 'cart' 영역의 내용을 업데이트하는 함수
  function updateCartUI() {
    cartItems.innerHTML = ''; // 현재 내용 삭제

    selectedItems.forEach(item => {
      const itemContainer = document.createElement('div');
      itemContainer.classList.add('item-container');
      itemContainer.style.display = 'flex';

      const cartItem = document.createElement('span');
      cartItem.textContent = `${item.name} - 수량: ${item.quantity}`;

      const increaseButton = createButton('+', () => {
        item.quantity += 1;
        updateCartUI();
      });

      const decreaseButton = createButton('-', () => {
        if (item.quantity > 1) {
          item.quantity -= 1;
          updateCartUI();
        }
      });

      const deleteButton = createButton('제거', () => {
        const index = selectedItems.findIndex(i => i.name === item.name);
        if (index > -1) {
          selectedItems.splice(index, 1);
        }
        updateCartUI();
      });

      itemContainer.appendChild(cartItem);
      itemContainer.appendChild(decreaseButton);
      itemContainer.appendChild(increaseButton);
      itemContainer.appendChild(deleteButton);
      cartItems.appendChild(itemContainer);
    });
  }

  function loadContent(menu) {
    const contentContainer = document.getElementById('content-container');
  
    fetch(`${menu}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        contentContainer.innerHTML = html;
        registerAddToCartListeners(); // 새로운 콘텐츠에 대한 이벤트 리스너 등록
      })
      .catch(error => console.error('Error fetching content:', error));
  }
  

  // 'loadContent' 함수를 전역 스코프에서도 사용 가능하도록 추가
  document.loadContent = loadContent;

  // '담기' 버튼에 대한 이벤트 리스너 등록
  function registerAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const itemName = button.parentElement.querySelector('span').textContent;
        addToCartHandler(itemName);
      });
    });
  }

// 'checkout' 버튼에 대한 이벤트 리스너 등록
checkoutButton.addEventListener('click', () => {
  // 서버로 주문 정보 전송
  fetch('http://localhost:5000/api/placeOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedItems),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Order placed successfully:', data);
      // 서버로부터 응답 받은 후에 팝업 업데이트
      const popupContent = selectedItems.length > 0 ? `선택한 메뉴: ${selectedItems.map(item => `${item.name} x${item.quantity}`).join(', ')}` : '장바구니가 비어 있습니다.';
      popupMessage.textContent = popupContent;
      popup.style.display = 'block';
      confirmPaymentButton.style.display = selectedItems.length > 0 ? 'block' : 'none';
      
      if (selectedItems.length > 0) {
        // 주문하기 버튼을 눌렀을 때만 추천 메뉴 표시
        orderMenu();
      }
    })
    .catch(error => {
      console.error('Error placing order:', error);
    });
});


  // 확인 결제 버튼에 대한 이벤트 리스너 등록
    confirmPaymentButton.addEventListener('click', () => {
      if (selectedItems.length > 0) {
        popupMessage.textContent = '결제가 완료되었습니다';
        selectedItems.length = 0; // 선택된 아이템 초기화
        updateCartUI(); // 카트 UI 업데이트
        confirmPaymentButton.style.display = 'none'; // 결제 버튼 숨기기
      }
    });


  // 팝업 닫기 버튼에 대한 이벤트 리스너 등록
  closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // 초기에 '커피' 페이지의 내용을 로드
  loadContent('coffee');

  // 메뉴 변경 버튼에 대한 이벤트 리스너 등록
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const menu = item.getAttribute('data-menu');
      loadContent(menu);
    });
  });

  // '담기' 버튼에 대한 이벤트 리스너 등록
  document.registerAddToCartListeners = registerAddToCartListeners;

  // 추가: 버튼을 생성하는 함수
  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('quantity-button');
    button.addEventListener('click', onClick);
    return button;
  }
});