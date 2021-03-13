const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getClickEventHandler = (suggestions, minFontSize, maxFontSize) => {
  Object.values(suggestions).map((v) => shuffle(v));
  let arrayPoint = {};
  Object.keys(suggestions).forEach((k) => (arrayPoint[k] = 0));
  const clickEventHandler = (e) => {
    const width = document.documentElement.clientWidth;
    const wideEnough = width > 550;
    const buttonType = e.target.className;
    const choice = suggestions[buttonType][arrayPoint[buttonType]];
    arrayPoint[buttonType]++;
    const suggestion = document.querySelector('.suggestion');
    let fontSize = minFontSize.toString() + 'px';
    if (wideEnough || choice.length <= 17) {
      fontSize = maxFontSize.toString() + 'px';
    }
    suggestion.style.fontSize = fontSize;
    suggestion.innerText = choice;
  };
  return clickEventHandler;
};
