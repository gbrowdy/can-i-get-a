const fs = require('fs');

// Configuration constants
const COLUMN_INDICES = {
  LOCATION: 3,
  RELATIONSHIP: 8,
  WORD: 13,
  SITE_TEXT: 15,
  SITE_TEXT_TRANSLATION: 16
};

const FONT_SIZES = {
  SMALL: 18,  // Mobile or long suggestions
  LARGE: 29   // Desktop and short suggestions
};

// Site text keys expected in the CSV (in order they appear)
const SITE_TEXT_KEYS = [
  'title',           // "Can I Get A..." -> title
  'subtitle',        // "improv suggestions..." -> subtitle
  'location',        // "Location" -> buttons.location
  'relationship',    // "Relationship" -> buttons.relationship
  'word',            // "Word" -> buttons.word
  'credit',          // "by Gil Browdy..." -> credit (needs HTML formatting)
  'translator'       // "Translated in..." -> translator credit
];

// Check command line arguments
if (process.argv.length < 3) {
  console.error('Usage: node csv-to-js.js <input.csv> [output.js] [langCode] [minFontSize] [maxFontSize]');
  console.error('Example: node csv-to-js.js danish.csv script_dn.js dn 19 30');
  console.error('         node csv-to-js.js danish.csv script_dn.js dn (uses defaults 18, 29)');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile.replace('.csv', '.js');
const langCode = process.argv[4] || inputFile.replace('.csv', '').substring(0, 2);
const minFontSize = process.argv[5] ? parseInt(process.argv[5], 10) : FONT_SIZES.SMALL;
const maxFontSize = process.argv[6] ? parseInt(process.argv[6], 10) : FONT_SIZES.LARGE;

// Validate font sizes
if (isNaN(minFontSize) || isNaN(maxFontSize)) {
  console.error('Error: Font sizes must be valid numbers');
  process.exit(1);
}

// Read and parse CSV
let csvContent;
try {
  csvContent = fs.readFileSync(inputFile, 'utf-8');
} catch (error) {
  console.error(`Error reading file ${inputFile}: ${error.message}`);
  process.exit(1);
}

const lines = csvContent.trim().split('\n');

if (lines.length < 2) {
  console.error('Error: CSV file must have at least a header row and one data row');
  process.exit(1);
}

// Skip header row (line 0) and start from line 1
const locations = [];
const relationships = [];
const words = [];
const siteTexts = [];  // Array of {key: string, translation: string}
const errors = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];

  // Split by comma, handling the format
  const parts = line.split(',');

  // Extract translations (every odd index after the first LEN column)
  // Format: LEN,LOCATION,LEN,Translation,,LEN,RELATIONSHIP,LEN,Translation,,LEN,WORDS,LEN,Translation,...

  if (parts.length >= COLUMN_INDICES.LOCATION + 1) {
    const location = parts[COLUMN_INDICES.LOCATION]?.trim();
    if (location) {
      locations.push(location);
    }
  } else if (parts.length > 0 && parts.join('').trim()) {
    errors.push(`Line ${i + 1}: Missing location column`);
  }

  if (parts.length >= COLUMN_INDICES.RELATIONSHIP + 1) {
    const relationship = parts[COLUMN_INDICES.RELATIONSHIP]?.trim();
    if (relationship) {
      relationships.push(relationship);
    }
  } else if (parts.length > 0 && parts.join('').trim()) {
    errors.push(`Line ${i + 1}: Missing relationship column`);
  }

  if (parts.length >= COLUMN_INDICES.WORD + 1) {
    const word = parts[COLUMN_INDICES.WORD]?.trim();
    if (word) {
      words.push(word);
    }
  } else if (parts.length > 0 && parts.join('').trim()) {
    errors.push(`Line ${i + 1}: Missing word column`);
  }

  // Extract site text translations (columns 14 and 15)
  if (parts.length >= COLUMN_INDICES.SITE_TEXT_TRANSLATION + 1) {
    const siteTextKey = parts[COLUMN_INDICES.SITE_TEXT]?.trim();
    const siteTextTranslation = parts[COLUMN_INDICES.SITE_TEXT_TRANSLATION]?.trim();
    if (siteTextKey && siteTextTranslation) {
      siteTexts.push({ key: siteTextKey, translation: siteTextTranslation });
    }
  }
}

// Display warnings if any
if (errors.length > 0) {
  console.warn('\nWarnings during parsing:');
  errors.forEach(error => console.warn(`  - ${error}`));
  console.warn('');
}

// Validate we have data
if (locations.length === 0 && relationships.length === 0 && words.length === 0) {
  console.error('Error: No valid data found in CSV file');
  process.exit(1);
}

// Helper function to escape single quotes in strings
const escapeQuotes = (str) => str.replace(/'/g, "\\'");

// Get language name from code for comments
const getLanguageName = (code) => {
  const names = { en: 'English', fr: 'French', gr: 'Greek', dk: 'Danish', de: 'German', es: 'Spanish' };
  return names[code] || code.toUpperCase();
};

// Generate JavaScript output for the script file (IIFE format matching existing files)
const jsOutput = `// ${getLanguageName(langCode)} suggestions
(function() {
  const suggestions = {
    location: [
${locations.map(loc => `      '${escapeQuotes(loc)}',`).join('\n')}
    ],
    relationship: [
${relationships.map(rel => `      '${escapeQuotes(rel)}',`).join('\n')}
    ],
    word: [
${words.map(word => `      '${escapeQuotes(word)}',`).join('\n')}
    ],
  };

  // Export to global i18n system
  window.suggestionsByLanguage.${langCode} = suggestions;
})();
`;

// Process site texts to build translation entry
const buildTranslationEntry = () => {
  if (siteTexts.length === 0) {
    return null;
  }

  const translation = {
    title: '',
    subtitle: '',
    buttons: {
      location: '',
      relationship: '',
      word: ''
    },
    credit: '',
    fontSizes: { small: minFontSize, large: maxFontSize },
    bodyClass: ''
  };

  // Map site text keys to translation object
  siteTexts.forEach(({ key, translation: value }) => {
    if (key === 'Can I Get A...') {
      translation.title = value;
    } else if (key.includes('improv suggestions')) {
      translation.subtitle = value;
    } else if (key === 'Location') {
      translation.buttons.location = value;
    } else if (key === 'Relationship') {
      translation.buttons.relationship = value;
    } else if (key === 'Word') {
      translation.buttons.word = value;
    } else if (key.includes('Gil Browdy')) {
      // Build credit with HTML links
      translation.credit = `af <a href="http://gil.browdy.net" target="_blank">gil browdy</a> && <a href="http://www.vinnyfrancois.com" target="_blank">vinny francois</a>`;
    } else if (key.includes('Translated in')) {
      // Append translator credit (preserve original case)
      translation.credit += `<br/>${value}`;
    }
  });

  return translation;
};

// Write script output file
try {
  fs.writeFileSync(outputFile, jsOutput, 'utf-8');
  console.log(`✓ Successfully converted ${inputFile} to ${outputFile}`);
  console.log(`  Locations:     ${locations.length}`);
  console.log(`  Relationships: ${relationships.length}`);
  console.log(`  Words:         ${words.length}`);
  console.log(`  Font sizes:    ${minFontSize}px / ${maxFontSize}px`);
} catch (error) {
  console.error(`Error writing file ${outputFile}: ${error.message}`);
  process.exit(1);
}

// Update index.html to include the new script file
const indexFile = 'index.html';
try {
  let indexContent = fs.readFileSync(indexFile, 'utf-8');
  const scriptTag = `<script src="${outputFile}" type="text/javascript"></script>`;

  // Check if script is already included
  if (!indexContent.includes(`src="${outputFile}"`)) {
    // Find the last language script tag and insert after it
    const scriptPattern = /<script src="script_\w+\.js" type="text\/javascript"><\/script>/g;
    const matches = [...indexContent.matchAll(scriptPattern)];

    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const insertPos = lastMatch.index + lastMatch[0].length;
      indexContent = indexContent.substring(0, insertPos) + '\n\t\t' + scriptTag + indexContent.substring(insertPos);
      fs.writeFileSync(indexFile, indexContent, 'utf-8');
      console.log(`✓ Added ${outputFile} to ${indexFile}`);
    } else {
      console.warn(`⚠ Could not find script tags in ${indexFile} to add ${outputFile}`);
    }
  } else {
    console.log(`  ${outputFile} already in ${indexFile}`);
  }
} catch (error) {
  console.warn(`⚠ Could not update ${indexFile}: ${error.message}`);
}

// Update translations.js if we have site text translations
if (siteTexts.length > 0) {
  const translationEntry = buildTranslationEntry();

  if (translationEntry) {
    const translationsFile = 'translations.js';

    try {
      let translationsContent = fs.readFileSync(translationsFile, 'utf-8');

      // Build the new translation entry as a string
      const newEntry = `  ${langCode}: {
    title: '${escapeQuotes(translationEntry.title)}',
    subtitle: '${escapeQuotes(translationEntry.subtitle)}',
    buttons: {
      location: '${escapeQuotes(translationEntry.buttons.location)}',
      relationship: '${escapeQuotes(translationEntry.buttons.relationship)}',
      word: '${escapeQuotes(translationEntry.buttons.word)}'
    },
    credit: '${escapeQuotes(translationEntry.credit)}',
    fontSizes: { small: ${translationEntry.fontSizes.small}, large: ${translationEntry.fontSizes.large} },
    bodyClass: ''
  }`;

      // Check if this language already exists in translations.js
      // Match the entire language block including all nested content
      const langPattern = `  ${langCode}: \\{[\\s\\S]*?bodyClass: '[^']*'\\s*\\}`;
      const langRegex = new RegExp(langPattern, 'g');

      if (translationsContent.match(langRegex)) {
        // Replace existing entry
        translationsContent = translationsContent.replace(langRegex, newEntry);
        console.log(`✓ Updated existing ${langCode} entry in ${translationsFile}`);
      } else {
        // Find the closing of translations object and insert before it
        const closingPattern = /(\n\};)/;
        const match = translationsContent.match(closingPattern);

        if (match) {
          // Find the last entry and add after it with proper comma
          const lastEntryEnd = translationsContent.lastIndexOf("bodyClass: ''");
          if (lastEntryEnd !== -1) {
            const insertPos = translationsContent.indexOf('}', lastEntryEnd);
            if (insertPos !== -1) {
              const before = translationsContent.substring(0, insertPos + 1);
              const after = translationsContent.substring(insertPos + 1);
              translationsContent = before + ',\n' + newEntry + after;
              console.log(`✓ Added new ${langCode} entry to ${translationsFile}`);
            }
          }
        }
      }

      // Also check/update languageNames object
      const langNamesRegex = /const languageNames = \{([^}]*)\}/;
      const langNamesMatch = translationsContent.match(langNamesRegex);
      if (langNamesMatch && !langNamesMatch[1].includes(`${langCode}:`)) {
        const newLangNames = langNamesMatch[1].trim().replace(/,?\s*$/, `,\n  ${langCode}: '${langCode}'`);
        translationsContent = translationsContent.replace(langNamesRegex, `const languageNames = {\n  ${newLangNames}\n}`);
        console.log(`✓ Added ${langCode} to languageNames`);
      }

      fs.writeFileSync(translationsFile, translationsContent, 'utf-8');
    } catch (error) {
      console.warn(`⚠ Could not update ${translationsFile}: ${error.message}`);
      console.log('\nManually add this translation entry:');
      console.log(JSON.stringify(translationEntry, null, 2));
    }
  }

  console.log(`  Site texts:    ${siteTexts.length}`);
}
