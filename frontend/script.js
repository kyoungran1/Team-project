document.addEventListener('DOMContentLoaded', () => {
  let cartItems = document.getElementById('cart-items');
  const checkoutButton = document.getElementById('checkout-button');
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  const closePopupButton = document.getElementById('close-popup');
  const confirmPaymentButton = document.getElementById('confirm-payment');

  // 초기화된 변수들
  let selectedItems = [];

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

      const increaseButton = document.createElement('button');
      increaseButton.textContent = '+';
      increaseButton.classList.add('quantity-button');
      increaseButton.addEventListener('click', () => {
        item.quantity += 1;
        updateCartUI();
      });

      const decreaseButton = document.createElement('button');
      decreaseButton.textContent = '-';
      decreaseButton.classList.add('quantity-button');
      decreaseButton.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity -= 1;
          updateCartUI();
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '제거';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', () => {
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

  // 'loadContent' 함수 업데이트
  function loadContent(menu) {
    const contentContainer = document.getElementById('content-container');

    fetch(`${menu}.html`)
      .then(response => response.text())
      .then(html => {
        contentContainer.innerHTML = html;
        registerAddToCartListeners();
      })
      .catch(error => console.error('Error fetching content:', error));
  }

  // 'checkout' 버튼에 대한 이벤트 리스너 등록
  checkoutButton.addEventListener('click', () => {
    const popupContent = selectedItems.length > 0 ? `선택한 메뉴: ${selectedItems.map(item => `${item.name} x${item.quantity}`).join(', ')}` : '장바구니가 비어 있습니다.';
    popupMessage.textContent = popupContent;
    popup.style.display = 'block';
    confirmPaymentButton.style.display = selectedItems.length > 0 ? 'block' : 'none';
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
});
