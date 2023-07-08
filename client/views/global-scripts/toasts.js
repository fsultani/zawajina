const toast = (type, message) => {
  const toastElement = getQuerySelector('.toast');
  const toastMessage = getQuerySelector('.toast-message');

  toastElement.classList.add('show-toast');
  toastElement.classList.add('toast-success');

  if (type === 'success') {
    toastElement.classList.add('toast-success');
  } else (
    toastElement.classList.add('toast-error')
  )

  toastMessage.innerHTML = message;

  setTimeout(() => {
    toastElement.classList.remove('show-toast');
  }, 3000)
}

const toastOnPageReload = (type, message) => {
  localStorage.setItem('my_match_display_toast', JSON.stringify({ type, message }));
  location.reload();
}
