// window.onload = () => {
//   const myMatchDisplayToast = localStorage.getItem('my_match_display_toast');

//   if (myMatchDisplayToast) {
//     const toastData = JSON.parse(myMatchDisplayToast);
//     localStorage.removeItem('my_match_display_toast');

//     setTimeout(() => {
//       const toastElement = getQuerySelector('.toast');
//       const toastMessage = getQuerySelector('.toast-message');

//       toastElement.classList.add('show-toast');
//       toastElement.classList.add('toast-success');

//       if (toastData.type === 'success') {
//         toastElement.classList.add('toast-success');
//       } else (
//         toastElement.classList.add('toast-error')
//       )

//       toastMessage.innerHTML = toastData.message;

//       setTimeout(() => {
//         toastElement.classList.remove('show-toast');
//       }, 3000)
//     })
//   }
// }
