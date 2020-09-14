const image1 = document.querySelector(".image-1");
const customButton1 = document.querySelector(".custom-button-1");
const imageUpload1 = document.querySelector(".image-upload-1");
const imagePreview1 = document.querySelector(".image-preview-1");
const removeImageButton1 = document.querySelector(".remove-image-1");
const processingBar1 = document.querySelector(".processing-bar-1");
const successBox1 = document.querySelector(".success-box-1");

customButton1.addEventListener("click", () => {
  if (image1.value) image1.value = "";
  image1.click();
});

image1.addEventListener("change", event => {
  const uploadedFile = URL.createObjectURL(event.target.files[0]);
  imagePreview1.src = uploadedFile;
  imagePreview1.style.display = "block";
  customButton1.style.display = "none";
  imageUpload1.classList.add("display-image-1");

  let width = 1;
  let identity = setInterval(frame, 10);
  function frame() {
    if (width < 131) {
      width++;
      processingBar1.style.width = `${width}px`;
    } else {
      clearInterval(identity);
      document.querySelector(".display-image-1").style.opacity = 1;
      successBox1.style.display = "inline-block";
      processingBar1.style.transition = "0.75s";
      processingBar1.style.transitionDelay = "2.25s";
      processingBar1.style.opacity = 0;
      setTimeout(() => {
        successBox1.style.display = "none";
        removeImageButton1.style.display = "block";
      }, 3000);
    }
  }
});

removeImageButton1.addEventListener("click", event => {
  imagePreview1.src = "";
  imagePreview1.style.display = "none";
  imageUpload1.classList.remove("display-image-1");
  customButton1.style.display = "block";

  processingBar1.style.opacity = "";
  processingBar1.style.transition = "";
  processingBar1.style.width = "";

  removeImageButton1.style.display = "none";
});

/* *************************************************************************************************** */

const image2 = document.querySelector(".image-2");
const customButton2 = document.querySelector(".custom-button-2");
const imageUpload2 = document.querySelector(".image-upload-2");
const imagePreview2 = document.querySelector(".image-preview-2");
const removeImageButton2 = document.querySelector(".remove-image-2");
const processingBar2 = document.querySelector(".processing-bar-2");
const successBox2 = document.querySelector(".success-box-2");

customButton2.addEventListener("click", () => {
  if (image2.value) image2.value = "";
  image2.click();
});

image2.addEventListener("change", event => {
  const uploadedFile = URL.createObjectURL(event.target.files[0]);
  imagePreview2.src = uploadedFile;
  imagePreview2.style.display = "block";
  customButton2.style.display = "none";
  imageUpload2.classList.add("display-image-2");

  let width = 1;
  let identity = setInterval(frame, 10);
  function frame() {
    if (width < 131) {
      width++;
      processingBar2.style.width = `${width}px`;
    } else {
      clearInterval(identity);
      document.querySelector(".display-image-2").style.opacity = 1;
      successBox2.style.display = "inline-block";
      processingBar2.style.transition = "0.75s";
      processingBar2.style.transitionDelay = "2.25s";
      processingBar2.style.opacity = 0;
      setTimeout(() => {
        successBox2.style.display = "none";
        removeImageButton2.style.display = "block";
      }, 3000);
    }
  }
});

removeImageButton2.addEventListener("click", event => {
  imagePreview2.src = "";
  imagePreview2.style.display = "none";
  imageUpload2.classList.remove("display-image-2");
  customButton2.style.display = "block";

  processingBar2.style.opacity = "";
  processingBar2.style.transition = "";
  processingBar2.style.width = "";

  removeImageButton2.style.display = "none";
});

/* *************************************************************************************************** */

const image3 = document.querySelector(".image-3");
const customButton3 = document.querySelector(".custom-button-3");
const imageUpload3 = document.querySelector(".image-upload-3");
const imagePreview3 = document.querySelector(".image-preview-3");
const removeImageButton3 = document.querySelector(".remove-image-3");
const processingBar3 = document.querySelector(".processing-bar-3");
const successBox3 = document.querySelector(".success-box-3");

customButton3.addEventListener("click", () => {
  if (image3.value) image3.value = "";
  image3.click();
});

image3.addEventListener("change", event => {
  const uploadedFile = URL.createObjectURL(event.target.files[0]);
  imagePreview3.src = uploadedFile;
  imagePreview3.style.display = "block";
  customButton3.style.display = "none";
  imageUpload3.classList.add("display-image-3");

  let width = 1;
  let identity = setInterval(frame, 10);
  function frame() {
    if (width < 131) {
      width++;
      processingBar3.style.width = `${width}px`;
    } else {
      clearInterval(identity);
      document.querySelector(".display-image-3").style.opacity = 1;
      successBox3.style.display = "inline-block";
      processingBar3.style.transition = "0.75s";
      processingBar3.style.transitionDelay = "2.25s";
      processingBar3.style.opacity = 0;
      setTimeout(() => {
        successBox3.style.display = "none";
        removeImageButton3.style.display = "block";
      }, 3000);
    }
  }
});

removeImageButton3.addEventListener("click", event => {
  imagePreview3.src = "";
  imagePreview3.style.display = "none";
  imageUpload3.classList.remove("display-image-3");
  customButton3.style.display = "block";

  processingBar3.style.opacity = "";
  processingBar3.style.transition = "";
  processingBar3.style.width = "";

  removeImageButton3.style.display = "none";
});

/* *************************************************************************************************** */

const image4 = document.querySelector(".image-4");
const customButton4 = document.querySelector(".custom-button-4");
const imageUpload4 = document.querySelector(".image-upload-4");
const imagePreview4 = document.querySelector(".image-preview-4");
const removeImageButton4 = document.querySelector(".remove-image-4");
const processingBar4 = document.querySelector(".processing-bar-4");
const successBox4 = document.querySelector(".success-box-4");

customButton4.addEventListener("click", () => {
  if (image4.value) image4.value = "";
  image4.click();
});

image4.addEventListener("change", event => {
  const uploadedFile = URL.createObjectURL(event.target.files[0]);
  imagePreview4.src = uploadedFile;
  imagePreview4.style.display = "block";
  customButton4.style.display = "none";
  imageUpload4.classList.add("display-image-4");

  let width = 1;
  let identity = setInterval(frame, 10);
  function frame() {
    if (width < 131) {
      width++;
      processingBar4.style.width = `${width}px`;
    } else {
      clearInterval(identity);
      document.querySelector(".display-image-4").style.opacity = 1;
      successBox4.style.display = "inline-block";
      processingBar4.style.transition = "0.75s";
      processingBar4.style.transitionDelay = "2.25s";
      processingBar4.style.opacity = 0;
      setTimeout(() => {
        successBox4.style.display = "none";
        removeImageButton4.style.display = "block";
      }, 3000);
    }
  }
});

removeImageButton4.addEventListener("click", event => {
  imagePreview4.src = "";
  imagePreview4.style.display = "none";
  imageUpload4.classList.remove("display-image-4");
  customButton4.style.display = "block";

  processingBar4.style.opacity = "";
  processingBar4.style.transition = "";
  processingBar4.style.width = "";

  removeImageButton4.style.display = "none";
});

/* *************************************************************************************************** */

const image5 = document.querySelector(".image-5");
const customButton5 = document.querySelector(".custom-button-5");
const imageUpload5 = document.querySelector(".image-upload-5");
const imagePreview5 = document.querySelector(".image-preview-5");
const removeImageButton5 = document.querySelector(".remove-image-5");
const processingBar5 = document.querySelector(".processing-bar-5");
const successBox5 = document.querySelector(".success-box-5");

customButton5.addEventListener("click", () => {
  if (image5.value) image5.value = "";
  image5.click();
});

image5.addEventListener("change", event => {
  const uploadedFile = URL.createObjectURL(event.target.files[0]);
  imagePreview5.src = uploadedFile;
  imagePreview5.style.display = "block";
  customButton5.style.display = "none";
  imageUpload5.classList.add("display-image-5");

  let width = 1;
  let identity = setInterval(frame, 10);
  function frame() {
    if (width < 131) {
      width++;
      processingBar5.style.width = `${width}px`;
    } else {
      clearInterval(identity);
      document.querySelector(".display-image-5").style.opacity = 1;
      successBox5.style.display = "inline-block";
      processingBar5.style.transition = "0.75s";
      processingBar5.style.transitionDelay = "2.25s";
      processingBar5.style.opacity = 0;
      setTimeout(() => {
        successBox5.style.display = "none";
        removeImageButton5.style.display = "block";
      }, 3000);
    }
  }
});

removeImageButton5.addEventListener("click", event => {
  imagePreview5.src = "";
  imagePreview5.style.display = "none";
  imageUpload5.classList.remove("display-image-5");
  customButton5.style.display = "block";

  processingBar5.style.opacity = "";
  processingBar5.style.transition = "";
  processingBar5.style.width = "";

  removeImageButton5.style.display = "none";
});

/* *************************************************************************************************** */

const image6 = document.querySelector(".image-6");
const customButton6 = document.querySelector(".custom-button-6");
const imageUpload6 = document.querySelector(".image-upload-6");
const imagePreview6 = document.querySelector(".image-preview-6");
const removeImageButton6 = document.querySelector(".remove-image-6");
const processingBar6 = document.querySelector(".processing-bar-6");
const successBox6 = document.querySelector(".success-box-6");

customButton6.addEventListener("click", () => {
  if (image6.value) image6.value = "";
  image6.click();
});

image6.addEventListener("change", event => {
  const uploadedFile = URL.createObjectURL(event.target.files[0]);
  imagePreview6.src = uploadedFile;
  imagePreview6.style.display = "block";
  customButton6.style.display = "none";
  imageUpload6.classList.add("display-image-6");

  let width = 1;
  let identity = setInterval(frame, 10);
  function frame() {
    if (width < 131) {
      width++;
      processingBar6.style.width = `${width}px`;
    } else {
      clearInterval(identity);
      document.querySelector(".display-image-6").style.opacity = 1;
      successBox6.style.display = "inline-block";
      processingBar6.style.transition = "0.75s";
      processingBar6.style.transitionDelay = "2.25s";
      processingBar6.style.opacity = 0;
      setTimeout(() => {
        successBox6.style.display = "none";
        removeImageButton6.style.display = "block";
      }, 3000);
    }
  }
});

removeImageButton6.addEventListener("click", event => {
  imagePreview6.src = "";
  imagePreview6.style.display = "none";
  imageUpload6.classList.remove("display-image-6");
  customButton6.style.display = "block";

  processingBar6.style.opacity = "";
  processingBar6.style.transition = "";
  processingBar6.style.width = "";

  removeImageButton6.style.display = "none";
});
