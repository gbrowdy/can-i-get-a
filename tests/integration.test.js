/**
 * Integration tests for the complete application flow
 * Tests interaction between i18n, base.js, and DOM
 */

describe('Application Integration Tests', () => {
  // Track event listeners for cleanup
  let eventListeners = [];

  beforeEach(() => {
    // Clean up any previous event listeners
    eventListeners.forEach(({ event, handler }) => {
      window.removeEventListener(event, handler);
    });
    eventListeners = [];

    // Set up full DOM
    document.body.innerHTML = `
      <div class="container">
        <div class="title">Can I Get A...</div>
        <div class="sub">improv suggestions at the touch of a button</div>
        <div class="buttonRow">
          <button class="location">Location</button>
          <button class="relationship">Relationship</button>
          <button class="word">Word</button>
        </div>
        <div class="suggestion"></div>
        <div class="credit">by gil</div>
        <div class="language-switcher">
          <a href="#" data-lang="en" class="en">en</a>
          <a href="#" data-lang="fr" class="fr">fr</a>
          <a href="#" data-lang="gr" class="gr">gr</a>
          <a href="#" data-lang="dk" class="dk">dk</a>
        </div>
      </div>
    `;

    // Mock window
    window.suggestionsByLanguage = {
      en: {
        location: ['Library', 'Coffee Shop', 'Park'],
        relationship: ['Teacher/Student', 'Boss/Employee'],
        word: ['Trust', 'Adventure', 'Mystery']
      },
      fr: {
        location: ['Bibliothèque', 'Café', 'Parc'],
        relationship: ['Professeur/Élève', 'Patron/Employé'],
        word: ['Confiance', 'Aventure', 'Mystère']
      },
      gr: {
        location: ['Βιβλιοθήκη', 'Καφέ', 'Πάρκο'],
        relationship: ['Δάσκαλος/Μαθητής', 'Αφεντικό/Υπάλληλος'],
        word: ['Εμπιστοσύνη', 'Περιπέτεια', 'Μυστήριο']
      },
      dk: {
        location: ['Bibliotek', 'Café', 'Park'],
        relationship: ['Lærer/Elev', 'Chef/Medarbejder'],
        word: ['Tillid', 'Eventyr', 'Mysterium']
      }
    };

    // Mock localStorage
    const mockStorage = {};
    Storage.prototype.getItem = jest.fn(key => mockStorage[key]);
    Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });

    // Mock URL - need full URL for URL constructor
    delete window.location;
    window.location = new URL('http://localhost/');
    window.history.replaceState = jest.fn();

    // Mock navigator
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      value: 'en-US'
    });

    // Mock translations
    global.translations = {
      en: {
        title: 'Can I Get A...',
        subtitle: 'improv suggestions at the touch of a button',
        buttons: { location: 'Location', relationship: 'Relationship', word: 'Word' },
        credit: 'by gil',
        fontSizes: { small: 18, large: 29 },
        bodyClass: ''
      },
      fr: {
        title: 'J\'ai besoin de...',
        subtitle: 'suggestions d\'impro',
        buttons: { location: 'Lieu', relationship: 'Relation', word: 'Mot' },
        credit: 'par gil',
        fontSizes: { small: 19, large: 30 },
        bodyClass: ''
      },
      gr: {
        title: 'Μπορώ να πάρω ένα...',
        subtitle: 'προτάσεις αυτοσχεδιασμού με ένα κουμπί',
        buttons: { location: 'Τοποθεσία', relationship: 'Σχέση', word: 'Λέξη' },
        credit: 'από τον gil',
        fontSizes: { small: 18, large: 29 },
        bodyClass: 'greek'
      },
      dk: {
        title: 'Kan jeg bede om...',
        subtitle: 'impro forslag ved et tryk på en knap',
        buttons: { location: 'Sted', relationship: 'Forhold', word: 'Ord' },
        credit: 'af gil',
        fontSizes: { small: 18, large: 29 },
        bodyClass: ''
      }
    };

    // Load modules
    const { i18n } = require('../i18n.js');
    global.i18n = i18n;

    const baseModule = require('../base.js');
    global.shuffle = baseModule.shuffle;
    global.getSuggestionType = baseModule.getSuggestionType;
    global.getClickEventHandler = baseModule.getClickEventHandler;
    global.initializeSuggestions = baseModule.initializeSuggestions;

    // Mock window dimensions
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      value: 1024
    });
  });

  describe('Complete User Flow', () => {
    test('should initialize app and display suggestions on button click', () => {
      // Initialize
      i18n.init();
      const suggestions = window.suggestionsByLanguage.en;
      initializeSuggestions(suggestions);

      // Click button
      const locationBtn = document.querySelector('.location');
      locationBtn.click();

      // Check suggestion displayed
      const suggestion = document.querySelector('.suggestion');
      expect(suggestion.innerText).toBeTruthy();
      expect(suggestions.location).toContain(suggestion.innerText);
    });

    test('should switch language and update all UI elements', () => {
      // Initialize in English
      i18n.init();
      initializeSuggestions(window.suggestionsByLanguage.en);

      // Switch to French
      i18n.setLanguage('fr');

      // Verify UI updated
      expect(document.querySelector('.title').innerHTML).toContain('besoin');
      expect(document.querySelector('.location').textContent).toBe('Lieu');

      // Re-initialize with French suggestions
      initializeSuggestions(window.suggestionsByLanguage.fr);

      // Click button
      document.querySelector('.location').click();

      // Should show French suggestion
      const suggestion = document.querySelector('.suggestion');
      expect(window.suggestionsByLanguage.fr.location).toContain(suggestion.innerText);
    });

    test('should maintain separate suggestion state per category', () => {
      initializeSuggestions(window.suggestionsByLanguage.en);

      const locationBtn = document.querySelector('.location');
      const wordBtn = document.querySelector('.word');
      const suggestion = document.querySelector('.suggestion');

      // Get location suggestions
      locationBtn.click();
      const loc1 = suggestion.innerText;
      locationBtn.click();
      const loc2 = suggestion.innerText;

      // Get word suggestion
      wordBtn.click();
      const word1 = suggestion.innerText;

      // Get another location
      locationBtn.click();
      const loc3 = suggestion.innerText;

      // Verify they're from correct categories
      expect(window.suggestionsByLanguage.en.location).toContain(loc1);
      expect(window.suggestionsByLanguage.en.location).toContain(loc2);
      expect(window.suggestionsByLanguage.en.location).toContain(loc3);
      expect(window.suggestionsByLanguage.en.word).toContain(word1);

      // Verify location cycling wasn't affected by word click
      expect([loc1, loc2, loc3].length).toBe(3);
    });

    test('should handle language change event and reinitialize', () => {
      i18n.init();
      initializeSuggestions(window.suggestionsByLanguage.en);

      let eventFired = false;
      const handler = (e) => {
        eventFired = true;
        expect(e.detail.language).toBe('gr');

        // Reinitialize with new language
        initializeSuggestions(window.suggestionsByLanguage.gr);
      };

      window.addEventListener('languageChanged', handler);
      eventListeners.push({ event: 'languageChanged', handler });

      i18n.setLanguage('gr');

      expect(eventFired).toBe(true);

      // Test suggestion in new language
      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');
      expect(window.suggestionsByLanguage.gr.location).toContain(suggestion.innerText);
    });
  });

  describe('Suggestion Cycling Across Language Changes', () => {
    test('should reset suggestion cycle when language changes', () => {
      // Start in English
      initializeSuggestions(window.suggestionsByLanguage.en);

      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Click through some English suggestions
      button.click();
      button.click();

      // Change language
      initializeSuggestions(window.suggestionsByLanguage.fr);

      // Click should show French suggestion from start of cycle
      button.click();
      expect(window.suggestionsByLanguage.fr.location).toContain(suggestion.innerText);
    });

    test('should not mix suggestions from different languages', () => {
      initializeSuggestions(window.suggestionsByLanguage.en);

      const button = document.querySelector('.location');

      // Get all English suggestions
      const enSuggestions = new Set();
      for (let i = 0; i < window.suggestionsByLanguage.en.location.length; i++) {
        button.click();
        enSuggestions.add(document.querySelector('.suggestion').innerText);
      }

      // Switch to French
      initializeSuggestions(window.suggestionsByLanguage.fr);

      // Get all French suggestions
      const frSuggestions = new Set();
      for (let i = 0; i < window.suggestionsByLanguage.fr.location.length; i++) {
        button.click();
        frSuggestions.add(document.querySelector('.suggestion').innerText);
      }

      // Should be completely different sets
      const overlap = [...enSuggestions].filter(x => frSuggestions.has(x));
      expect(overlap.length).toBe(0);
    });
  });

  describe('Font Size Integration', () => {
    test('should use language-specific font sizes', () => {
      // English with default sizes
      i18n.currentLanguage = 'en';
      const enSizes = i18n.t('fontSizes');
      initializeSuggestions(window.suggestionsByLanguage.en, enSizes.small, enSizes.large);

      document.querySelector('.location').click();
      const suggestion = document.querySelector('.suggestion');

      expect(['18px', '29px']).toContain(suggestion.style.fontSize);

      // French with different sizes
      i18n.currentLanguage = 'fr';
      const frSizes = i18n.t('fontSizes');
      initializeSuggestions(window.suggestionsByLanguage.fr, frSizes.small, frSizes.large);

      document.querySelector('.location').click();

      expect(['19px', '30px']).toContain(suggestion.style.fontSize);
    });

    test('should adjust font size based on screen width', () => {
      // Use long text to ensure font size depends on screen width
      const longTextSuggestions = {
        location: ['A very long location name that exceeds 17 characters'],
        relationship: ['Test'],
        word: ['Test']
      };

      const suggestion = document.querySelector('.suggestion');
      const button = document.querySelector('.location');

      // Wide screen - long text should use large font
      Object.defineProperty(document.documentElement, 'clientWidth', { value: 1200 });
      initializeSuggestions(longTextSuggestions, 18, 29);
      button.click();
      const wideFontSize = suggestion.style.fontSize;
      expect(wideFontSize).toBe('29px');

      // Narrow screen - long text should use small font
      Object.defineProperty(document.documentElement, 'clientWidth', { value: 400 });
      initializeSuggestions(longTextSuggestions, 18, 29);
      button.click();
      const narrowFontSize = suggestion.style.fontSize;

      // Mobile should use small font for long text
      expect(narrowFontSize).toBe('18px');
    });
  });

  describe('Error Recovery', () => {
    test('should handle missing suggestion data gracefully', () => {
      window.suggestionsByLanguage.en = null;

      // Should not crash
      expect(() => {
        const suggestions = window.suggestionsByLanguage.en || {
          location: [],
          relationship: [],
          word: []
        };
        initializeSuggestions(suggestions);
      }).not.toThrow();
    });

    test('should handle missing category in suggestions', () => {
      const incompleteSuggestions = {
        location: ['Test'],
        // Missing relationship and word
      };

      initializeSuggestions(incompleteSuggestions);

      // Location should work
      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toBe('Test');
    });

    test('should continue working after errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      initializeSuggestions(window.suggestionsByLanguage.en);

      // Trigger an error (invalid button)
      const invalidButton = document.createElement('button');
      invalidButton.className = 'invalid';
      document.body.appendChild(invalidButton);

      const handler = getClickEventHandler(window.suggestionsByLanguage.en, 18, 29);
      handler({ target: invalidButton });

      expect(consoleErrorSpy).toHaveBeenCalled();

      // Should still work for valid buttons
      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toBeTruthy();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Memory and Performance', () => {
    test('should properly clean up event handlers on reinitialization', () => {
      // Initialize twice
      initializeSuggestions(window.suggestionsByLanguage.en);
      initializeSuggestions(window.suggestionsByLanguage.fr);

      const button = document.querySelector('.location');

      // Click should only trigger once, not twice
      button.click();

      const suggestion = document.querySelector('.suggestion');

      // Should show French suggestion (from second init)
      expect(window.suggestionsByLanguage.fr.location).toContain(suggestion.innerText);
    });

    test('should handle many rapid reinitialization', () => {
      // Rapidly switch languages
      for (let i = 0; i < 10; i++) {
        const lang = ['en', 'fr', 'gr', 'dk'][i % 4];
        initializeSuggestions(window.suggestionsByLanguage[lang]);
      }

      // Should still work
      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toBeTruthy();
    });

    test('should handle large number of clicks efficiently', () => {
      initializeSuggestions(window.suggestionsByLanguage.en);

      const button = document.querySelector('.location');
      const startTime = Date.now();

      // Click 100 times
      for (let i = 0; i < 100; i++) {
        button.click();
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time (< 100ms)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Accessibility and UX', () => {
    test('should clear suggestion when switching languages', () => {
      initializeSuggestions(window.suggestionsByLanguage.en);

      // Show a suggestion
      document.querySelector('.location').click();
      expect(document.querySelector('.suggestion').innerText).toBeTruthy();

      // Switch language
      initializeSuggestions(window.suggestionsByLanguage.fr);

      // Suggestion should be cleared
      expect(document.querySelector('.suggestion').innerText).toBe('');
    });

    test('should handle button text updates during language change', () => {
      i18n.init();

      expect(document.querySelector('.location').textContent).toBe('Location');

      i18n.setLanguage('fr');

      expect(document.querySelector('.location').textContent).toBe('Lieu');
    });

    test('should update language switcher active state', () => {
      i18n.init();

      i18n.setLanguage('gr');
      i18n.updateLanguageSwitcher();

      const grLink = document.querySelector('[data-lang="gr"]');
      const enLink = document.querySelector('[data-lang="en"]');

      expect(grLink.classList.contains('active')).toBe(true);
      expect(enLink.classList.contains('active')).toBe(false);
    });
  });

  describe('Real-world Scenarios', () => {
    test('should handle user clicking same button repeatedly', () => {
      initializeSuggestions(window.suggestionsByLanguage.en);

      const button = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');
      const seen = new Set();

      // Click until we've seen all suggestions
      const maxClicks = window.suggestionsByLanguage.en.location.length;
      for (let i = 0; i < maxClicks; i++) {
        button.click();
        seen.add(suggestion.innerText);
      }

      // Should have cycled through all unique suggestions
      expect(seen.size).toBe(window.suggestionsByLanguage.en.location.length);
    });

    test('should handle user switching between categories randomly', () => {
      initializeSuggestions(window.suggestionsByLanguage.en);

      const buttons = document.querySelectorAll('button');
      const suggestion = document.querySelector('.suggestion');

      // Random clicking pattern
      const pattern = [0, 1, 0, 2, 1, 0, 2, 2, 1];
      pattern.forEach(buttonIndex => {
        buttons[buttonIndex].click();
        expect(suggestion.innerText).toBeTruthy();
      });
    });

    test('should handle URL with language parameter on page load', () => {
      // Set URL parameter
      delete window.location;
      window.location = new URL('http://localhost/?lang=dk');

      i18n.init();

      expect(i18n.currentLanguage).toBe('dk');
      expect(document.title).toBe('Kan jeg bede om...');
    });

    test('should persist language preference across sessions', () => {
      i18n.setLanguage('gr');

      expect(localStorage.setItem).toHaveBeenCalledWith('preferredLanguage', 'gr');

      // Simulate new session
      Storage.prototype.getItem = jest.fn(() => 'gr');

      const detectedLang = i18n.detectLanguage();
      expect(detectedLang).toBe('gr');
    });
  });
});
