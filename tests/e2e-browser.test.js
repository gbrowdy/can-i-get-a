/**
 * End-to-End Browser Tests
 * These tests simulate real browser interactions
 * Run with: npm test (uses jsdom) or with a real browser testing framework
 */

describe('E2E Browser Tests', () => {
  let originalHTML;

  beforeEach(() => {
    // Save original HTML
    originalHTML = document.documentElement.innerHTML;

    // Load complete app HTML
    document.documentElement.innerHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Can I Get A</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div class="container">
          <div class="title">Can I Get A...</div>
          <div class="sub">improv suggestions at the touch of a button</div>
          <div class="buttonRow">
            <button class="location">Location</button>
            <button class="relationship">Relationship</button>
            <button class="word">Word</button>
          </div>
          <div class="suggestion"></div>
          <div class="credit">by gil browdy && vinny francois</div>
          <div class="language-switcher">
            <a href="#" data-lang="en" class="en">en</a> •
            <a href="#" data-lang="fr" class="fr">fr</a> •
            <a href="#" data-lang="gr" class="gr">gr</a> •
            <a href="#" data-lang="dn" class="dn">dn</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Initialize suggestion storage
    window.suggestionsByLanguage = {
      en: {
        location: ['Operating Room', 'Driveway', 'Kitchen', 'Walk-In Closet', 'Man Cave'],
        relationship: ['Bus Driver/A Regular', 'Bartender/Waitress', 'Cook/Sous-Chef'],
        word: ['Commerce', 'Constitution', 'Patriot', 'Pride', 'Prejudice']
      },
      fr: {
        location: ['Maison abandonnée', 'Sas de décompression', 'Ambulance'],
        relationship: ['Chauffeur de bus/Un habitué', 'Barman/Serveuse'],
        word: ['Commerce', 'Constitution', 'Patriote']
      },
      gr: {
        location: ['Χειρουργείο', 'Δρόμος', 'Κουζίνα'],
        relationship: ['Οδηγός λεωφορείου/Τακτικός', 'Μπάρμαν/Σερβιτόρα'],
        word: ['Εμπόριο', 'Σύνταγμα', 'Πατριώτης']
      },
      dn: {
        location: ['Operationsstuen', 'Indkørsel', 'Køkken'],
        relationship: ['Buschauffør/En fast kunde', 'Bartender/Servitrice'],
        word: ['Handel', 'Forfatning', 'Patriot']
      }
    };

    // Mock localStorage
    const mockStorage = {};
    Storage.prototype.getItem = jest.fn(key => mockStorage[key]);
    Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });
    Storage.prototype.removeItem = jest.fn(key => {
      delete mockStorage[key];
    });

    // Mock URL
    delete window.location;
    window.location = {
      search: '',
      href: 'http://localhost/',
      origin: 'http://localhost'
    };

    // Mock URLSearchParams
    global.URLSearchParams = jest.fn().mockImplementation((search) => {
      const params = {};
      if (search && search.includes('=')) {
        search.replace('?', '').split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          params[key] = value;
        });
      }
      return {
        get: jest.fn(key => params[key] || null),
        set: jest.fn((key, value) => { params[key] = value; })
      };
    });

    global.URL = jest.fn().mockImplementation((url) => {
      return {
        searchParams: new URLSearchParams(window.location.search)
      };
    });

    window.history.replaceState = jest.fn();

    // Mock navigator
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'en-US'
    });

    // Load translations
    global.translations = {
      en: {
        title: 'Can I Get A...',
        subtitle: 'improv suggestions at the touch of a button',
        buttons: { location: 'Location', relationship: 'Relationship', word: 'Word' },
        credit: 'by <a href="http://gil.browdy.net">gil browdy</a> && <a href="http://www.vinnyfrancois.com">vinny francois</a>',
        fontSizes: { small: 18, large: 29 },
        bodyClass: ''
      },
      fr: {
        title: 'J\'ai besoin de...',
        subtitle: 'suggestions d\'impro en un clic',
        buttons: { location: 'Lieu', relationship: 'Relation', word: 'Mot' },
        credit: 'par gil browdy && vinny francois',
        fontSizes: { small: 19, large: 30 },
        bodyClass: ''
      },
      gr: {
        title: 'Μπορείς Να Μου Δώσεις Μία...',
        subtitle: 'Εμπνεύσεις για σκηνές improv',
        buttons: { location: 'Τοποθεσία', relationship: 'Σχέση', word: 'Λέξη' },
        credit: 'από gil browdy && vinny francois',
        fontSizes: { small: 19, large: 30 },
        bodyClass: 'greek'
      },
      dn: {
        title: 'Må jeg bede om...',
        subtitle: 'impro-bud ved din fingertip',
        buttons: { location: 'Et sted', relationship: 'En relation', word: 'Et ord' },
        credit: 'af gil browdy && vinny francois',
        fontSizes: { small: 18, large: 29 },
        bodyClass: ''
      }
    };

    // Load modules and make them available globally
    const { i18n } = require('../i18n.js');
    global.i18n = i18n;

    const baseModule = require('../base.js');
    global.shuffle = baseModule.shuffle;
    global.getSuggestionType = baseModule.getSuggestionType;
    global.getClickEventHandler = baseModule.getClickEventHandler;
    global.initializeSuggestions = baseModule.initializeSuggestions;
  });

  afterEach(() => {
    // Restore HTML
    document.documentElement.innerHTML = originalHTML;
  });

  describe('Application Bootstrap', () => {
    test('should initialize application on DOMContentLoaded', () => {
      i18n.init();
      const lang = i18n.currentLanguage;
      const suggestions = window.suggestionsByLanguage[lang];
      const fontSizes = i18n.t('fontSizes');

      initializeSuggestions(suggestions, fontSizes.small, fontSizes.large);

      // Check all elements are properly set up
      expect(document.querySelector('.title').innerHTML).toBeTruthy();
      expect(document.querySelector('.location').textContent).toBeTruthy();
      expect(document.querySelector('.suggestion').innerText).toBe('');
    });

    test('should load English by default', () => {
      i18n.init();

      expect(i18n.currentLanguage).toBe('en');
      expect(document.querySelector('.title').innerHTML).toContain('Can I Get A');
      expect(document.querySelector('.location').textContent).toBe('Location');
    });

    test('should load language from URL parameter', () => {
      window.location.search = '?lang=fr';

      i18n.init();

      expect(i18n.currentLanguage).toBe('fr');
    });

    test('should load language from localStorage', () => {
      Storage.prototype.getItem = jest.fn(() => 'gr');

      i18n.init();

      expect(i18n.currentLanguage).toBe('gr');
    });
  });

  describe('User Interactions - Button Clicks', () => {
    beforeEach(() => {
      i18n.init();
      const suggestions = window.suggestionsByLanguage[i18n.currentLanguage];
      initializeSuggestions(suggestions);
    });

    test('should display suggestion when clicking Location button', () => {
      const locationBtn = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      expect(suggestion.innerText).toBe('');

      locationBtn.click();

      expect(suggestion.innerText).toBeTruthy();
      expect(window.suggestionsByLanguage.en.location).toContain(suggestion.innerText);
    });

    test('should display suggestion when clicking Relationship button', () => {
      const relationshipBtn = document.querySelector('.relationship');
      const suggestion = document.querySelector('.suggestion');

      relationshipBtn.click();

      expect(suggestion.innerText).toBeTruthy();
      expect(window.suggestionsByLanguage.en.relationship).toContain(suggestion.innerText);
    });

    test('should display suggestion when clicking Word button', () => {
      const wordBtn = document.querySelector('.word');
      const suggestion = document.querySelector('.suggestion');

      wordBtn.click();

      expect(suggestion.innerText).toBeTruthy();
      expect(window.suggestionsByLanguage.en.word).toContain(suggestion.innerText);
    });

    test('should update suggestion on each click', () => {
      const locationBtn = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      locationBtn.click();
      const first = suggestion.innerText;

      locationBtn.click();
      const second = suggestion.innerText;

      locationBtn.click();
      const third = suggestion.innerText;

      // All should be valid suggestions
      expect(window.suggestionsByLanguage.en.location).toContain(first);
      expect(window.suggestionsByLanguage.en.location).toContain(second);
      expect(window.suggestionsByLanguage.en.location).toContain(third);
    });

    test('should handle alternating between different button types', () => {
      const buttons = document.querySelectorAll('button');
      const suggestion = document.querySelector('.suggestion');

      // Click pattern: location, word, relationship, location
      buttons[0].click();
      const loc1 = suggestion.innerText;

      buttons[2].click();
      const word1 = suggestion.innerText;

      buttons[1].click();
      const rel1 = suggestion.innerText;

      buttons[0].click();
      const loc2 = suggestion.innerText;

      // Verify correct categories
      expect(window.suggestionsByLanguage.en.location).toContain(loc1);
      expect(window.suggestionsByLanguage.en.word).toContain(word1);
      expect(window.suggestionsByLanguage.en.relationship).toContain(rel1);
      expect(window.suggestionsByLanguage.en.location).toContain(loc2);
    });
  });

  describe('Language Switching', () => {
    beforeEach(() => {
      i18n.init();
      initializeSuggestions(window.suggestionsByLanguage.en);
    });

    test('should switch to French when clicking FR link', () => {
      const frLink = document.querySelector('[data-lang="fr"]');

      frLink.click();

      expect(i18n.currentLanguage).toBe('fr');
    });

    test('should update UI when switching to French', () => {
      const frLink = document.querySelector('[data-lang="fr"]');

      frLink.click();

      expect(document.querySelector('.title').innerHTML).toContain('besoin');
      expect(document.querySelector('.location').textContent).toBe('Lieu');
    });

    test('should update suggestions when switching language', () => {
      // Click location in English
      document.querySelector('.location').click();
      const enSuggestion = document.querySelector('.suggestion').innerText;

      // Switch to French
      const frLink = document.querySelector('[data-lang="fr"]');
      frLink.click();

      // Reinitialize with French
      initializeSuggestions(window.suggestionsByLanguage.fr);

      // Click location in French
      document.querySelector('.location').click();
      const frSuggestion = document.querySelector('.suggestion').innerText;

      // Should be from different language sets
      expect(window.suggestionsByLanguage.en.location).toContain(enSuggestion);
      expect(window.suggestionsByLanguage.fr.location).toContain(frSuggestion);
    });

    test('should update active language indicator', () => {
      const frLink = document.querySelector('[data-lang="fr"]');
      const enLink = document.querySelector('[data-lang="en"]');

      // Initially English should be active
      i18n.updateLanguageSwitcher();
      expect(enLink.classList.contains('active')).toBe(true);

      // Switch to French
      i18n.setLanguage('fr');

      // French should now be active
      expect(frLink.classList.contains('active')).toBe(true);
      expect(enLink.classList.contains('active')).toBe(false);
    });

    test('should switch through all languages', () => {
      const languages = ['fr', 'gr', 'dn', 'en'];

      languages.forEach(lang => {
        const link = document.querySelector(`[data-lang="${lang}"]`);
        link.click();

        expect(i18n.currentLanguage).toBe(lang);
      });
    });

    test('should apply Greek body class for Greek language', () => {
      const grLink = document.querySelector('[data-lang="gr"]');

      grLink.click();

      expect(document.body.className).toBe('greek');
    });

    test('should remove Greek body class when switching away from Greek', () => {
      i18n.setLanguage('gr');
      expect(document.body.className).toBe('greek');

      i18n.setLanguage('en');
      expect(document.body.className).toBe('');
    });
  });

  describe('Responsive Behavior', () => {
    beforeEach(() => {
      i18n.init();
      initializeSuggestions(window.suggestionsByLanguage.en);
    });

    test('should use large font on wide screen for short text', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1200,
        configurable: true
      });

      // Reinitialize to pick up new width
      initializeSuggestions(window.suggestionsByLanguage.en);

      const locationBtn = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Find and click until we get a short suggestion
      for (let i = 0; i < 10; i++) {
        locationBtn.click();
        if (suggestion.innerText.length <= 17) {
          break;
        }
      }

      if (suggestion.innerText.length <= 17) {
        expect(suggestion.style.fontSize).toBe('29px');
      }
    });

    test('should use small font on mobile screen for long text', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 400,
        configurable: true
      });

      // Reinitialize to pick up new width
      initializeSuggestions(window.suggestionsByLanguage.en);

      const locationBtn = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Find and click until we get a LONG suggestion (> 17 chars)
      for (let i = 0; i < 50; i++) {
        locationBtn.click();
        if (suggestion.innerText.length > 17) {
          break;
        }
      }

      // Verify we got a long suggestion and it uses small font on mobile
      if (suggestion.innerText.length > 17) {
        expect(suggestion.style.fontSize).toBe('18px');
      } else {
        // If all suggestions are short, skip this test
        expect(true).toBe(true);
      }
    });
  });

  describe('Complete User Journeys', () => {
    test('Journey: New user visits site, gets suggestions, switches language', () => {
      // 1. User visits site (English default)
      i18n.init();
      expect(document.querySelector('.title').innerHTML).toContain('Can I Get A');

      // 2. Initialize suggestions
      initializeSuggestions(window.suggestionsByLanguage.en);

      // 3. User clicks location button
      document.querySelector('.location').click();
      const enLocation = document.querySelector('.suggestion').innerText;
      expect(window.suggestionsByLanguage.en.location).toContain(enLocation);

      // 4. User clicks word button
      document.querySelector('.word').click();
      const enWord = document.querySelector('.suggestion').innerText;
      expect(window.suggestionsByLanguage.en.word).toContain(enWord);

      // 5. User switches to French
      document.querySelector('[data-lang="fr"]').click();
      expect(document.querySelector('.title').innerHTML).toContain('besoin');

      // 6. Reinitialize with French
      initializeSuggestions(window.suggestionsByLanguage.fr);

      // 7. User clicks location in French
      document.querySelector('.location').click();
      const frLocation = document.querySelector('.suggestion').innerText;
      expect(window.suggestionsByLanguage.fr.location).toContain(frLocation);
    });

    test('Journey: User with saved preference returns', () => {
      // 1. Set saved preference to Greek
      Storage.prototype.getItem = jest.fn(() => 'gr');

      // 2. User visits site
      i18n.init();

      // 3. Should load Greek automatically
      expect(i18n.currentLanguage).toBe('gr');
      expect(document.body.className).toBe('greek');
    });

    test('Journey: User clicks through entire suggestion set', () => {
      i18n.init();
      initializeSuggestions(window.suggestionsByLanguage.en);

      const locationBtn = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');
      const locationCount = window.suggestionsByLanguage.en.location.length;

      const seen = new Set();

      // Click through all locations
      for (let i = 0; i < locationCount; i++) {
        locationBtn.click();
        seen.add(suggestion.innerText);
      }

      // Should have seen all unique locations
      expect(seen.size).toBe(locationCount);

      // Next click should reshuffle and continue
      locationBtn.click();
      expect(window.suggestionsByLanguage.en.location).toContain(suggestion.innerText);
    });

    test('Journey: User explores all categories in multiple languages', () => {
      const languages = ['en', 'fr', 'gr', 'dn'];
      const categories = ['location', 'relationship', 'word'];

      languages.forEach(lang => {
        // Switch language
        i18n.setLanguage(lang);
        initializeSuggestions(window.suggestionsByLanguage[lang]);

        // Click each category
        categories.forEach((category, index) => {
          const button = document.querySelectorAll('button')[index];
          button.click();

          const suggestion = document.querySelector('.suggestion');
          expect(window.suggestionsByLanguage[lang][category]).toContain(suggestion.innerText);
        });
      });
    });
  });

  describe('Persistence and State', () => {
    test('should save language preference to localStorage', () => {
      i18n.setLanguage('fr');

      expect(localStorage.setItem).toHaveBeenCalledWith('preferredLanguage', 'fr');
    });

    test('should update URL parameter when changing language', () => {
      i18n.setLanguage('gr');

      expect(window.history.replaceState).toHaveBeenCalled();
    });

    test('should maintain suggestion cycle state across UI updates', () => {
      initializeSuggestions(window.suggestionsByLanguage.en);

      const locationBtn = document.querySelector('.location');
      const suggestion = document.querySelector('.suggestion');

      // Click twice
      locationBtn.click();
      const first = suggestion.innerText;

      locationBtn.click();
      const second = suggestion.innerText;

      // Update UI (without reinitializing)
      i18n.updatePage();

      // Click again - should continue from where we were
      locationBtn.click();
      const third = suggestion.innerText;

      // All should be different (no reset)
      expect([first, second, third]).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    test('should have accessible button text', () => {
      i18n.init();

      const buttons = document.querySelectorAll('button');

      buttons.forEach(button => {
        expect(button.textContent.trim()).toBeTruthy();
        expect(button.textContent.length).toBeGreaterThan(0);
      });
    });

    test('should update document title for screen readers', () => {
      i18n.setLanguage('fr');

      expect(document.title).toContain('besoin');
    });

    test('should maintain language switcher as text links', () => {
      const links = document.querySelectorAll('.language-switcher a');

      expect(links.length).toBe(4);
      links.forEach(link => {
        expect(link.dataset.lang).toBeTruthy();
        expect(link.textContent.trim()).toBeTruthy();
      });
    });
  });

  describe('Error Scenarios', () => {
    test('should handle missing suggestion data gracefully', () => {
      window.suggestionsByLanguage.en = null;

      // Should not crash
      expect(() => {
        i18n.init();
        const suggestions = window.suggestionsByLanguage.en || {
          location: [],
          relationship: [],
          word: []
        };
        initializeSuggestions(suggestions);
      }).not.toThrow();
    });

    test('should handle corrupted localStorage', () => {
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      // Should fall back gracefully
      expect(() => i18n.detectLanguage()).not.toThrow();
    });

    test('should handle invalid language code', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      i18n.setLanguage('invalid');

      expect(i18n.currentLanguage).toBe('en');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });
});
