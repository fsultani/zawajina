let slideWidth;
let index = 0;
let translateValue = 0;

const userPhotosLength = parseInt(
  document.querySelector('.profile-photos-container').dataset.userPhotos
);

const profilePhotosContainer = document.querySelector('.profile-photos-container');

if (userPhotosLength > 1) {
  document.querySelector('.profile-photos-container').style.height = '390px';
  slideWidth = document.querySelector('.slide').clientWidth;

  document.querySelector('.dot').classList.add('active');
  profilePhotosContainer.style.marginBottom = userPhotosLength < 1 ? 0 : '80px';

  const carousel = document.querySelector('.slider-wrapper');
  const elements = document.querySelectorAll('.slider-wrapper > *');
  const elementIndices = {};
  let currentIndex = 0;

  const allDots = document.querySelector('.dots-wrapper').getElementsByTagName('span');
  const observer = new IntersectionObserver(
    function (entries, observer) {
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
} else {
  document.querySelector('.profile-photos-container').style.height = '390px';
}

const sliderWrapper = translateValue => {
  document.querySelector('.slider-wrapper').style.transform = `translateX(${translateValue}px)`;
};

const goToImage = imageIndex => {
  translateValue = translateValue - slideWidth * (imageIndex - index);
  sliderWrapper(translateValue);

  const allDots = document.querySelector('.dots-wrapper').getElementsByTagName('span');
  for (let i = 0; i < allDots.length; i++) {
    if (allDots[i].classList.contains('active')) {
      allDots[i].classList.remove('active');
    }
  }
  allDots[imageIndex].classList.add('active');
  index = imageIndex;
};
