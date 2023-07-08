let slideWidth;
let index = 0;
let translateValue = 0;

let modalData;
let editAboutMe = false;
let editAboutMyMatch = false;

const sliderWrapper = translateValue => {
  getQuerySelector('.slider-wrapper').style.transform = `translateX(${translateValue}px)`;
};

const goToImage = imageIndex => {
  translateValue = translateValue - slideWidth * (imageIndex - index);
  sliderWrapper(translateValue);

  const allDots = getQuerySelector('.dots-wrapper').getElementsByTagName('span');
  for (let i = 0; i < allDots.length; i++) {
    if (allDots[i].classList.contains('active')) {
      allDots[i].classList.remove('active');
    }
  }
  allDots[imageIndex].classList.add('active');
  index = imageIndex;
};

const profilePhotosContainer = getQuerySelector('.profile-photos-container');
const userPhotosLength = parseInt(profilePhotosContainer.dataset.userPhotos);

if (userPhotosLength > 1) {
  slideWidth = getQuerySelector('.slide-0').clientWidth;
  
  document.querySelectorAll('.dot').forEach(element => element.classList.add('active'));
  
  const carousel = getQuerySelector('.slider-wrapper');
  const elements = document.querySelectorAll('.slider-wrapper > *');
  const elementIndices = {};
  let currentIndex = 0;
  
  const allDots = getQuerySelector('.dots-wrapper').getElementsByTagName('span');
  const observer = new IntersectionObserver(
    function (entries, _observer) {
      const activated = entries.reduce(function (max, entry) {
        return entry.intersectionRatio > max.intersectionRatio ? entry : max;
      });
  
      if (activated.intersectionRatio > 0) {
        currentIndex = elementIndices[activated.target.getAttribute('id')];
        for (let i = 0; i < allDots.length; i++) {
          if (allDots[i].classList.contains('active')) {
            allDots[i].classList.remove('active');
          }
        }
        allDots[currentIndex].classList.add('active');
      }
    },
    {
      root: carousel,
      threshold: 0.5,
    }
  );
  
  for (let i = 0; i < elements.length; i++) {
    elementIndices[elements[i].getAttribute('id')] = i;
    observer.observe(elements[i]);
  }
}
