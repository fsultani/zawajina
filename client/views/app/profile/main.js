let index = 0;
let translateValue = 0;

const slideWidth = document.querySelector(".slide").clientWidth;

const sliderWrapper = translateValue =>
  (document.querySelector(".slider-wrapper").style.transform = `translateX(${translateValue}px)`);

document.querySelector(`.dot`).classList.add("active");

const userPhotosLength = document.querySelector(".profile-photos-container").dataset.userPhotos;

const profilePhotosContainer = document.querySelector(".profile-photos-container");
profilePhotosContainer.style.marginBottom = userPhotosLength < 1 ? 0 : "80px";

const goToImage = imageIndex => {
  translateValue = translateValue - slideWidth * (imageIndex - index);
  sliderWrapper(translateValue);

  const allDots = document.querySelector(".dots-wrapper").getElementsByTagName("span");
  for (let i = 0; i < allDots.length; i++) {
    if (allDots[i].classList.contains("active")) {
      allDots[i].classList.remove("active");
    }
  }
  allDots[imageIndex].classList.add("active");
  index = imageIndex;
};
