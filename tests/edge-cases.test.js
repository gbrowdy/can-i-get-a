/**
 * Edge case and error handling tests
 * Tests boundary conditions, error states, and unusual scenarios
 */

describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    // Load base.js
    const baseModule = require('../base.js');
    global.shuffle = baseModule.shuffle;
    global.getSuggestionType = baseModule.getSuggestionType;
    global.getClickEventHandler = baseModule.getClickEventHandler;
    global.initializeSuggestions = baseModule.initializeSuggestions;

    // Reset DOM
    document.body.innerHTML = `
      <div class="suggestion"></div>
      <button class="location">Location</button>
      <button class="relationship">Relationship</button>
      <button class="word">Word</button>
    `;

    // Mock window
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
  });

  describe('Empty and Minimal Data', () => {
    test('should handle empty suggestion arrays', () => {
      const emptySuggestions = {
        location: [],
        relationship: [],
        word: []
      };

      const handler = getClickEventHandler(emptySuggestions, 18, 29);
      const button = document.querySelector('.location');

      // Should not crash (though behavior is undefined)
      expect(() => handler({ target: button })).not.toThrow();
    });

    test('should handle single item per category', () => {
      const singleSuggestions = {
        location: ['Only Location'],
        relationship: ['Only Relationship'],
        word: ['Only Word']
      };

      initializeSuggestions(singleSuggestions);

      const buttons = document.querySelectorAll('button');
      const suggestion = document.querySelector('.suggestion');

      // Should work for all categories
      buttons[0].click();
      expect(suggestion.innerText).toBe('Only Location');

      buttons[1].click();
      expect(suggestion.innerText).toBe('Only Relationship');

      buttons[2].click();
      expect(suggestion.innerText).toBe('Only Word');

      // Clicking again should show same items
      buttons[0].click();
      expect(suggestion.innerText).toBe('Only Location');
    });

    test('should handle very large suggestion arrays', () => {
      const hugeSuggestions = {
        location: Array(10000).fill(0).map((_, i) => `Location ${i}`),
        relationship: Array(10000).fill(0).map((_, i) => `Relationship ${i}`),
        word: Array(10000).fill(0).map((_, i) => `Word ${i}`)
      };

      const startTime = Date.now();
      initializeSuggestions(hugeSuggestions);
      const initTime = Date.now() - startTime;

      // Initialization should be fast even with large arrays
      expect(initTime).toBeLessThan(100);

      // Clicking should still be fast
      const clickStart = Date.now();
      document.querySelector('.location').click();
      const clickTime = Date.now() - clickStart;

      expect(clickTime).toBeLessThan(10);
    });
  });

  describe('Malformed Data', () => {
    test('should handle null values in arrays', () => {
      const malformedSuggestions = {
        location: ['Valid', null, 'Also Valid'],
        relationship: ['Valid Relationship'],
        word: ['Valid Word']
      };

      initializeSuggestions(malformedSuggestions);

      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Click through - should skip or handle null
      for (let i = 0; i < 5; i++) {
        expect(() => button.click()).not.toThrow();
      }
    });

    test('should handle undefined values in arrays', () => {
      const malformedSuggestions = {
        location: ['Valid', undefined, 'Also Valid'],
        relationship: ['Valid Relationship'],
        word: ['Valid Word']
      };

      initializeSuggestions(malformedSuggestions);

      const button = document.querySelector('.location');

      expect(() => button.click()).not.toThrow();
    });

    test('should handle numeric values in suggestion arrays', () => {
      const numericSuggestions = {
        location: ['Text', 12345, 'More Text'],
        relationship: ['Valid'],
        word: ['Valid']
      };

      initializeSuggestions(numericSuggestions);

      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      button.click();

      // Should convert number to string
      expect(suggestion.innerText).toBeTruthy();
    });

    test('should handle object in suggestion arrays', () => {
      const objectSuggestions = {
        location: ['Valid', { name: 'Object' }, 'Valid'],
        relationship: ['Valid'],
        word: ['Valid']
      };

      initializeSuggestions(objectSuggestions);

      const button = document.querySelector('.location');

      // Should not crash
      expect(() => button.click()).not.toThrow();
    });
  });

  describe('DOM Edge Cases', () => {
    test('should handle missing buttons gracefully', () => {
      document.querySelectorAll('button').forEach(btn => btn.remove());

      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      // Should not crash when no buttons exist
      expect(() => initializeSuggestions(suggestions)).not.toThrow();
    });

    test('should handle suggestion element being removed during click', () => {
      const suggestions = {
        location: ['Test Location'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      const button = document.querySelector('.location');

      // Remove suggestion element before click
      document.querySelector('.suggestion').remove();

      // Should not crash
      expect(() => button.click()).not.toThrow();
    });

    test('should handle button being disabled', () => {
      const suggestions = {
        location: ['Test Location'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      const button = document.querySelector('.location');
      button.disabled = true;

      // Disabled buttons don't fire click events in browsers/jsdom
      button.click();

      const suggestion = document.querySelector('.suggestion');
      // Disabled button click shouldn't trigger the handler, so text stays empty
      expect(suggestion.innerText).toBe('');
    });

    test('should handle buttons with no classes', () => {
      document.body.innerHTML += '<button id="no-class"></button>';

      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      const button = document.getElementById('no-class');
      const handler = getClickEventHandler(suggestions, 18, 29);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      handler({ target: button });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown button type clicked');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Extreme Font Sizing', () => {
    test('should handle extremely small font sizes', () => {
      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 1, 2);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(['1px', '2px']).toContain(suggestion.style.fontSize);
    });

    test('should handle extremely large font sizes', () => {
      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 100, 200);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(['100px', '200px']).toContain(suggestion.style.fontSize);
    });

    test('should handle same min and max font sizes', () => {
      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 20, 20);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(suggestion.style.fontSize).toBe('20px');
    });

    test('should handle zero font sizes', () => {
      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 0, 0);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(suggestion.style.fontSize).toBe('0px');
    });

    test('should handle negative font sizes', () => {
      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      // Negative sizes are invalid CSS but shouldn't crash
      initializeSuggestions(suggestions, -10, -5);

      expect(() => document.querySelector('.location').click()).not.toThrow();
    });
  });

  describe('Screen Width Edge Cases', () => {
    test('should handle zero width screen', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 0
      });

      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 18, 29);

      expect(() => document.querySelector('.location').click()).not.toThrow();
    });

    test('should handle extremely wide screen', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 10000
      });

      const suggestions = {
        location: ['Short'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 18, 29);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(suggestion.style.fontSize).toBe('29px'); // Should use large font
    });

    test('should handle exactly at breakpoint (550px)', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 550 // Exactly at BREAKPOINT_MOBILE
      });

      const suggestions = {
        location: ['Short'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 18, 29);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      // At exactly 550, not wide enough (> 550), but 'Short' is <= 17 chars
      // So it should use large font (29px) due to short text
      expect(suggestion.style.fontSize).toBe('29px');
    });
  });

  describe('Special Characters in Suggestions', () => {
    test('should handle suggestions with HTML characters', () => {
      const suggestions = {
        location: ['<script>alert("xss")</script>'],
        relationship: ['Test & Test'],
        word: ['Test < > " \' &']
      };

      initializeSuggestions(suggestions);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      // Should display as text, not execute
      expect(suggestion.innerText).toContain('script');
    });

    test('should handle suggestions with newlines', () => {
      const suggestions = {
        location: ['Line1\nLine2'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(suggestion.innerText).toContain('Line1');
    });

    test('should handle suggestions with tabs', () => {
      const suggestions = {
        location: ['Word1\tWord2'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(suggestion.innerText).toBeTruthy();
    });

    test('should handle emojis in suggestions', () => {
      const suggestions = {
        location: ['Beach 🏖️'],
        relationship: ['Parent/Child 👨‍👧'],
        word: ['Love ❤️']
      };

      initializeSuggestions(suggestions);

      const buttons = document.querySelectorAll('button');
      const suggestion = document.querySelector('.suggestion');

      buttons[0].click();
      expect(suggestion.innerText).toContain('Beach');

      buttons[1].click();
      expect(suggestion.innerText).toContain('Parent/Child');

      buttons[2].click();
      expect(suggestion.innerText).toContain('Love');
    });

    test('should handle very long single word (no spaces)', () => {
      const longWord = 'A'.repeat(1000);
      const suggestions = {
        location: [longWord],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions, 18, 29);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(suggestion.innerText).toBe(longWord);
      // Default width is 1024 (wideEnough = true), so uses large font (29px)
      expect(suggestion.style.fontSize).toBe('29px');
    });

    test('should handle zero-width characters', () => {
      const suggestions = {
        location: ['Test\u200BWord'], // Zero-width space
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      expect(() => document.querySelector('.location').click()).not.toThrow();
    });
  });

  describe('Rapid and Concurrent Operations', () => {
    test('should handle rapid clicking on same button', () => {
      const suggestions = {
        location: ['Loc1', 'Loc2', 'Loc3'],
        relationship: ['Rel1'],
        word: ['Word1']
      };

      initializeSuggestions(suggestions);

      const button = document.querySelector('.location');

      // Click 100 times rapidly
      for (let i = 0; i < 100; i++) {
        button.click();
      }

      const suggestion = document.querySelector('.suggestion');
      expect(suggestions.location).toContain(suggestion.innerText);
    });

    test('should handle rapid reinitialization', () => {
      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      // Initialize 100 times
      for (let i = 0; i < 100; i++) {
        initializeSuggestions(suggestions);
      }

      // Should still work
      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toBe('Test');
    });

    test('should handle clicks during initialization', () => {
      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      const button = document.querySelector('.location');

      // Click before initialization
      button.click();

      // Initialize
      initializeSuggestions(suggestions);

      // Should work after initialization
      button.click();
      expect(document.querySelector('.suggestion').innerText).toBe('Test');
    });
  });

  describe('Memory Leaks and Cleanup', () => {
    test('should clean up old handlers on reinitialization', () => {
      const suggestions1 = {
        location: ['First'],
        relationship: ['Test'],
        word: ['Test']
      };

      const suggestions2 = {
        location: ['Second'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions1);
      initializeSuggestions(suggestions2);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      // Should show second set, not first
      expect(suggestion.innerText).toBe('Second');
    });

    test('should handle many sequential reinitializations without memory issues', () => {
      // Simulate language switching many times
      for (let i = 0; i < 1000; i++) {
        const suggestions = {
          location: [`Location ${i}`],
          relationship: ['Test'],
          word: ['Test']
        };
        initializeSuggestions(suggestions);
      }

      // Should still work
      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toContain('Location 999');
    });
  });

  describe('Unusual Button Configurations', () => {
    test('should handle button inside nested elements', () => {
      document.body.innerHTML = `
        <div class="wrapper">
          <div class="inner">
            <button class="location">Location</button>
          </div>
        </div>
        <div class="suggestion"></div>
      `;

      const suggestions = {
        location: ['Test'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toBe('Test');
    });

    test('should handle button with child elements', () => {
      document.body.innerHTML = `
        <button class="location">
          <span class="icon">📍</span>
          <span class="text">Location</span>
        </button>
        <div class="suggestion"></div>
      `;

      const suggestions = {
        location: ['Test Location'],
        relationship: ['Test'],
        word: ['Test']
      };

      initializeSuggestions(suggestions);

      // Click on the button itself
      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toBe('Test Location');
    });
  });
});
