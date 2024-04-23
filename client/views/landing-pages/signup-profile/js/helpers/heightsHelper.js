const heightsOptions = [
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
  const totalHeight = (height / 30.48).toString().split('.')
  const heightInFeet = totalHeight[0]
  const heightInInches = Math.round(Number(totalHeight[1].slice(0, 1)) * 12 * 0.1);

  return {
    heightInFeet,
    heightInInches,
  }
};

const heightOptions = ['<option selected disabled>Select Height</option>'];
heightsOptions.map((height, index) => {
  const imperialHeight = calculateImperialHeight(height);
  let optionText = `${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${height} cm)`;

  if (index === 0) {
    optionText = `< ${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${height} cm)`;
  } else if (index === heightsOptions.length - 1) {
    optionText = `> ${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${height} cm)`;
  }
  return heightOptions.push(`<option value=${height}>${optionText}</option>`)
});

document.querySelector('#user-height > .select-wrapper').innerHTML = heightOptions;
