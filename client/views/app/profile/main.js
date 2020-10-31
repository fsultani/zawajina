let slideWidth;
let index = 0;
let translateValue = 0;

const userPhotosLength = document.querySelector(".profile-photos-container").dataset.userPhotos;
const profilePhotosContainer = document.querySelector(".profile-photos-container");

if (userPhotosLength > 0) {
  document.querySelector(".profile-photos-container").style.height = "390px";
  slideWidth = document.querySelector(".slide").clientWidth;

  document.querySelector('.dot').classList.add("active");

  if (screen.width < 800) {
    profilePhotosContainer.style.marginBottom = 0;
  } else {
    profilePhotosContainer.style.marginBottom = userPhotosLength < 1 ? 0 : "80px";
  }

  const carousel = document.querySelector('.slider-wrapper');
  const elements = document.querySelectorAll('.slider-wrapper > *');
  const elementIndices = {};
  let currentIndex = 0;

  const allDots = document.querySelector(".dots-wrapper").getElementsByTagName("span");
  const observer = new IntersectionObserver(function(entries, observer) {
    const activated = entries.reduce(function (max, entry) {
      return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
    });
    if (activated.intersectionRatio > 0) {
      currentIndex = elementIndices[activated.target.getAttribute("id")];
      for (let i = 0; i < allDots.length; i++) {
        if (allDots[i].classList.contains("active")) {
          allDots[i].classList.remove("active");
        }
      }
      allDots[currentIndex].classList.add("active");
    }
  }, {
    root:carousel, threshold:0.5
  });

  for (let i = 0; i < elements.length; i++) {
    elementIndices[elements[i].getAttribute("id")] = i;
    observer.observe(elements[i]);
  }
} else {
  document.querySelector(".profile-photos-container").style.height = "340px";
}

const sliderWrapper = translateValue => {
  document.querySelector(".slider-wrapper").style.transform = `translateX(${translateValue}px)`;
}

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

/* **************************************************************************** */

const handleBlockReportUserMenu = () => {
  const dropdownContent = document.querySelector(".block-report-user-dropdown-content");
  dropdownContent.classList.toggle('show-block-report-user-dropdown-content');
}

const handleBlockUser = () => {
  console.log(`handleBlockUser`);
}

const handleReportUser = () => {
  console.log(`handleReportUser`);
}

document.addEventListener('click', (event) => {
  const targetName = event.target.classList.value;
  const dropdownContent = document.querySelector(".block-report-user-dropdown-content").classList;

  if (
    targetName !== 'ellipsis-dot' &&
    targetName !== 'ellipsis-menu' &&
    dropdownContent.contains('show-block-report-user-dropdown-content')
  ) {
    dropdownContent.remove('show-block-report-user-dropdown-content');
  }
})

/* **************************************************************************** */

const handleSendMessage = () => {
  console.log(`handleSendMessage`);
}

const handleLikeUser = () => {
  console.log(`handleLikeUser`);
}

/* **************************************************************************** */

// var container = document.querySelector(".photos-wrapper");

// container.addEventListener("touchstart", startTouch);
// container.addEventListener("touchmove", moveTouch);
// container.addEventListener("touchend", endTouch);

// let initialX;
// let currentX;
// let distance;
// let longTouch;
// let slideIndex = 0;

// function startTouch(e) {
//   initialX = e.touches[0].clientX;
// };

// function moveTouch(e) {
//   // e.preventDefault();
//   currentX = e.touches[0].clientX;
//   distance = slideIndex * slideWidth + (initialX - currentX);
//   sliderWrapper(-distance);
// };

// function endTouch(e) {
//   const endX = Math.abs(slideIndex * slideWidth - distance);

//   if (endX > slideWidth / 2) {
//     if (distance > slideIndex * slideWidth) {
//       slideIndex += 1;
//     } else if (distance < slideIndex * slideWidth) {
//       slideIndex -= 1;
//     }
//   }
//   goToImage(slideIndex);
//   // sliderWrapper(-distance)

//   // e.preventDefault();
// };

// const elements = document.querySelectorAll('.slide');
// var observer = new IntersectionObserver(function(entries, observer) {
//   // find the entry with the largest intersection ratio
//   var activated = entries.reduce(function (max, entry) {
//     return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
//   });
//   if (activated.intersectionRatio > 0) {
//     currentIndex = elementIndices[activated.target.getAttribute("id")];
//     renderIndicator();
//   }
// }, {
//   root:carousel, threshold:0.5
// });
// var elementIndices = {};
// for (var i = 0; i < elements.length; i++) {
//   elementIndices[elements[i].getAttribute("id")] = i;
//   observer.observe(elements[i]);
// }
