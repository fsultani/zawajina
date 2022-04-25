let displayValOne = document.querySelector(".min-age-range");
let displayValTwo = document.querySelector(".max-age-range");
let sliderOne = document.querySelector(".min-age-slider");
let sliderTwo = document.querySelector(".max-age-slider");
let minGap = 0;
let sliderTrack = document.querySelector(".age-range-slider-track");
let sliderTotalDistanceValue = sliderOne.max - sliderOne.min;

const minAge = () => {
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderOne.value = parseInt(sliderTwo.value) - minGap;
  }

  displayValOne.textContent = sliderOne.value;
  fillColor();
}

const maxAge = () => {
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderTwo.value = parseInt(sliderOne.value) + minGap;
  }

  displayValTwo.textContent = sliderTwo.value;
  fillColor();
}

const fillColor = () => {
  percent1 = (sliderOne.value - sliderOne.min) / sliderTotalDistanceValue * 100;
  percent2 = (sliderTwo.value - sliderTwo.min) / sliderTotalDistanceValue * 100;
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}

minAge();
maxAge();

let minHeightSlider = document.querySelector(".min-height-slider");
let maxHeightSlider = document.querySelector(".max-height-slider");
let minHeightDisplayValue = document.querySelector(".min-height-range");
let maxHeightDisplayValue = document.querySelector(".max-height-range");
let minHeightGap = 0;
let heightsSliderTrack = document.querySelector(".heights-slider-track");
let heightsSliderTotalDistanceValue = minHeightSlider.max - minHeightSlider.min;

const heightsDictionary = [
  147,
  148,
  149,
  150,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  159,
  160,
  161,
  162,
  163,
  164,
  165,
  166,
  167,
  168,
  169,
  170,
  171,
  172,
  173,
  174,
  175,
  176,
  177,
  178,
  179,
  180,
  181,
  182,
  183,
  184,
  185,
  186,
  187,
  188,
  189,
  190,
  191,
  192,
  193,
  194,
  195,
  196,
];

const calculateImperialHeight = height => {
  const realFeet = ((height * 0.393700) / 12);
  let feet = Math.floor(realFeet);
  let inches = Math.round((realFeet - feet) * 12);
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  return `${feet}'${inches}"`;
};

const minHeight = () => {
  if (parseInt(maxHeightSlider.value) - parseInt(minHeightSlider.value) <= minHeightGap) {
    minHeightSlider.value = parseInt(maxHeightSlider.value) - minHeightGap;
  }
  const imperialHeight = calculateImperialHeight(minHeightSlider.value);
  const optionText = `${imperialHeight} (${minHeightSlider.value} cm)`;

  minHeightDisplayValue.textContent = optionText;
  fillHeightsSliderColor();
}

const maxHeight = () => {
  if (parseInt(maxHeightSlider.value) - parseInt(minHeightSlider.value) <= minHeightGap) {
    maxHeightSlider.value = parseInt(minHeightSlider.value) + minHeightGap;
  }

  const imperialHeight = calculateImperialHeight(maxHeightSlider.value);
  const optionText = `${imperialHeight} (${maxHeightSlider.value} cm)`;

  maxHeightDisplayValue.textContent = optionText;
  fillHeightsSliderColor();
}

const fillHeightsSliderColor = () => {
  percent1 = (minHeightSlider.value - minHeightSlider.min) / heightsSliderTotalDistanceValue * 100;
  percent2 = (maxHeightSlider.value - maxHeightSlider.min) / heightsSliderTotalDistanceValue * 100;
  heightsSliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}

minHeight();
maxHeight();
