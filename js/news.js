/**
 * JavaScript file for animations on MediTour Website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all animation components
  initTextAnimation();
  initParallaxEffect();
  initStickyHeader();
  initProgressBars();
  initNumberCounter();
  initImageZoom();
  initScrollReveal();
});

/**
* Animates text letter by letter
*/
function initTextAnimation() {
  const animatedTexts = document.querySelectorAll('.animated-text');
  
  if (animatedTexts.length) {
      animatedTexts.forEach((textElement) => {
          // Get the text
          let text = textElement.textContent;
          textElement.textContent = '';
          
          // Create elements for each letter
          for (let i = 0; i < text.length; i++) {
              const span = document.createElement('span');
              span.textContent = text[i];
              span.style.animationDelay = `${i * 0.05}s`;
              textElement.appendChild(span);
          }
          
          // Trigger animation when element is in viewport
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      const spans = entry.target.querySelectorAll('span');
                      spans.forEach(span => {
                          span.classList.add('animated');
                      });
                      observer.unobserve(entry.target);
                  }
              });
          });
          
          observer.observe(textElement);
      });
  }
}

/**
* Creates parallax effect for background images
*/
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length) {
      window.addEventListener('scroll', function() {
          const scrollTop = window.pageYOffset;
          
          parallaxElements.forEach(element => {
              const speed = element.getAttribute('data-speed') || 0.5;
              const offset = element.offsetTop;
              const height = element.offsetHeight;
              
              // Check if element is in viewport
              if (scrollTop + window.innerHeight > offset && scrollTop < offset + height) {
                  const yPos = (scrollTop - offset) * speed;
                  element.style.backgroundPosition = `center ${yPos}px`;
              }
          });
      });
  }
}

/**
* Makes header sticky on scroll
*/
function initStickyHeader() {
  const header = document.querySelector('.header');
  
  if (header) {
      let isSticky = false;
      const headerHeight = header.offsetHeight;
      
      window.addEventListener('scroll', function() {
          const scrollTop = window.pageYOffset;
          
          if (scrollTop > headerHeight && !isSticky) {
              header.classList.add('sticky');
              isSticky = true;
          } else if (scrollTop <= headerHeight && isSticky) {
              header.classList.remove('sticky');
              isSticky = false;
          }
      });
  }
}

/**
* Animates progress bars
*/
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  if (progressBars.length) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const percentage = entry.target.getAttribute('data-percentage') || 0;
                  entry.target.style.width = `${percentage}%`;
                  observer.unobserve(entry.target);
              }
          });
      });
      
      progressBars.forEach(progressBar => {
          observer.observe(progressBar);
      });
  }
}

/**
* Animates number counters
*/
function initNumberCounter() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length) {
      counters.forEach(counter => {
          const targetValue = parseInt(counter.getAttribute('data-target'));
          
          if (!isNaN(targetValue)) {
              counter.textContent = '0';
              
              const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting) {
                          let currentValue = 0;
                          const increment = Math.ceil(targetValue / 100);
                          const duration = 2000; // Animation duration in milliseconds
                          const stepTime = Math.floor(duration / (targetValue / increment));
                          
                          const timer = setInterval(() => {
                              currentValue += increment;
                              
                              if (currentValue > targetValue) {
                                  counter.textContent = targetValue.toLocaleString();
                                  clearInterval(timer);
                              } else {
                                  counter.textContent = currentValue.toLocaleString();
                              }
                          }, stepTime);
                          
                          observer.unobserve(entry.target);
                      }
                  });
              });
              
              observer.observe(counter);
          }
      });
  }
}

/**
* Image zoom effect on hover
*/
function initImageZoom() {
  const zoomContainers = document.querySelectorAll('.image-zoom');
  
  if (zoomContainers.length) {
      zoomContainers.forEach(container => {
          const image = container.querySelector('img');
          
          if (image) {
              // When mouse enters container
              container.addEventListener('mouseenter', function() {
                  image.style.transform = 'scale(1.1)';
              });
              
              // When mouse leaves container
              container.addEventListener('mouseleave', function() {
                  image.style.transform = 'scale(1)';
              });
          }
      });
  }
}

/**
* Reveals elements on scroll
*/
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (revealElements.length) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('revealed');
                  observer.unobserve(entry.target);
              }
          });
      }, {
          threshold: 0.1 // Element is considered visible when 10% of it is in viewport
      });
      
      revealElements.forEach(element => {
          observer.observe(element);
      });
  }
}

/**
* Button ripple effect
*/
function initRippleButtons() {
  const buttons = document.querySelectorAll('.btn-ripple');
  
  if (buttons.length) {
      buttons.forEach(button => {
          button.addEventListener('click', function(e) {
              const rect = button.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              const ripple = document.createElement('span');
              ripple.className = 'ripple';
              ripple.style.left = `${x}px`;
              ripple.style.top = `${y}px`;
              
              this.appendChild(ripple);
              
              setTimeout(() => {
                  ripple.remove();
              }, 600);
          });
      });
  }
}

/**
* Gradient text animation
*/
function initGradientText() {
  const gradientTextElements = document.querySelectorAll('.gradient-text');
  
  if (gradientTextElements.length) {
      gradientTextElements.forEach(element => {
          // Add styling for gradient text
          element.style.backgroundImage = 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))';
          element.style.backgroundSize = '200% 200%';
          element.style.webkitBackgroundClip = 'text';
          element.style.backgroundClip = 'text';
          element.style.webkitTextFillColor = 'transparent';
          element.style.color = 'transparent';
          
          // Add animation
          element.style.animation = 'gradient-shift 3s ease infinite';
      });
  }
}

/**
* Floating animation for elements
*/
function initFloatingElements() {
  const floatElements = document.querySelectorAll('.float');
  
  if (floatElements.length) {
      floatElements.forEach((element, index) => {
          // Add slight delay variation to make animation more natural
          const delay = index * 0.2;
          element.style.animationDelay = `${delay}s`;
      });
  }
}