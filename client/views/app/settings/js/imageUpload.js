(() => {
  Array(6).fill().map((_, index) => {
    const customButton = document.querySelector(`.custom-button-${index}`);
    const imagePreview = document.querySelector(`.image-preview-${index}`);
    const removeImageButton = document.querySelector(`.remove-image-${index}`);
    const photoUrl = imagePreview.getAttribute(`data-photo-${index}`)

    if (photoUrl !== 'undefined') {
      imagePreview.src = photoUrl;
      imagePreview.style.display = 'block';
      customButton.style.display = 'none';
      removeImageButton.style.display = 'block';
    } else {
      customButton.style.display = 'block';
    }
  });
})();

Array(6).fill().map((_, index) => {
  const image = document.querySelector(`.image-${index}`);
  const customButton = document.querySelector(`.custom-button-${index}`);
  const imageUpload = document.querySelector(`.image-upload-${index}`);
  const imagePreview = document.querySelector(`.image-preview-${index}`);
  const removeImageButton = document.querySelector(`.remove-image-${index}`);
  const processingBar = document.querySelector(`.processing-bar-${index}`);
  const successBox = document.querySelector(`.success-box-${index}`);
  const imageUploadContainerWidth = document.querySelector('.image-upload-container').offsetWidth;
  const displayImage = `display-image-${index}`;

  customButton.addEventListener('click', () => {
    if (image.value) image.value = '';
    image.click();
  });

  image.addEventListener('change', event => {
    const uploadedFile = URL.createObjectURL(event.target.files[0]);
    imagePreview.src = uploadedFile;
    imagePreview.style.display = 'block';
    customButton.style.display = 'none';
    imageUpload.classList.add(displayImage);

    let width = 1;
    let identity = setInterval(frame, 10);

    function frame() {
      if (width < imageUploadContainerWidth - 19) {
        width++;
        processingBar.style.width = `${width}px`;
      } else {
        clearInterval(identity);
        document.querySelector(`.${displayImage}`).style.opacity = 1;
        successBox.style.display = 'inline-block';
        processingBar.style.transition = '0.75s';
        processingBar.style.transitionDelay = '2.25s';
        processingBar.style.opacity = 0;
        setTimeout(() => {
          successBox.style.display = 'none';
          removeImageButton.style.display = 'block';
        }, 3000);
      }
    }
  });

  removeImageButton.addEventListener('click', event => {
    imagePreview.src = 'undefined';
    imagePreview.style.display = 'none';
    imageUpload.classList.remove(displayImage);
    customButton.style.display = 'block';

    processingBar.style.opacity = '';
    processingBar.style.transition = '';
    processingBar.style.width = '';

    removeImageButton.style.display = 'none';
  });
});
