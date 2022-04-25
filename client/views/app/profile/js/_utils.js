const getQuerySelector = selector => document.querySelector(selector);

(() => {
  document.querySelector('body').style.backgroundColor = '#f7f7f7';

  const profileIsUpdated = localStorage.getItem('my_match_profile_update');

  if (profileIsUpdated) {
    const toast = document.querySelector('.toast');
    const toastMessage = document.querySelector('.toast-message');
    toast.classList.add('show-toast')
    toast.classList.add('toast-success')
    toastMessage.innerHTML = 'Profile successfully updated!';
    setTimeout(() => {
      toast.classList.remove('show-toast')
      localStorage.removeItem('my_match_profile_update');
    }, 3000);
  }
})();
