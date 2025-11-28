# Can I Get A

Can I Get A is a simple improv suggestion generator. You click a button and you get a suggestion.

The idea is simple, the code is simple, the results are _fun_!

## Internationalization

The app supports English, French, Greek, and Danish with instant client-side language switching. If you are interested in volunteering to translate into another language, please let one of the site creators know!

### Features

✅ **Single-page app** - All languages in one HTML file
✅ **Instant switching** - No page reload required
✅ **Language persistence** - Remembers your preference
✅ **Auto-detection** - Detects browser language

### Adding a New Language

Quick steps:
1. Add translations to `translations.js`
2. Create `script_yourlang.js` with suggestions (or convert from CSV using `csv-to-js.js`)
3. Add language to `i18n.js` supported languages
4. Add language link to `index.html`
5. Add CSS styles in `style.css`

## Code Structure

- `index.html` - Main application page (single page for all languages)
- `i18n.js` - Language detection and switching system
- `translations.js` - UI text translations for all languages
- `base.js` - Shared logic for all languages (shuffle, event handlers, initialization)
- `script.js`, `script_fr.js`, `script_gr.js`, `script_dn.js` - Language-specific suggestion data
- `csv-to-js.js` - Utility to convert CSV files to JavaScript suggestion files
- `style.css` - Styling for the application

## Development

The codebase includes configuration files for consistent formatting:
- `.editorconfig` - Editor configuration
- `.prettierrc` - Code formatting rules
- `.eslintrc.json` - JavaScript linting rules

## Code

The code is open source under the GNU General Public License V3.

The code is mostly maintained, so if you'd like to suggest features, feel free to open an issue. If you'd like to make a change yourself, feel free to open a pull request!
