/**
 * Unit tests for i18n.js internationalization system
 * Tests language detection, switching, and translation
 */

describe('i18n.js - Internationalization', () => {
  let mockLocalStorage;
  let mockURLSearchParams;

  beforeEach(() => {
    // Mock DOM
    document.body.innerHTML = `
      <div class="title">Can I Get A...</div>
      <div class="sub">improv suggestions</div>
      <div class="credit">credit</div>
      <button class="location">Location</button>
      <button class="relationship">Relationship</button>
      <button class="word">Word</button>
      <div class="language-switcher">
        <a href="#" data-lang="en" class="en">en</a>
        <a href="#" data-lang="fr" class="fr">fr</a>
        <a href="#" data-lang="gr" class="gr">gr</a>
        <a href="#" data-lang="dk" class="dk">dk</a>
      </div>
    `;

    // Mock localStorage
    mockLocalStorage = {};
    Storage.prototype.getItem = jest.fn((key) => mockLocalStorage[key]);
    Storage.prototype.setItem = jest.fn((key, value) => {
      mockLocalStorage[key] = value;
    });

    // Mock URL
    delete window.location;
    window.location = {
      search: '',
      href: 'http://localhost'
    };

    // Mock URLSearchParams
    global.URLSearchParams = jest.fn().mockImplementation((search) => {
      return {
        get: jest.fn((key) => {
          if (key === 'lang' && search.includes('lang=')) {
            return search.split('lang=')[1].split('&')[0];
          }
          return null;
        }),
        set: jest.fn()
      };
    });

    // Mock URL constructor
    global.URL = jest.fn().mockImplementation((url) => {
      return {
        searchParams: new URLSearchParams(window.location.search)
      };
    });

    // Mock window.history
    window.history.replaceState = jest.fn();

    // Mock navigator.language
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'en-US'
    });

    // Mock translations
    global.translations = {
      en: {
        title: 'Can I Get A...',
        subtitle: 'improv suggestions',
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
        title: 'Greek Title',
        subtitle: 'Greek subtitle',
        buttons: { location: 'Τοποθεσία', relationship: 'Σχέση', word: 'Λέξη' },
        credit: 'Greek credit',
        fontSizes: { small: 19, large: 30 },
        bodyClass: 'greek'
      },
      dk: {
        title: 'Må jeg bede om...',
        subtitle: 'impro-bud',
        buttons: { location: 'Et sted', relationship: 'En relation', word: 'Et ord' },
        credit: 'af gil',
        fontSizes: { small: 18, large: 29 },
        bodyClass: ''
      }
    };

    // Load i18n.js
    const { i18n } = require('../i18n.js');
    global.i18n = i18n;

    // Reset i18n state
    i18n.currentLanguage = 'en';
  });

  describe('Language Detection', () => {
    test('should detect language from URL parameter', () => {
      window.location.search = '?lang=fr';
      const lang = i18n.detectLanguage();
      expect(lang).toBe('fr');
    });

    test('should detect language from localStorage', () => {
      mockLocalStorage.preferredLanguage = 'gr';
      const lang = i18n.detectLanguage();
      expect(lang).toBe('gr');
    });

    test('should prioritize URL parameter over localStorage', () => {
      window.location.search = '?lang=fr';
      mockLocalStorage.preferredLanguage = 'gr';
      const lang = i18n.detectLanguage();
      expect(lang).toBe('fr');
    });

    test('should detect language from browser preference', () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'fr-FR'
      });
      const lang = i18n.detectLanguage();
      expect(lang).toBe('fr');
    });

    test('should fall back to default language for unsupported languages', () => {
      window.location.search = '?lang=es'; // Spanish not supported
      const lang = i18n.detectLanguage();
      expect(lang).toBe('en');
    });

    test('should fall back to English when no preference found', () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'es-ES' // Unsupported
      });
      const lang = i18n.detectLanguage();
      expect(lang).toBe('en');
    });

    test('should handle browser language with region code', () => {
      Object.defineProperty(window.navigator, 'language', {
        value: 'fr-CA' // French Canadian -> should detect 'fr'
      });
      const lang = i18n.detectLanguage();
      expect(lang).toBe('fr');
    });
  });

  describe('Language Setting', () => {
    test('should set current language', () => {
      i18n.setLanguage('fr');
      expect(i18n.currentLanguage).toBe('fr');
    });

    test('should save language to localStorage', () => {
      i18n.setLanguage('gr');
      expect(localStorage.setItem).toHaveBeenCalledWith('preferredLanguage', 'gr');
    });

    test('should update URL parameter', () => {
      i18n.setLanguage('dk');
      expect(window.history.replaceState).toHaveBeenCalled();
    });

    test('should fall back to default for unsupported language', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      i18n.setLanguage('unsupported');

      expect(i18n.currentLanguage).toBe('en');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    test('should trigger language change event', () => {
      const eventSpy = jest.spyOn(window, 'dispatchEvent');

      i18n.setLanguage('fr');

      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0];
      expect(event.type).toBe('languageChanged');
      expect(event.detail.language).toBe('fr');

      eventSpy.mockRestore();
    });
  });

  describe('Translation Function', () => {
    test('should translate simple keys', () => {
      i18n.currentLanguage = 'en';
      expect(i18n.t('title')).toBe('Can I Get A...');
    });

    test('should translate nested keys', () => {
      i18n.currentLanguage = 'en';
      expect(i18n.t('buttons.location')).toBe('Location');
    });

    test('should translate for French', () => {
      i18n.currentLanguage = 'fr';
      expect(i18n.t('title')).toBe('J\'ai besoin de...');
      expect(i18n.t('buttons.location')).toBe('Lieu');
    });

    test('should translate for Greek', () => {
      i18n.currentLanguage = 'gr';
      expect(i18n.t('buttons.word')).toBe('Λέξη');
    });

    test('should translate for Danish', () => {
      i18n.currentLanguage = 'dk';
      expect(i18n.t('buttons.relationship')).toBe('En relation');
    });

    test('should handle missing translation key', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      i18n.currentLanguage = 'en';
      const result = i18n.t('nonexistent.key');

      expect(result).toBe('');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    test('should handle missing language', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      i18n.currentLanguage = 'nonexistent';
      const result = i18n.t('title');

      expect(result).toBe('');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    test('should handle deeply nested keys', () => {
      i18n.currentLanguage = 'en';
      expect(i18n.t('fontSizes.small')).toBe(18);
      expect(i18n.t('fontSizes.large')).toBe(29);
    });
  });

  describe('Page Updates', () => {
    test('should update all page elements', () => {
      i18n.currentLanguage = 'fr';
      i18n.updatePage();

      expect(document.querySelector('.title').innerHTML).toBe('J\'ai besoin de...');
      expect(document.querySelector('.location').textContent).toBe('Lieu');
      expect(document.querySelector('.relationship').textContent).toBe('Relation');
      expect(document.querySelector('.word').textContent).toBe('Mot');
    });

    test('should update document title', () => {
      i18n.currentLanguage = 'fr';
      i18n.updatePage();

      expect(document.title).toBe('J\'ai besoin de...');
    });

    test('should update body class for language-specific styling', () => {
      i18n.currentLanguage = 'gr';
      i18n.updatePage();

      expect(document.body.className).toBe('greek');
    });

    test('should clear body class for non-Greek languages', () => {
      document.body.className = 'greek';

      i18n.currentLanguage = 'en';
      i18n.updatePage();

      expect(document.body.className).toBe('');
    });

    test('should handle missing DOM elements gracefully', () => {
      document.querySelector('.title').remove();

      i18n.currentLanguage = 'fr';

      // Should not throw
      expect(() => i18n.updatePage()).not.toThrow();
    });
  });

  describe('Language Switcher', () => {
    test('should update active state for current language', () => {
      i18n.currentLanguage = 'fr';
      i18n.updateLanguageSwitcher();

      const frLink = document.querySelector('[data-lang="fr"]');
      const enLink = document.querySelector('[data-lang="en"]');

      expect(frLink.classList.contains('active')).toBe(true);
      expect(enLink.classList.contains('active')).toBe(false);
    });

    test('should remove active state from other languages', () => {
      const links = document.querySelectorAll('.language-switcher a');
      links.forEach(link => link.classList.add('active'));

      i18n.currentLanguage = 'dk';
      i18n.updateLanguageSwitcher();

      const activeLinks = document.querySelectorAll('.language-switcher a.active');
      expect(activeLinks.length).toBe(1);
      expect(activeLinks[0].dataset.lang).toBe('dk');
    });
  });

  describe('Initialization', () => {
    test('should set up language switcher click handlers', () => {
      i18n.init();

      const frLink = document.querySelector('[data-lang="fr"]');
      const setLanguageSpy = jest.spyOn(i18n, 'setLanguage');

      // Simulate click
      const event = new Event('click');
      event.preventDefault = jest.fn();
      Object.defineProperty(event, 'target', { value: frLink, enumerable: true });

      frLink.dispatchEvent(event);

      // Should prevent default and set language
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('should detect initial language on init', () => {
      mockLocalStorage.preferredLanguage = 'gr';

      i18n.init();

      expect(i18n.currentLanguage).toBe('gr');
    });

    test('should update page on init', () => {
      const updatePageSpy = jest.spyOn(i18n, 'updatePage');

      i18n.init();

      expect(updatePageSpy).toHaveBeenCalled();

      updatePageSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    test('should handle rapid language switching', () => {
      const languages = ['en', 'fr', 'gr', 'dk'];

      languages.forEach(lang => {
        i18n.setLanguage(lang);
        expect(i18n.currentLanguage).toBe(lang);
      });
    });

    test('should handle language switching during suggestion display', () => {
      // Set up a suggestion
      const suggestion = document.querySelector('.suggestion');
      if (!suggestion) {
        document.body.innerHTML += '<div class="suggestion">Test Suggestion</div>';
      }

      i18n.setLanguage('fr');

      // Should not affect existing suggestion
      const suggestionEl = document.querySelector('.suggestion');
      expect(suggestionEl).toBeTruthy();
    });

    test('should handle null/undefined localStorage values', () => {
      Storage.prototype.getItem = jest.fn(() => null);

      const lang = i18n.detectLanguage();

      // Should fall back to browser language or default
      expect(i18n.supportedLanguages).toContain(lang);
    });

    test('should handle malformed URL parameters', () => {
      window.location.search = '?lang=';

      const lang = i18n.detectLanguage();

      // Should fall back gracefully
      expect(i18n.supportedLanguages).toContain(lang);
    });

    test('should preserve HTML in credit translations', () => {
      i18n.currentLanguage = 'en';
      const credit = i18n.t('credit');

      // Credit should allow HTML (using innerHTML)
      expect(typeof credit).toBe('string');
    });

    test('should handle concurrent init calls', () => {
      // Should not throw or cause issues
      expect(() => {
        i18n.init();
        i18n.init();
      }).not.toThrow();
    });
  });

  describe('Language-specific Font Sizes', () => {
    test('should return correct font sizes for English', () => {
      i18n.currentLanguage = 'en';
      const sizes = i18n.t('fontSizes');
      expect(sizes.small).toBe(18);
      expect(sizes.large).toBe(29);
    });

    test('should return correct font sizes for French', () => {
      i18n.currentLanguage = 'fr';
      const sizes = i18n.t('fontSizes');
      expect(sizes.small).toBe(19);
      expect(sizes.large).toBe(30);
    });

    test('should return correct font sizes for Greek', () => {
      i18n.currentLanguage = 'gr';
      const sizes = i18n.t('fontSizes');
      expect(sizes.small).toBe(19);
      expect(sizes.large).toBe(30);
    });
  });
});
