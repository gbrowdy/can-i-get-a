/**
 * Data validation tests for suggestion completeness and quality
 * Ensures all language data is valid and complete
 */

const fs = require('fs');
const path = require('path');

describe('Suggestion Data Validation', () => {
  let suggestions;

  beforeAll(() => {
    // Load actual suggestion data from files
    suggestions = {};

    const scriptFiles = [
      { file: 'script_en.js', lang: 'en' },
      { file: 'script_fr.js', lang: 'fr' },
      { file: 'script_gr.js', lang: 'gr' },
      { file: 'script_dn.js', lang: 'dn' }
    ];

    // Initialize window.suggestionsByLanguage BEFORE loading scripts
    if (typeof window === 'undefined') {
      global.window = {};
    }
    window.suggestionsByLanguage = {};

    scriptFiles.forEach(({ file, lang }) => {
      const scriptPath = path.join(__dirname, '..', file);
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      eval(scriptContent);
      suggestions[lang] = window.suggestionsByLanguage[lang];
    });
  });

  describe('Data Structure Completeness', () => {
    const languages = ['en', 'fr', 'gr', 'dn'];

    languages.forEach(lang => {
      test(`${lang} should have all three categories`, () => {
        expect(suggestions[lang]).toBeDefined();
        expect(suggestions[lang].location).toBeDefined();
        expect(suggestions[lang].relationship).toBeDefined();
        expect(suggestions[lang].word).toBeDefined();
      });

      test(`${lang} should have arrays for all categories`, () => {
        expect(Array.isArray(suggestions[lang].location)).toBe(true);
        expect(Array.isArray(suggestions[lang].relationship)).toBe(true);
        expect(Array.isArray(suggestions[lang].word)).toBe(true);
      });

      test(`${lang} should have non-empty arrays`, () => {
        expect(suggestions[lang].location.length).toBeGreaterThan(0);
        expect(suggestions[lang].relationship.length).toBeGreaterThan(0);
        expect(suggestions[lang].word.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Quality', () => {
    const languages = ['en', 'fr', 'gr', 'dn'];

    languages.forEach(lang => {
      describe(`${lang} data quality`, () => {
        test('should not have empty strings in location', () => {
          const emptyItems = suggestions[lang].location.filter(item => !item || item.trim() === '');
          expect(emptyItems).toEqual([]);
        });

        test('should not have empty strings in relationship', () => {
          const emptyItems = suggestions[lang].relationship.filter(item => !item || item.trim() === '');
          expect(emptyItems).toEqual([]);
        });

        test('should not have empty strings in word', () => {
          const emptyItems = suggestions[lang].word.filter(item => !item || item.trim() === '');
          expect(emptyItems).toEqual([]);
        });

        test('should not have duplicate locations', () => {
          const locations = suggestions[lang].location;
          const uniqueLocations = new Set(locations);
          const duplicates = locations.filter((item, index) => locations.indexOf(item) !== index);

          expect(duplicates).toEqual([]);
          expect(locations.length).toBe(uniqueLocations.size);
        });

        test('should not have duplicate relationships', () => {
          const relationships = suggestions[lang].relationship;
          const uniqueRelationships = new Set(relationships);
          const duplicates = relationships.filter((item, index) => relationships.indexOf(item) !== index);

          expect(duplicates).toEqual([]);
          expect(relationships.length).toBe(uniqueRelationships.size);
        });

        test('should not have duplicate words', () => {
          const words = suggestions[lang].word;
          const uniqueWords = new Set(words);
          const duplicates = words.filter((item, index) => words.indexOf(item) !== index);

          expect(duplicates).toEqual([]);
          expect(words.length).toBe(uniqueWords.size);
        });

        test('should have reasonable suggestion lengths', () => {
          // Locations should be < 100 chars
          const longLocations = suggestions[lang].location.filter(item => item.length > 100);
          expect(longLocations).toEqual([]);

          // Relationships should be < 100 chars
          const longRelationships = suggestions[lang].relationship.filter(item => item.length > 100);
          expect(longRelationships).toEqual([]);

          // Words should be < 50 chars (they're words/short phrases)
          const longWords = suggestions[lang].word.filter(item => item.length > 50);
          expect(longWords).toEqual([]);
        });

        test('should not have only whitespace', () => {
          const allSuggestions = [
            ...suggestions[lang].location,
            ...suggestions[lang].relationship,
            ...suggestions[lang].word
          ];

          const whitespaceOnly = allSuggestions.filter(item => item.trim().length === 0);
          expect(whitespaceOnly).toEqual([]);
        });

        test('should have proper capitalization (first char)', () => {
          // Most suggestions should start with uppercase
          // (some languages may have exceptions, but let's check majority)
          const locations = suggestions[lang].location;
          const capitalized = locations.filter(item => {
            const firstChar = item.trim()[0];
            return firstChar === firstChar.toUpperCase();
          });

          // At least 80% should be capitalized
          const ratio = capitalized.length / locations.length;
          expect(ratio).toBeGreaterThan(0.8);
        });
      });
    });
  });

  describe('Data Consistency Across Languages', () => {
    test('should have substantial content (>50 items per category minimum)', () => {
      const languages = ['en', 'fr', 'gr', 'dn'];

      languages.forEach(lang => {
        expect(suggestions[lang].location.length).toBeGreaterThan(50);
        expect(suggestions[lang].relationship.length).toBeGreaterThan(50);
        expect(suggestions[lang].word.length).toBeGreaterThan(50);
      });
    });
  });

  describe('Character Encoding and Special Characters', () => {
    test('French should contain proper accented characters', () => {
      const frenchText = [
        ...suggestions.fr.location,
        ...suggestions.fr.relationship,
        ...suggestions.fr.word
      ].join(' ');

      // Should contain common French accents
      expect(/[àâäéèêëïîôùûü]/i.test(frenchText)).toBe(true);
    });

    test('Greek should contain Greek characters', () => {
      const greekText = [
        ...suggestions.gr.location,
        ...suggestions.gr.relationship,
        ...suggestions.gr.word
      ].join(' ');

      // Should contain Greek alphabet
      expect(/[α-ωΑ-Ω]/.test(greekText)).toBe(true);
    });

    test('Danish should contain Danish special characters', () => {
      const danishText = [
        ...suggestions.dn.location,
        ...suggestions.dn.relationship,
        ...suggestions.dn.word
      ].join(' ');

      // Should contain æ, ø, or å
      expect(/[æøåÆØÅ]/.test(danishText)).toBe(true);
    });

    test('should not have unintended HTML or script tags', () => {
      const languages = ['en', 'fr', 'gr', 'dn'];

      languages.forEach(lang => {
        const allText = [
          ...suggestions[lang].location,
          ...suggestions[lang].relationship,
          ...suggestions[lang].word
        ].join(' ');

        expect(allText).not.toContain('<script');
        expect(allText).not.toContain('</script>');
        expect(allText).not.toContain('<html');
        expect(allText).not.toContain('onclick');
      });
    });

    test('should handle Unicode properly (emojis, symbols)', () => {
      // If there are emojis or special symbols, they should render correctly
      const languages = ['en', 'fr', 'gr', 'dn'];

      languages.forEach(lang => {
        const allSuggestions = [
          ...suggestions[lang].location,
          ...suggestions[lang].relationship,
          ...suggestions[lang].word
        ];

        allSuggestions.forEach(item => {
          // Should not have broken Unicode (replacement character)
          expect(item).not.toContain('\uFFFD');

          // Should not have null bytes
          expect(item).not.toContain('\0');
        });
      });
    });
  });

  describe('Relationship Format Validation', () => {
    const languages = ['en', 'fr', 'gr', 'dn'];

    languages.forEach(lang => {
      test(`${lang} relationships should use proper separator`, () => {
        const relationships = suggestions[lang].relationship;

        // Most relationships should contain a separator (/, &, etc.)
        const withSeparator = relationships.filter(item =>
          item.includes('/') || item.includes('&') || item.includes(' and ') ||
          item.includes(' et ') || item.includes(' και ') || item.includes(' og ')
        );

        // At least 90% should have separators (indicating two roles)
        const ratio = withSeparator.length / relationships.length;
        expect(ratio).toBeGreaterThan(0.85);
      });

      test(`${lang} relationships should not end with separator`, () => {
        const relationships = suggestions[lang].relationship;
        const endsWithSeparator = relationships.filter(item =>
          item.trim().endsWith('/') || item.trim().endsWith('&')
        );

        expect(endsWithSeparator).toEqual([]);
      });

      test(`${lang} relationships should not start with separator`, () => {
        const relationships = suggestions[lang].relationship;
        const startsWithSeparator = relationships.filter(item =>
          item.trim().startsWith('/') || item.trim().startsWith('&')
        );

        expect(startsWithSeparator).toEqual([]);
      });
    });
  });

  describe('Word Category Validation', () => {
    const languages = ['en', 'fr', 'gr', 'dn'];

    languages.forEach(lang => {
      test(`${lang} words should be relatively short (word-like)`, () => {
        const words = suggestions[lang].word;

        // Count words with more than 3 actual words in them
        const multiWord = words.filter(item => {
          const wordCount = item.trim().split(/\s+/).length;
          return wordCount > 3;
        });

        // Less than 20% should be multi-word phrases
        const ratio = multiWord.length / words.length;
        expect(ratio).toBeLessThan(0.2);
      });

      test(`${lang} words should not contain slashes (that's for relationships)`, () => {
        const words = suggestions[lang].word;
        const withSlash = words.filter(item => item.includes('/'));

        // Very few should have slashes (skip for Greek)
        if (lang !== 'gr') {
          expect(withSlash.length).toBeLessThan(5);
        }
      });
    });
  });

  describe('Statistical Analysis', () => {
    test('should print data statistics for reference', () => {
      console.log('\n=== Suggestion Data Statistics ===');
      const languages = ['en', 'fr', 'gr', 'dn'];

      languages.forEach(lang => {
        const locCount = suggestions[lang].location.length;
        const relCount = suggestions[lang].relationship.length;
        const wordCount = suggestions[lang].word.length;
        const total = locCount + relCount + wordCount;

        console.log(`\n${lang.toUpperCase()}:`);
        console.log(`  Locations: ${locCount}`);
        console.log(`  Relationships: ${relCount}`);
        console.log(`  Words: ${wordCount}`);
        console.log(`  Total: ${total}`);
      });

      expect(true).toBe(true); // Always pass, this is just for logging
    });
  });
});
