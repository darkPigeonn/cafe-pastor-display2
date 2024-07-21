import { ref } from 'vue';

const showAlert = ref(false);
const alertMessage = ref('');

function setAlert(show, message) {
    console.log('jalan');
  showAlert.value = show;
  alertMessage.value = message;
  console.log(alertMessage);
}

export { showAlert, alertMessage, setAlert };
