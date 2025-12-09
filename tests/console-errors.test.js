/**
 * Jest test to detect console errors when loading scripts
 * This test actually loads the script files and checks for conflicts
 */

describe('Console Error Detection', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    // Reset global state
    global.window = {
      suggestionsByLanguage: {},
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn()
      },
      location: {
        search: ''
      },
      navigator: {
        language: 'en-US'
      }
    };

    global.document = {
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(() => []),
      addEventListener: jest.fn(),
      title: '',
      body: { className: '' }
    };

    // Spy on console
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test('Loading all script files should not produce console errors', () => {
    // Initialize storage (as index.html does)
    window.suggestionsByLanguage = {};

    // Load script files in order
    const fs = require('fs');
    const path = require('path');

    const scriptFiles = [
      'script_en.js',
      'script_fr.js',
      'script_gr.js',
      'script_dk.js'
    ];

    // Track what gets loaded
    const loadedLanguages = [];

    scriptFiles.forEach(file => {
      const scriptPath = path.join(__dirname, '..', file);
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');

      try {
        // Execute the script
        eval(scriptContent);

        // Check which language was added
        const currentLangs = Object.keys(window.suggestionsByLanguage);
        const newLang = currentLangs.find(lang => !loadedLanguages.includes(lang));
        if (newLang) {
          loadedLanguages.push(newLang);
          console.log(`✓ Loaded ${file} -> ${newLang}`);
        }
      } catch (error) {
        console.error(`Error loading ${file}:`, error.message);
        throw error;
      }
    });

    // Assertions
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();

    // Check all languages loaded
    expect(window.suggestionsByLanguage.en).toBeDefined();
    expect(window.suggestionsByLanguage.fr).toBeDefined();
    expect(window.suggestionsByLanguage.gr).toBeDefined();
    expect(window.suggestionsByLanguage.dk).toBeDefined();

    // Verify loaded languages
    expect(loadedLanguages).toEqual(['en', 'fr', 'gr', 'dk']);
  });

  test('Each language should have all three categories', () => {
    window.suggestionsByLanguage = {};

    const fs = require('fs');
    const path = require('path');

    const scriptFiles = [
      { file: 'script_en.js', lang: 'en' },
      { file: 'script_fr.js', lang: 'fr' },
      { file: 'script_gr.js', lang: 'gr' },
      { file: 'script_dk.js', lang: 'dk' }
    ];

    scriptFiles.forEach(({ file, lang }) => {
      const scriptPath = path.join(__dirname, '..', file);
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      eval(scriptContent);

      expect(window.suggestionsByLanguage[lang]).toBeDefined();
      expect(window.suggestionsByLanguage[lang].location).toBeInstanceOf(Array);
      expect(window.suggestionsByLanguage[lang].relationship).toBeInstanceOf(Array);
      expect(window.suggestionsByLanguage[lang].word).toBeInstanceOf(Array);

      expect(window.suggestionsByLanguage[lang].location.length).toBeGreaterThan(0);
      expect(window.suggestionsByLanguage[lang].relationship.length).toBeGreaterThan(0);
      expect(window.suggestionsByLanguage[lang].word.length).toBeGreaterThan(0);
    });
  });

  test('Scripts should not pollute global scope', () => {
    window.suggestionsByLanguage = {};

    const fs = require('fs');
    const path = require('path');

    const beforeGlobals = Object.keys(global);

    // Load all scripts
    const scriptFiles = ['script_en.js', 'script_fr.js', 'script_gr.js', 'script_dk.js'];
    scriptFiles.forEach(file => {
      const scriptPath = path.join(__dirname, '..', file);
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      eval(scriptContent);
    });

    const afterGlobals = Object.keys(global);
    const newGlobals = afterGlobals.filter(key => !beforeGlobals.includes(key));

    // Filter out expected globals
    const unexpectedGlobals = newGlobals.filter(key =>
      key !== 'window' &&
      key !== 'document' &&
      !key.startsWith('GLOBAL') // Jest internals
    );

    expect(unexpectedGlobals).toEqual([]);

    // Specifically check that 'main' and 'suggestions' are NOT global
    expect(global.main).toBeUndefined();
    expect(global.suggestions).toBeUndefined();
  });

  test('Languages should not overwrite each other', () => {
    window.suggestionsByLanguage = {};

    const fs = require('fs');
    const path = require('path');

    // Load English
    const enScript = fs.readFileSync(path.join(__dirname, '..', 'script_en.js'), 'utf8');
    eval(enScript);
    const enFirstLocation = window.suggestionsByLanguage.en.location[0];

    // Load French
    const frScript = fs.readFileSync(path.join(__dirname, '..', 'script_fr.js'), 'utf8');
    eval(frScript);
    const frFirstLocation = window.suggestionsByLanguage.fr.location[0];

    // Load Greek
    const grScript = fs.readFileSync(path.join(__dirname, '..', 'script_gr.js'), 'utf8');
    eval(grScript);
    const grFirstLocation = window.suggestionsByLanguage.gr.location[0];

    // Load Danish
    const dkScript = fs.readFileSync(path.join(__dirname, '..', 'script_dk.js'), 'utf8');
    eval(dkScript);
    const dkFirstLocation = window.suggestionsByLanguage.dk.location[0];

    // Verify all languages still exist and haven't been overwritten
    expect(window.suggestionsByLanguage.en.location[0]).toBe(enFirstLocation);
    expect(window.suggestionsByLanguage.fr.location[0]).toBe(frFirstLocation);
    expect(window.suggestionsByLanguage.gr.location[0]).toBe(grFirstLocation);
    expect(window.suggestionsByLanguage.dk.location[0]).toBe(dkFirstLocation);

    // Verify they're actually different
    expect(enFirstLocation).not.toBe(frFirstLocation);
    expect(enFirstLocation).not.toBe(grFirstLocation);
    expect(frFirstLocation).not.toBe(grFirstLocation);

    console.log('Sample suggestions:');
    console.log('  EN:', enFirstLocation);
    console.log('  FR:', frFirstLocation);
    console.log('  GR:', grFirstLocation);
    console.log('  DK:', dkFirstLocation);
  });
});
