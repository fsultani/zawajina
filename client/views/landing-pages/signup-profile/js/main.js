(async () => {
  try {
    const imageWrapper = getQuerySelector('.images-wrapper');
    const numberOfImages = 3;

    const html = [...Array(numberOfImages)].map((_, index) => {
      return `
        <input
          type='file'
          name='image-${index}'
          class='image-${index}'
          hidden='hidden'
          accept='.jpg,.jpeg,.png'
        />
        <div class='image-upload-container'>
          <div class='custom-button-${index}'></div>
          <div class='image-upload-${index}'>
            <img src='' class='image-preview-${index}' />
          </div>
          <div class='remove-image-${index}'></div>
          <div class='processing-bar-${index}'></div>
          <div class='success-box-${index}'></div>
        </div>
      `
    }).join('');

    imageWrapper.innerHTML += html;

    [...Array(numberOfImages)].map((_, index) => {
      const image1 = document.querySelector(`.image-${index}`);
      const customButton1 = document.querySelector(`.custom-button-${index}`);
      const imageUpload1 = document.querySelector(`.image-upload-${index}`);
      const imagePreview1 = document.querySelector(`.image-preview-${index}`);
      const removeImageButton1 = document.querySelector(`.remove-image-${index}`);
      const processingBar1 = document.querySelector(`.processing-bar-${index}`);
      const successBox1 = document.querySelector(`.success-box-${index}`);
      const imageUploadContainerWidth = document.querySelector('.image-upload-container').offsetWidth;

      customButton1.addEventListener('click', () => {
        if (image1.value) image1.value = '';
        image1.click();
      });

      image1.addEventListener('change', event => {
        const uploadedFile = event.target.files[0];
        const uploadedFileUrl = URL.createObjectURL(uploadedFile);
        imagePreview1.src = uploadedFileUrl;
        imagePreview1.style.display = 'block';
        customButton1.style.display = 'none';
        imageUpload1.classList.add(`display-image-${index}`);

        let width = 1;
        let identity = setInterval(frame, 10);
        function frame() {
          if (width < imageUploadContainerWidth - 19) {
            width++;
            processingBar1.style.width = `${width}px`;
          } else {
            clearInterval(identity);
            document.querySelector(`.display-image-${index}`).style.opacity = 1;
            successBox1.style.display = 'inline-block';
            processingBar1.style.transition = '0.75s';
            processingBar1.style.transitionDelay = '2.25s';
            processingBar1.style.opacity = 0;
            setTimeout(() => {
              successBox1.style.display = 'none';
              removeImageButton1.style.display = 'block';
            }, 3000);
          }
        }
      });

      removeImageButton1.addEventListener('click', () => {
        imagePreview1.src = '';
        imagePreview1.style.display = 'none';
        imageUpload1.classList.remove(`display-image-${index}`);
        customButton1.style.display = 'block';

        processingBar1.style.opacity = '';
        processingBar1.style.transition = '';
        processingBar1.style.width = '';

        removeImageButton1.style.display = 'none';
      });
    });

    displayFullPageLoadingSpinner(true);

    const response = await Axios({
      apiUrl: '/api/register/check-email-verification', // server/routes/register/checkEmailVerification.js
    });

    const emailWasVerified = response?.emailWasVerified;
    if (!emailWasVerified) return window.location.pathname = response?.url;

    const { name } = await Axios({
      apiUrl: '/api/register/signup-user-first-name', // server/routes/register/index.js
    });

    document.querySelector('.form-title').innerHTML = `Welcome, ${name}`;

    document.getElementById('about-me').addEventListener('keyup', e => {
      let characterCount = e.target.value.length;
      document.getElementById('about-me-character-count').innerHTML = `${characterCount}/100`;
      document.getElementById('about-me-character-count').style.cssText =
        characterCount < 100 ? 'color: #777;' : 'color: green;';
    });

    document.getElementById('about-my-match').addEventListener('keyup', e => {
      let characterCount = e.target.value.length;
      document.getElementById('about-my-match-character-count').innerHTML = `${characterCount}/100`;
      document.getElementById('about-my-match-character-count').style.cssText =
        characterCount < 100 ? 'color: #777;' : 'color: green;';
    });

    if (typeof globalThis === 'object') {
      const {
        allLocations,
        userLocationData,
      } = await locationData();

      const { allCountries } = await getAllCountries();
      const { allEthnicities } = await getAllEthnicities();
      const { allLanguages } = await getAllLanguages();

      displayFullPageLoadingSpinner(false);

      document.querySelectorAll('select').forEach(element => element.options[0].disabled = true);

      return globalThis = {
        allLocations,
        userLocationData,
        allCountries,
        allEthnicities,
        allLanguages,
      }
    };

    Object.defineProperty(Object.prototype, '__magic__', {
      get: function () {
        return this;
      },
      configurable: true // This makes it possible to `delete` the getter later.
    });
    __magic__.globalThis = __magic__; // lolwat
    delete Object.prototype.__magic__;
  } catch (error) {
    displayFullPageLoadingSpinner(false);
    Cookies.remove('my_match_authToken');
    Cookies.remove('my_match_authUserId');
    window.location.pathname = '/signup';
  }
})();
