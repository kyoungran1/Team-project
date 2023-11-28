function appendNumber(number) {
  var numberInput = document.getElementById('numberInput');
  numberInput.value += number;
}

function clearInput() {
  var numberInput = document.getElementById('numberInput');
  numberInput.value = '';
}

function savePhoneNumber() {
  var numberInput = document.getElementById('numberInput');
  var phoneNumber = numberInput.value;
  console.log('Saving phone number:', phoneNumber);

  // 여기서 실제로 서버에 저장하도록 하는 코드를 추가해야 합니다.
  // 예를 들어, AJAX 요청을 사용하여 서버와 통신하거나
  // 서버에서 제공하는 API를 호출하여 데이터를 저장할 수 있습니다.

  // 입력된 번호 초기화
  clearInput();
}