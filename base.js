// Configuration constants
const BREAKPOINT_MOBILE = 550;
const SHORT_TEXT_LENGTH = 17;

const FONT_SIZES = {
  SMALL: 18,  // Mobile or long suggestions
  LARGE: 29   // Desktop and short suggestions
};

const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

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

const getSuggestionType = (classList) => {
  return ['location', 'relationship', 'word'].find(type => classList.contains(type));
};

const getClickEventHandler = (suggestions, minFontSize, maxFontSize) => {
  // Shuffle all suggestion arrays initially
  Object.values(suggestions).forEach((array) => shuffle(array));

  // Track current index for each category
  let categoryIndices = {};
  Object.keys(suggestions).forEach((category) => (categoryIndices[category] = 0));

  const clickEventHandler = (e) => {
    const buttonType = getSuggestionType(e.target.classList);

    if (!buttonType) {
      console.error('Unknown button type clicked');
      return;
    }

    // Get current index for this category
    let index = categoryIndices[buttonType];

    // If we've exhausted the array, reshuffle and reset
    if (index >= suggestions[buttonType].length) {
      shuffle(suggestions[buttonType]);
      index = 0;
      categoryIndices[buttonType] = 0;
    }

    const choice = suggestions[buttonType][index];
    categoryIndices[buttonType]++;

    const suggestion = document.querySelector('.suggestion');

    // Guard against missing suggestion element or null/undefined choice
    if (!suggestion || !choice) {
      return;
    }

    const width = document.documentElement.clientWidth;
    const wideEnough = width > BREAKPOINT_MOBILE;

    let fontSize = minFontSize.toString() + 'px';
    if (wideEnough || choice.length <= SHORT_TEXT_LENGTH) {
      fontSize = maxFontSize.toString() + 'px';
    }

    suggestion.style.fontSize = fontSize;
    suggestion.innerText = choice;
  };

  return clickEventHandler;
};

// Track current event handlers for cleanup
let currentHandlers = [];

// Reusable initialization function
const initializeSuggestions = (suggestions, minFontSize = FONT_SIZES.SMALL, maxFontSize = FONT_SIZES.LARGE) => {
  const buttons = document.querySelectorAll('button');

  // Remove old event handlers
  currentHandlers.forEach(({ button, handler }) => {
    button.removeEventListener('click', handler);
  });
  currentHandlers = [];

  // Add new event handlers
  const handler = getClickEventHandler(suggestions, minFontSize, maxFontSize);
  for (let button of buttons) {
    button.addEventListener('click', handler);
    currentHandlers.push({ button, handler });
  }

  // Clear any existing suggestion
  const suggestionEl = document.querySelector('.suggestion');
  if (suggestionEl) {
    suggestionEl.innerText = '';
  }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shuffle,
    getSuggestionType,
    getClickEventHandler,
    initializeSuggestions,
    BREAKPOINT_MOBILE,
    SHORT_TEXT_LENGTH,
    FONT_SIZES
  };
}
