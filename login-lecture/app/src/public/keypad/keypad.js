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
  
    clearInput();
  }