/**
 * JavaScript file for handling multilingual functionality on MediTour Website
 */

// Available languages
const LANGUAGES = {
    'ru': 'Русский',
    'en': 'English',
    'uz': 'O\'zbek'
};

// Translation cache
let translations = {};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language handling
    initLanguageSelector();
    loadLanguage();
});

/**
 * Initialize language selector dropdowns
 */
function initLanguageSelector() {
    const langDropdowns = document.querySelectorAll('.lang-dropdown');
    
    langDropdowns.forEach(dropdown => {
        const dropdownBtn = dropdown.querySelector('.lang-dropdown-btn');
        const dropdownContent = dropdown.querySelector('.lang-dropdown-content');
        const langOptions = dropdown.querySelectorAll('.lang-option');
        const currentLang = dropdown.querySelector('.current-lang');
        
        if (dropdownBtn && dropdownContent && langOptions.length) {
            // Set current language from localStorage
            const savedLang = localStorage.getItem('selectedLanguage') || 'ru';
            if (currentLang) {
                currentLang.textContent = savedLang.toUpperCase();
            }
            
            // Mark active language option
            langOptions.forEach(option => {
                if (option.getAttribute('data-lang') === savedLang) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
            
            // Toggle dropdown on button click
            dropdownBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event from bubbling up
                dropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                dropdown.classList.remove('active');
            });
            
            // Handle language selection
            langOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get selected language code
                    const langCode = this.getAttribute('data-lang');
                    
                    // Update current language display
                    if (currentLang) {
                        currentLang.textContent = langCode.toUpperCase();
                    }
                    
                    // Remove active class from all options
                    langOptions.forEach(opt => opt.classList.remove('active'));
                    
                    // Add active class to selected option
                    this.classList.add('active');
                    
                    // Close the dropdown
                    dropdown.classList.remove('active');
                    
                    // Save selected language to localStorage
                    localStorage.setItem('selectedLanguage', langCode);
                    
                    // Load new language
                    loadLanguage(langCode, true);
                });
            });
        }
    });
}

/**
 * Load language translations and apply them
 * @param {string} lang - Language code to load (optional, default: from localStorage)
 * @param {boolean} showNotification - Whether to show notification (optional, default: false)
 */
function loadLanguage(lang, showNotification = false) {
    // Get language from parameter, localStorage, or default to Russian
    const langCode = lang || localStorage.getItem('selectedLanguage') || 'ru';
    
    // Fetch language file
    fetch(`locales/${langCode}.json`)
        .then(response => response.json())
        .then(data => {
            // Save translations to cache
            translations = data;
            
            // Apply translations to all elements with data-i18n attribute
            applyTranslations();
            
            // Save selected language in localStorage
            localStorage.setItem('selectedLanguage', langCode);
            
            // Change html lang attribute
            document.documentElement.lang = langCode;
            
            // Show notification if requested
            if (showNotification) {
                showLanguageChangeNotification(langCode);
            }
        })
        .catch(error => {
            console.error('Error loading language file:', error);
            
            // Fallback to Russian if loading fails
            if (langCode !== 'ru') {
                console.log('Falling back to Russian');
                loadLanguage('ru');
            }
        });
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[key]) {
            // Special handling for input placeholders
            if (element.hasAttribute('placeholder')) {
                element.placeholder = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });
}

/**
 * Show notification about language change
 * @param {string} langCode - Language code
 */
function showLanguageChangeNotification(langCode) {
    let langName = LANGUAGES[langCode] || langCode.toUpperCase();
    
    // Get proper message based on language
    let message;
    switch (langCode) {
        case 'ru':
            message = `Язык изменен на ${langName}`;
            break;
        case 'en':
            message = `Language changed to ${langName}`;
            break;
        case 'uz':
            message = `Til ${langName} ga o'zgartirildi`;
            break;
        default:
            message = `Language changed to ${langName}`;
    }
    
    // Use the notification function from main.js
    if (typeof showNotification === 'function') {
        showNotification(message, 'success');
    } else {
        alert(message);
    }
}

/**
 * Translate a specific key
 * @param {string} key - Translation key
 * @param {Object} params - Parameters for interpolation (optional)
 * @returns {string} Translated text
 */
function translate(key, params = {}) {
    if (!translations[key]) {
        console.warn(`Translation key not found: ${key}`);
        return key;
    }
    
    let text = translations[key];
    
    // Replace parameters
    for (const [param, value] of Object.entries(params)) {
        text = text.replace(`{${param}}`, value);
    }
    
    return text;
}

/**
 * Update page contents when language changes
 */
function updatePageContent() {
    // Update dynamic content that isn't handled by data-i18n attributes
    // This will be specific to each page
    
    // Example: Update news dates
    const newsDates = document.querySelectorAll('.news-date');
    newsDates.forEach(dateElement => {
        const dateStr = dateElement.getAttribute('data-date');
        if (dateStr) {
            const date = new Date(dateStr);
            dateElement.textContent = formatDate(date);
        }
    });
}

/**
 * Format date according to current language
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const langCode = localStorage.getItem('selectedLanguage') || 'ru';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    return date.toLocaleDateString(langCode, options);
}

// Export functions for use in other files
export {
    loadLanguage,
    translate,
    formatDate,
    updatePageContent,
    LANGUAGES
};