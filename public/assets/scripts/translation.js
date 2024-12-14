function TranslateInit() {
    if (!window.__GOOGLE_TRANSLATION_CONFIG__) {
      return;
    }
    new google.translate.TranslateElement({
      pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
    });
  }
  
  // Ensure the global object has the configuration if it's not already set
  if (window.__GOOGLE_TRANSLATION_CONFIG__) {
    window.__GOOGLE_TRANSLATION_CONFIG__ = JSON.parse(process.env.GOOGLE_TRANSLATION_CONFIG || '{}');
  }
  