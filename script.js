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
    selectedItems.push(itemName);

    const itemContainer = document.createElement('div');
    itemContainer.classList.add('item-container');
    itemContainer.style.display = 'flex';

    const cartItem = document.createElement('span');
    cartItem.textContent = itemName;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '제거';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
      const index = selectedItems.indexOf(itemName);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
      itemContainer.remove();
    });

    itemContainer.appendChild(cartItem);
    itemContainer.appendChild(deleteButton);
    cartItems.appendChild(itemContainer);
  }

  // '담기' 버튼에 대한 이벤트 리스너 등록
  function registerAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const itemName = button.parentElement.querySelector('span').textContent;
        addToCartHandler(itemName);
      });
    });
  }

  // 'cart' 영역의 내용을 초기화하는 함수
  function resetCart() {
    // cartItems를 찾을 때까지 대기
    if (!cartItems) {
      cartItems = document.getElementById('cart-items');
      setTimeout(resetCart, 100); // 100ms 간격으로 재시도
      return;
    }

    selectedItems.length = 0;
    cartItems.innerHTML = '';
  }

  // 메뉴 페이지가 변경될 때 'cart' 영역을 초기화하고 '담기' 버튼에 대한 리스너 등록
  function loadContent(menu) {
    resetCart();

    const contentContainer = document.getElementById('content-container');

    fetch(`${menu}.html`)
      .then(response => response.text())
      .then(html => {
        contentContainer.innerHTML = html;
        registerAddToCartListeners(); // '담기' 버튼에 대한 이벤트 리스너 등록
      })
      .catch(error => console.error('Error fetching content:', error));
  }

  // 초기에 '커피' 페이지의 내용을 로드
  loadContent('coffee');

  // 메뉴 변경 버튼에 대한 이벤트 리스너 등록
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const menu = item.getAttribute('data-menu');
      loadContent(menu);
    });
  });

  // 주문하기 버튼에 대한 이벤트 리스너 등록
  checkoutButton.addEventListener('click', () => {
    const popupContent = selectedItems.length > 0 ? `선택한 메뉴: ${selectedItems.join(', ')}` : '장바구니가 비어 있습니다.';
    popupMessage.textContent = popupContent;
    popup.style.display = 'block';
    confirmPaymentButton.style.display = selectedItems.length > 0 ? 'block' : 'none';
  });

  // 확인 결제 버튼에 대한 이벤트 리스너 등록
  confirmPaymentButton.addEventListener('click', () => {
    if (selectedItems.length > 0) {
      popupMessage.textContent = '결제가 완료되었습니다';
      selectedItems.length = 0; // 선택된 아이템 초기화
      cartItems.innerHTML = ''; // 카트 비우기
      confirmPaymentButton.style.display = 'none'; // 결제 버튼 숨기기
    }
  });

  // 팝업 닫기 버튼에 대한 이벤트 리스너 등록
  closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // '담기' 버튼에 대한 이벤트 리스너 등록
  document.registerAddToCartListeners = function () {
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const itemName = button.parentElement.querySelector('span').textContent;
        addToCartHandler(itemName);
      });
    });
  };

  // 'loadContent' 함수를 전역 스코프에서도 사용 가능하도록 추가
  document.loadContent = function (menu) {
    const contentContainer = document.getElementById('content-container');

    fetch(`${menu}.html`)
      .then(response => response.text())
      .then(html => {
        contentContainer.innerHTML = html;
        document.registerAddToCartListeners(); // '담기' 버튼에 대한 이벤트 리스너 등록
      })
      .catch(error => console.error('Error fetching content:', error));
  };
});
