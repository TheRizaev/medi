/**
 * Main JavaScript file for MediTour Website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initScrollAnimation();
  initSmoothScroll();
  initLanguageDropdown();
  initContactForm();
  
  // Conditionally initialize other components if their elements exist
  if (document.querySelector('.subscription-form')) {
      initSubscriptionForm();
  }
  
  if (document.querySelector('#partnership-form')) {
      initPartnershipForm();
  }
});

/**
* Initialize mobile menu functionality
*/
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', function() {
          // Toggle menu visibility
          mobileMenu.classList.toggle('open');
          // Toggle active state on the button
          this.classList.toggle('active');
      });
      
      // Close mobile menu when clicking on a menu item
      const mobileMenuLinks = mobileMenu.querySelectorAll('a');
      mobileMenuLinks.forEach(link => {
          link.addEventListener('click', function() {
              mobileMenu.classList.remove('open');
              mobileMenuToggle.classList.remove('active');
          });
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', function(event) {
          if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target) && mobileMenu.classList.contains('open')) {
              mobileMenu.classList.remove('open');
              mobileMenuToggle.classList.remove('active');
          }
      });
  }
}

/**
* Initialize scroll animations
*/
function initScrollAnimation() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in, .slide-in-top, .slide-in-bottom');
  
  // Check if elements are in viewport
  function checkIfInView() {
      animatedElements.forEach(element => {
          const elementPosition = element.getBoundingClientRect();
          // Element is in viewport if its top is less than the window height and its bottom is greater than 0
          const isVisible = (elementPosition.top < window.innerHeight - 50) && (elementPosition.bottom > 0);
          
          if (isVisible) {
              element.classList.add('appear');
          }
      });
  }
  
  // Run on page load for elements visible on initial load
  checkIfInView();
  
  // Run on scroll
  window.addEventListener('scroll', checkIfInView);
}

/**
* Initialize smooth scrolling for anchor links
*/
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
              // Get element position
              const elementPosition = targetElement.getBoundingClientRect().top;
              // Current scroll position
              const offsetPosition = elementPosition + window.pageYOffset - 80; // 80px header offset
              
              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
}

/**
* Initialize language dropdown
*/
function initLanguageDropdown() {
  const langDropdowns = document.querySelectorAll('.lang-dropdown');
  
  langDropdowns.forEach(dropdown => {
      const dropdownBtn = dropdown.querySelector('.lang-dropdown-btn');
      const dropdownContent = dropdown.querySelector('.lang-dropdown-content');
      const langOptions = dropdown.querySelectorAll('.lang-option');
      const currentLang = dropdown.querySelector('.current-lang');
      
      if (dropdownBtn && dropdownContent && langOptions.length) {
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
                  
                  // Show notification and reload page
                  showNotification(`Язык изменен на ${getLangName(langCode)}`, 'success');
                  
                  // Reload page after a short delay
                  setTimeout(() => {
                      location.reload();
                  }, 1000);
              });
          });
      }
  });
  
  // Helper function to get language name from code
  function getLangName(code) {
      const langNames = {
          'ru': 'Русский',
          'en': 'English',
          'uz': 'O\'zbek'
      };
      
      return langNames[code] || code.toUpperCase();
  }
}

/**
* Initialize contact form
*/
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          if (validateForm(this)) {
              // Submit form data
              submitForm(this, 
                  function() {
                      // Success callback
                      showNotification('Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
                  },
                  function() {
                      // Error callback
                      showNotification('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.', 'error');
                  }
              );
          }
      });
  }
}

/**
* Initialize subscription form
*/
function initSubscriptionForm() {
  const subscriptionForm = document.querySelector('.subscription-form');
  
  if (subscriptionForm) {
      subscriptionForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          if (validateForm(this)) {
              // Get email input
              const emailInput = this.querySelector('input[type="email"]');
              
              if (emailInput && emailInput.value.trim() !== '') {
                  // Reset form
                  this.reset();
                  
                  // Show success notification
                  showNotification('Вы успешно подписались на нашу рассылку!', 'success');
              }
          }
      });
  }
}

/**
* Initialize partnership form
*/
function initPartnershipForm() {
  const partnershipForm = document.getElementById('partnership-form');
  
  if (partnershipForm) {
      partnershipForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          if (validateForm(this)) {
              // Submit form data
              submitForm(this, 
                  function() {
                      // Success callback
                      showNotification('Ваша заявка на партнерство успешно отправлена. Наш менеджер свяжется с вами в ближайшее время.', 'success');
                  },
                  function() {
                      // Error callback
                      showNotification('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.', 'error');
                  }
              );
          }
      });
  }
}

/**
* Form validation
* @param {HTMLFormElement} form - The form to validate
* @returns {boolean} - Validation result
*/
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input, textarea, select');
  
  // Clear previous error messages
  const errorMessages = form.querySelectorAll('.error-message');
  errorMessages.forEach(message => message.remove());
  
  inputs.forEach(input => {
      input.classList.remove('error');
      
      // Required field validation
      if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          showInputError(input, 'Это поле обязательно для заполнения');
      }
      
      // Email validation
      if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value.trim())) {
              isValid = false;
              showInputError(input, 'Пожалуйста, введите корректный email');
          }
      }
      
      // Phone validation
      if (input.type === 'tel' && input.value.trim()) {
          const phonePattern = /^\+?[\d\s\-()]{10,}$/;
          if (!phonePattern.test(input.value.trim())) {
              isValid = false;
              showInputError(input, 'Пожалуйста, введите корректный номер телефона');
          }
      }
  });
  
  return isValid;
  
  // Helper function to show input error
  function showInputError(input, message) {
      input.classList.add('error');
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      // If form group exists, append to it, otherwise append after input
      const formGroup = input.closest('.form-group');
      if (formGroup) {
          formGroup.appendChild(errorElement);
      } else {
          input.insertAdjacentElement('afterend', errorElement);
      }
  }
}

/**
* Form submission
* @param {HTMLFormElement} form - The form to submit
* @param {Function} successCallback - Success callback function
* @param {Function} errorCallback - Error callback function
*/
function submitForm(form, successCallback, errorCallback) {
  // Get submit button
  const submitButton = form.querySelector('[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  
  // Disable button and show loading indicator
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="loader"></span> Отправка...';
  
  // Collect form data
  const formData = new FormData(form);
  const formObject = {};
  
  formData.forEach((value, key) => {
      formObject[key] = value;
  });
  
  // In a real project, here would be an API call to submit the form data
  // For demonstration, we're using setTimeout to simulate an API call
  setTimeout(() => {
      // Simulate a successful response
      const success = Math.random() > 0.2; // 80% success probability for demonstration
      
      if (success) {
          // Reset form
          form.reset();
          
          // Call success callback
          if (typeof successCallback === 'function') {
              successCallback();
          }
      } else {
          // Call error callback
          if (typeof errorCallback === 'function') {
              errorCallback();
          }
      }
      
      // Restore button
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
  }, 1500);
}

/**
* Show notification
* @param {string} message - Notification message
* @param {string} type - Notification type (success, error, warning, info)
*/
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
      <div class="notification-content">
          <i class="notification-icon fas ${getIconByType(type)}"></i>
          <p>${message}</p>
      </div>
      <button class="notification-close">&times;</button>
  `;
  
  // Get or create notification container
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
  }
  
  // Add notification to container
  notificationContainer.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => {
      notification.classList.add('active');
  }, 10);
  
  // Auto-hide after 5 seconds
  const timerId = setTimeout(() => {
      removeNotification(notification);
  }, 5000);
  
  // Close button click handler
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
      clearTimeout(timerId);
      removeNotification(notification);
  });
  
  // Helper function to get icon by notification type
  function getIconByType(type) {
      switch (type) {
          case 'success':
              return 'fa-check-circle';
          case 'error':
              return 'fa-times-circle';
          case 'warning':
              return 'fa-exclamation-triangle';
          default:
              return 'fa-info-circle';
      }
  }
  
  // Helper function to remove notification with animation
  function removeNotification(notificationElement) {
      notificationElement.classList.remove('active');
      
      // Remove element after animation completes
      setTimeout(() => {
          if (notificationElement.parentNode) {
              notificationElement.parentNode.removeChild(notificationElement);
              
              // Remove container if it's empty
              if (notificationContainer.children.length === 0) {
                  document.body.removeChild(notificationContainer);
              }
          }
      }, 300);
  }
}