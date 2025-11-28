/**
 * Unit tests for base.js core functionality
 * Tests the core suggestion engine logic
 */

describe('base.js - Core Functionality', () => {
  let mockSuggestions;

  beforeEach(() => {
    // Load base.js functions
    const baseModule = require('../base.js');
    global.shuffle = baseModule.shuffle;
    global.getSuggestionType = baseModule.getSuggestionType;
    global.getClickEventHandler = baseModule.getClickEventHandler;
    global.initializeSuggestions = baseModule.initializeSuggestions;

    // Mock DOM
    document.body.innerHTML = `
      <div class="suggestion"></div>
      <button class="location">Location</button>
      <button class="relationship">Relationship</button>
      <button class="word">Word</button>
    `;

    // Mock suggestions data
    mockSuggestions = {
      location: ['Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'],
      relationship: ['Relationship 1', 'Relationship 2', 'Relationship 3'],
      word: ['Word 1', 'Word 2', 'Word 3', 'Word 4']
    };

    // Mock window dimensions
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
  });

  describe('shuffle function', () => {
    test('should shuffle array in place', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      const beforeShuffle = [...original];

      shuffle(original);

      // Should have same elements (sort both to compare)
      const sortedOriginal = [...original].sort((a, b) => a - b);
      const sortedExpected = [...beforeShuffle].sort((a, b) => a - b);
      expect(sortedOriginal).toEqual(sortedExpected);

      // Should be shuffled (extremely unlikely to be in same order with 20 items)
      // Calculate if at least some items changed position
      let differentPositions = 0;
      for (let i = 0; i < beforeShuffle.length; i++) {
        if (original[i] !== beforeShuffle[i]) {
          differentPositions++;
        }
      }
      // At least 50% of items should be in different positions
      expect(differentPositions).toBeGreaterThan(beforeShuffle.length / 2);
    });

    test('should handle empty array', () => {
      const empty = [];
      shuffle(empty);
      expect(empty).toEqual([]);
    });

    test('should handle single element array', () => {
      const single = ['only'];
      shuffle(single);
      expect(single).toEqual(['only']);
    });

    test('should preserve array length', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const originalLength = arr.length;
      shuffle(arr);
      expect(arr.length).toBe(originalLength);
    });

    test('should not lose or duplicate elements', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      shuffle(arr);
      expect(arr).toContain('a');
      expect(arr).toContain('b');
      expect(arr).toContain('c');
      expect(arr).toContain('d');
      expect(arr).toContain('e');
      expect(arr.length).toBe(5);
    });
  });

  describe('getSuggestionType function', () => {
    test('should identify location button', () => {
      const button = document.querySelector('.location');
      const type = getSuggestionType(button.classList);
      expect(type).toBe('location');
    });

    test('should identify relationship button', () => {
      const button = document.querySelector('.relationship');
      const type = getSuggestionType(button.classList);
      expect(type).toBe('relationship');
    });

    test('should identify word button', () => {
      const button = document.querySelector('.word');
      const type = getSuggestionType(button.classList);
      expect(type).toBe('word');
    });

    test('should handle button with multiple classes', () => {
      const button = document.createElement('button');
      button.className = 'btn location active';
      const type = getSuggestionType(button.classList);
      expect(type).toBe('location');
    });

    test('should return undefined for unknown button type', () => {
      const button = document.createElement('button');
      button.className = 'unknown-type';
      const type = getSuggestionType(button.classList);
      expect(type).toBeUndefined();
    });
  });

  describe('getClickEventHandler - suggestion cycling', () => {
    test('should cycle through suggestions without repeating', () => {
      const handler = getClickEventHandler(mockSuggestions, 18, 29);
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      const seen = new Set();

      // Click through all locations
      for (let i = 0; i < mockSuggestions.location.length; i++) {
        handler({ target: button });
        const text = suggestion.innerText;
        expect(mockSuggestions.location).toContain(text);
        seen.add(text);
      }

      // Should have seen all suggestions
      expect(seen.size).toBe(mockSuggestions.location.length);
    });

    test('should reshuffle and reset when exhausting suggestions', () => {
      const handler = getClickEventHandler(mockSuggestions, 18, 29);
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      const firstRound = [];

      // First round - collect all suggestions
      for (let i = 0; i < mockSuggestions.location.length; i++) {
        handler({ target: button });
        firstRound.push(suggestion.innerText);
      }

      // Next click should reshuffle and show a suggestion (not error)
      handler({ target: button });
      expect(suggestion.innerText).toBeTruthy();
      expect(mockSuggestions.location).toContain(suggestion.innerText);
    });

    test('should maintain separate indices for different categories', () => {
      const handler = getClickEventHandler(mockSuggestions, 18, 29);
      const locationBtn = document.querySelector('.location');
      const wordBtn = document.querySelector('.word');
      const suggestion = document.querySelector('.suggestion');

      // Click location
      handler({ target: locationBtn });
      const location1 = suggestion.innerText;

      // Click word
      handler({ target: wordBtn });
      const word1 = suggestion.innerText;

      // Click location again
      handler({ target: locationBtn });
      const location2 = suggestion.innerText;

      // Locations should be different
      expect(location1).not.toBe(location2);
      expect(mockSuggestions.location).toContain(location1);
      expect(mockSuggestions.location).toContain(location2);
      expect(mockSuggestions.word).toContain(word1);
    });
  });

  describe('getClickEventHandler - font sizing', () => {
    test('should use large font for short text on wide screen', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1024 // Wide enough
      });

      const handler = getClickEventHandler(
        { location: ['Short'] },
        18,
        29
      );
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      handler({ target: button });

      expect(suggestion.style.fontSize).toBe('29px');
    });

    test('should use small font for long text on narrow screen', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 400, // Mobile width
        configurable: true
      });

      const handler = getClickEventHandler(
        { location: ['This is a very long suggestion text that exceeds seventeen characters'] },
        18,
        29
      );
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      handler({ target: button });

      // Logic: wideEnough (false) || shortText (false) = false → use small font
      expect(suggestion.style.fontSize).toBe('18px');
    });

    test('should use large font on mobile for short text', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 400, // Mobile width
        configurable: true
      });

      const handler = getClickEventHandler(
        { location: ['Short'] }, // 5 chars, <= 17
        18,
        29
      );
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      handler({ target: button });

      // Logic: wideEnough (false) || shortText (true) = true → use large font
      expect(suggestion.style.fontSize).toBe('29px');
    });

    test('should use large font for short text at breakpoint boundary', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 551 // Just above BREAKPOINT_MOBILE (550)
      });

      const handler = getClickEventHandler(
        { location: ['Short'] },
        18,
        29
      );
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      handler({ target: button });

      expect(suggestion.style.fontSize).toBe('29px');
    });

    test('should respect custom font sizes', () => {
      const customMin = 20;
      const customMax = 35;

      const handler = getClickEventHandler(
        { location: ['Test'] },
        customMin,
        customMax
      );
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      handler({ target: button });

      expect(['20px', '35px']).toContain(suggestion.style.fontSize);
    });
  });

  describe('getClickEventHandler - error handling', () => {
    let consoleErrorSpy;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    test('should handle click on invalid button type gracefully', () => {
      const handler = getClickEventHandler(mockSuggestions, 18, 29);
      const invalidButton = document.createElement('button');
      invalidButton.className = 'invalid-type';

      handler({ target: invalidButton });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown button type clicked');
    });

    test('should handle missing suggestion element', () => {
      const suggestion = document.querySelector('.suggestion');
      suggestion.remove();

      const handler = getClickEventHandler(mockSuggestions, 18, 29);
      const button = document.querySelector('.location');

      // Should not throw because base.js has null check at line 65
      expect(() => handler({ target: button })).not.toThrow();
    });
  });

  describe('initializeSuggestions function', () => {
    test('should attach event handlers to all buttons', () => {
      initializeSuggestions(mockSuggestions);

      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBe(3);

      // Each button should trigger suggestion display
      const suggestion = document.querySelector('.suggestion');

      buttons[0].click();
      expect(suggestion.innerText).toBeTruthy();

      buttons[1].click();
      expect(suggestion.innerText).toBeTruthy();

      buttons[2].click();
      expect(suggestion.innerText).toBeTruthy();
    });

    test('should clear existing suggestion on initialization', () => {
      const suggestion = document.querySelector('.suggestion');
      suggestion.innerText = 'Old suggestion';

      initializeSuggestions(mockSuggestions);

      expect(suggestion.innerText).toBe('');
    });

    test('should remove old event handlers before adding new ones', () => {
      // Initialize once
      initializeSuggestions(mockSuggestions);

      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Click to get first suggestion
      button.click();
      // First click should work with old data
      expect(suggestion.innerText).toBeTruthy();

      // Initialize again with new data
      const newSuggestions = {
        location: ['New Location'],
        relationship: ['New Relationship'],
        word: ['New Word']
      };
      initializeSuggestions(newSuggestions);

      // Click should use new data
      button.click();
      expect(suggestion.innerText).toBe('New Location');
    });

    test('should use default font sizes if not provided', () => {
      initializeSuggestions(mockSuggestions);

      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      button.click();

      // Should use FONT_SIZES.SMALL (18) or FONT_SIZES.LARGE (29)
      expect(['18px', '29px']).toContain(suggestion.style.fontSize);
    });

    test('should handle missing suggestion element gracefully', () => {
      document.querySelector('.suggestion').remove();

      // Should not throw
      expect(() => initializeSuggestions(mockSuggestions)).not.toThrow();
    });
  });

  describe('Edge cases and stress tests', () => {
    test('should handle rapid consecutive clicks', () => {
      const handler = getClickEventHandler(mockSuggestions, 18, 29);
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Rapid clicks
      for (let i = 0; i < 20; i++) {
        handler({ target: button });
        expect(suggestion.innerText).toBeTruthy();
        expect(mockSuggestions.location).toContain(suggestion.innerText);
      }
    });

    test('should handle suggestion array with one element', () => {
      const singleSuggestion = {
        location: ['Only One Location'],
        relationship: ['Only One Relationship'],
        word: ['Only One Word']
      };

      const handler = getClickEventHandler(singleSuggestion, 18, 29);
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Should work even with single suggestion
      for (let i = 0; i < 5; i++) {
        handler({ target: button });
        expect(suggestion.innerText).toBe('Only One Location');
      }
    });

    test('should handle concurrent category cycling', () => {
      const handler = getClickEventHandler(mockSuggestions, 18, 29);
      const buttons = document.querySelectorAll('button');
      const suggestion = document.querySelector('.suggestion');

      // Alternate between categories
      for (let i = 0; i < 10; i++) {
        const button = buttons[i % buttons.length];
        handler({ target: button });
        expect(suggestion.innerText).toBeTruthy();
      }
    });

    test('should handle Unicode and special characters in suggestions', () => {
      const unicodeSuggestions = {
        location: ['Café ☕', '日本 🇯🇵', 'Москва 🏛️'],
        relationship: ['Artist/Curator 🎨', 'Parent/Child 👨‍👧'],
        word: ['Émigré', 'Naïve', 'Über']
      };

      const handler = getClickEventHandler(unicodeSuggestions, 18, 29);
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      handler({ target: button });
      expect(suggestion.innerText).toBeTruthy();
    });

    test('should handle very long suggestion text', () => {
      // Set narrow screen so we don't trigger wideEnough
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 400, // Mobile width
        configurable: true
      });

      const longText = 'A'.repeat(200); // Much longer than 17 chars
      const longSuggestions = {
        location: [longText],
        relationship: ['Normal'],
        word: ['Normal']
      };

      const handler = getClickEventHandler(longSuggestions, 18, 29);
      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      handler({ target: button });
      expect(suggestion.innerText).toBe(longText);
      // Logic: wideEnough (false) || shortText (false) = false → use small font
      expect(suggestion.style.fontSize).toBe('18px');
    });
  });
});
