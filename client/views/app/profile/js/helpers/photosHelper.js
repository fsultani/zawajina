const photosHelper = () => {
  Array(6).fill().map((_, index) => {
    const image = getQuerySelector(`.image-${index}`);
    let imagePreview = getQuerySelector(`.image-preview-${index}`);
    let customButton = getQuerySelector(`.custom-button-${index}`);
    let removeImageButton = getQuerySelector(`.remove-image-${index}`);

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

      removeImageButton.addEventListener('click', () => {
        const imageUploadWrapper = getQuerySelector(`.image-upload-wrapper-${index}`);

        imageUploadWrapper.innerHTML = `<div class="custom-button-${index}"></div>`;
        customButton = getQuerySelector(`.custom-button-${index}`);

        imagePreview.src = 'deletePhoto';
        imagePreview.style.display = 'none';
        customButton.style.display = 'block';
        removeImageButton.style.display = 'none';

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
      });

    } else {
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
      });
    }
  });
};
