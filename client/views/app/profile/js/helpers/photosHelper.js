const photosHelper = () => {
  Array(6).fill().map((_, index) => {
    const image = getQuerySelector(`.image-${index}`);
    let imagePreview = getQuerySelector(`.image-preview-${index}`);
    let customButton = getQuerySelector(`.custom-button-${index}`);
    const imageUpload = getQuerySelector(`.image-upload-${index}`);
    let removeImageButton = getQuerySelector(`.remove-image-${index}`);
    const processingBar = getQuerySelector(`.processing-bar-${index}`);
    // const successBox = getQuerySelector(`.success-box-${index}`);
    const imageUploadContainer = getQuerySelector('.image-upload-container');

    const removeImageButtonStyles = {
        height: "24px",
        width: "24px",
        background: "#727272",
        border: 'none',
        borderRadius: "30px",
        boxShadow: '0 1px 2px rgb(0, 0, 0, 0.7)',
        position: "absolute",
        bottom: "-8px",
        right: "-8px",
      };

    if (imagePreview) {
      Object.assign(imagePreview.style, {
        width: '150px',
        height: '150px',
        borderRadius: '12px',
        objectFit: 'cover',
      });

      Object.assign(removeImageButton.style, removeImageButtonStyles)

      removeImageButton.addEventListener("mouseover", () => {
        Object.assign(removeImageButton.style, {
          cursor: "pointer",
          background: "#5b5b5b",
          border: "none",
          transition: '0.2s',
        });
      });

      removeImageButton.addEventListener("mouseleave", () => {
        Object.assign(removeImageButton.style, removeImageButtonStyles)
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
    } else {
      // const customButton = getQuerySelector(`.custom-button-${index}`);
      const imageUploadWrapper = getQuerySelector(`.image-upload-wrapper-${index}`);

      const customButtonStyles = {
        width: "100%",
        height: "100%",
        color: "#fff",
        backgroundColor: "#d3d3d3",
        borderRadius: "12px",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgb(0, 0, 0, 0.7)",
        opacity: 1,
      }

      Object.assign(customButton.style, customButtonStyles);
      Object.assign(imageUploadWrapper.style, {
        width: "100%",
        height: "100%",
      });

      customButton.addEventListener("mouseover", () => {
        Object.assign(customButton.style, {
          opacity: 0.8,
        });
      });

      customButton.addEventListener("mouseleave", () => {
        Object.assign(customButton.style, customButtonStyles)
      });

      customButton.addEventListener('click', () => {
        if (image.value) image.value = '';
        image.click();
      });

      image.addEventListener('change', event => {
        const uploadedFile = URL.createObjectURL(event.target.files[0]);
        imageUploadWrapper.innerHTML = `
          <div class="image-upload-${index}">
            <img src="${uploadedFile}" class="image-preview-${index}" />
          </div>
          <button class="remove-image-${index}"></button>
          <div class="processing-bar-${index}"></div>
          <div class="success-box-${index}"></div>
        `;
        imagePreview = getQuerySelector(`.image-preview-${index}`);
        removeImageButton = getQuerySelector(`.remove-image-${index}`);

        Object.assign(imagePreview.style, {
          width: '150px',
          height: '150px',
          borderRadius: '12px',
          objectFit: 'cover',
        });

        Object.assign(removeImageButton.style, removeImageButtonStyles)

        // imagePreview.src = uploadedFile;
        // imagePreview.style.display = 'block';
        // customButton.style.display = 'none';
        // imageUpload.classList.add(`display-image-${index}`);

        // let width = 1;
        // let identity = setInterval(frame, 10);
        // function frame() {
        //   if (width < imageUploadContainer - 19) {
        //     width++;
        //     processingBar1.style.width = `${width}px`;
        //   } else {
        //     clearInterval(identity);
        //     document.querySelector('.display-image-0').style.opacity = 1;
        //     successBox1.style.display = 'inline-block';
        //     processingBar1.style.transition = '0.75s';
        //     processingBar1.style.transitionDelay = '2.25s';
        //     processingBar1.style.opacity = 0;
        //     setTimeout(() => {
        //       successBox1.style.display = 'none';
        //       removeImageButton1.style.display = 'block';
        //     }, 3000);
        //   }
        // }
      });
    }
  });
};
