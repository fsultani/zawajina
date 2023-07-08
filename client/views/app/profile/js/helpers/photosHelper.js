const imagePreviewStyles = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  objectFit: 'cover',
}

const toggleDefaultButton = boolean => {
  const makeDefaultButton = getQuerySelector('.make-default-button');

  getQuerySelector('.make-default-button-container').style.cursor = boolean ? 'not-allowed' : 'auto';
  makeDefaultButton.style.opacity = boolean ? 0.5 : 1;
  makeDefaultButton.style.pointerEvents = boolean ? 'none' : 'auto';
  makeDefaultButton.disabled = boolean;
}

let selectedImage;
const defaultImageSelection = () => {
  document.querySelectorAll('.image-selection').forEach(element => {
    element.addEventListener('click', el => {
      const currentSelectedElement = el.currentTarget.id.split('-')[3];
      toggleDefaultButton(false);
      if (!selectedImage) {
        selectedImage = currentSelectedElement;
        el.target.style.border = '5px solid #0070cc';
      } else {
        document.querySelector(`#image-selection-${selectedImage}`).style.border = 'none';
        el.target.style.border = '5px solid #0070cc';
        selectedImage = currentSelectedElement;
      }
    });
  });
}

const runRemoveImageButton = (index, image, imagePreview) => {
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

    customButton.addEventListener('click', () => {
      if (image.value) image.value = '';
      image.click();
    });

    image.addEventListener('change', event => {
      const uploadedFile = URL.createObjectURL(event.target.files[0]);

      imageUploadWrapper.innerHTML = `
        <div class="image-upload-${index} image-selection" id="image-upload-selection-${index}">
          <img src="${uploadedFile}" class="image-preview-${index}" id="image-selection-${index}" />
        </div>
        <button class="remove-image-${index}"></button>
        <div class="processing-bar-${index}"></div>
        <div class="success-box-${index}"></div>
      `;

      imagePreview = getQuerySelector(`.image-preview-${index}`);
      removeImageButton = getQuerySelector(`.remove-image-${index}`);

      Object.assign(imagePreview.style, imagePreviewStyles);

      Object.assign(removeImageButton.style, removeImageButtonStyles)
      runRemoveImageButton(index, image, imagePreview);

      defaultImageSelection();
    });
  });
}

const photosHelper = () => {
  const makeDefaultButton = getQuerySelector('.make-default-button');

	makeDefaultButton.addEventListener('click', () => {
		const newDefaultImage = getQuerySelector(`#image-selection-${selectedImage}`)
		if (newDefaultImage?.src) {
			const currentDefaultImage = getQuerySelector('#image-selection-0')
			const currentDefaultImageSrc = currentDefaultImage.src;
			const newDefaultImageSrc = newDefaultImage.src;

			const currentDefaultImageInputName = getQuerySelector('.image-0')
			currentDefaultImageInputName.setAttribute('name', `image-${selectedImage}`)

			const newDefaultImageInputName = getQuerySelector(`.image-${selectedImage}`)
			newDefaultImageInputName.setAttribute('name', `image-0`)

			currentDefaultImage.src = newDefaultImageSrc;
			newDefaultImage.src = currentDefaultImageSrc;
		}

		document.querySelector(`#image-selection-${selectedImage}`).style.border = 'none';
    toggleDefaultButton(true);
	})

	defaultImageSelection();

  Array(3).fill().map((_, index) => {
    const image = getQuerySelector(`.image-${index}`);
    const imageUploadWrapper = getQuerySelector(`.image-upload-wrapper-${index}`);
    Object.assign(imageUploadWrapper.style, {
      width: "100%",
      height: "100%",
    });

    let imagePreview = getQuerySelector(`.image-preview-${index}`);
    let customButton = getQuerySelector(`.custom-button-${index}`);

    if (imagePreview) {
      Object.assign(imagePreview.style, imagePreviewStyles);

      runRemoveImageButton(index, image, imagePreview);
    } else {
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
          <div class="image-upload-${index} image-selection" id="image-upload-selection-${index}">
            <img src="${uploadedFile}" class="image-preview-${index}" id="image-selection-${index}" />
          </div>
          <button class="remove-image-${index}"></button>
          <div class="processing-bar-${index}"></div>
          <div class="success-box-${index}"></div>
        `;
        imagePreview = getQuerySelector(`.image-preview-${index}`);
        removeImageButton = getQuerySelector(`.remove-image-${index}`);

        Object.assign(imagePreview.style, imagePreviewStyles);

        runRemoveImageButton(index, image, imagePreview);

        defaultImageSelection();
      });
    }
  });
};
