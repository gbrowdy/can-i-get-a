// Internationalization logic
const i18n = {
  currentLanguage: 'en',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'fr', 'gr', 'dk'],

  // Get language from URL parameter or browser preference
  detectLanguage() {
    // Check URL parameter first (?lang=fr)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.supportedLanguages.includes(urlLang)) {
      return urlLang;
    }

    // Check localStorage for saved preference
    try {
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && this.supportedLanguages.includes(savedLang)) {
        return savedLang;
      }
    } catch (e) {
      // localStorage might be unavailable or throw errors
      // Fall through to next detection method
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    return this.defaultLanguage;
  },

  // Set the current language
  setLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.warn(`Language ${lang} not supported, falling back to ${this.defaultLanguage}`);
      lang = this.defaultLanguage;
    }

    this.currentLanguage = lang;
    try {
      localStorage.setItem('preferredLanguage', lang);
    } catch (e) {
      // localStorage might be unavailable, continue anyway
    }

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);

    this.updatePage();
  },

  // Get translation for current language
  t(key) {
    const translation = translations[this.currentLanguage];
    if (!translation) {
      console.error(`Translation not found for language: ${this.currentLanguage}`);
      return '';
    }

    // Support nested keys like 'buttons.location'
    const keys = key.split('.');
    let value = translation;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        console.error(`Translation key not found: ${key} in language ${this.currentLanguage}`);
        return '';
      }
    }

    return value;
  },

  // Get suggestions for current language
  getSuggestions() {
    // Dynamically load suggestions based on current language
    const scriptMap = {
      en: 'script_en.js',
      fr: 'script_fr.js',
      gr: 'script_gr.js',
      dk: 'script_dk.js'
    };

    return new Promise((resolve, reject) => {
      const scriptFile = scriptMap[this.currentLanguage];
      if (!scriptFile) {
        reject(new Error(`No suggestion file for language: ${this.currentLanguage}`));
        return;
      }

      // Check if script is already loaded
      if (window.suggestionData && window.suggestionData[this.currentLanguage]) {
        resolve(window.suggestionData[this.currentLanguage]);
        return;
      }

      // Load script dynamically
      const script = document.createElement('script');
      script.src = scriptFile;
      script.onload = () => {
        // Extract suggestions from the loaded script
        // The script defines a main() function, we need to get the suggestions from it
        resolve(null); // Will be handled differently
      };
      script.onerror = () => reject(new Error(`Failed to load ${scriptFile}`));
      document.head.appendChild(script);
    });
  },

  // Update all page content
  updatePage() {
    // Update document title
    document.title = this.t('title');

    // Update body class for language-specific styling
    document.body.className = this.t('bodyClass');

    // Update title
    const titleEl = document.querySelector('.title');
    if (titleEl) titleEl.innerHTML = this.t('title');

    // Update subtitle
    const subEl = document.querySelector('.sub');
    if (subEl) subEl.innerHTML = this.t('subtitle');

    // Update buttons
    const locationBtn = document.querySelector('.location');
    if (locationBtn) locationBtn.textContent = this.t('buttons.location');

    const relationshipBtn = document.querySelector('.relationship');
    if (relationshipBtn) relationshipBtn.textContent = this.t('buttons.relationship');

    const wordBtn = document.querySelector('.word');
    if (wordBtn) wordBtn.textContent = this.t('buttons.word');

    // Update credit
    const creditEl = document.querySelector('.credit');
    if (creditEl) creditEl.innerHTML = this.t('credit');

    // Update language switcher active state
    this.updateLanguageSwitcher();

    // Dispatch event that language changed (for reloading suggestions)
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLanguage }
    }));
  },

  // Update language switcher active state
  updateLanguageSwitcher() {
    document.querySelectorAll('.language-switcher a').forEach(link => {
      const lang = link.dataset.lang;
      if (lang === this.currentLanguage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  // Initialize i18n system
  init() {
    this.currentLanguage = this.detectLanguage();

    // Set up language switcher click handlers
    document.querySelectorAll('.language-switcher a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.dataset.lang;
        this.setLanguage(lang);
      });
    });

    // Initial page update
    this.updatePage();
  }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { i18n };
}
