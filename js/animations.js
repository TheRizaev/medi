/**
 * JavaScript файл для анимаций сайта медицинского туризма в Узбекистане
 * MediTour - Узбекистан
 */

// Дождемся полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех анимаций
    initTextAnimation();
    initParallaxEffect();
    initStickyHeader();
    initProgressBars();
    initNumberCounter();
    initImageZoom();
  });
  
  /**
   * Анимация текста по буквам
   */
  function initTextAnimation() {
    const animatedTexts = document.querySelectorAll('.animated-text');
    
    if (animatedTexts.length) {
      animatedTexts.forEach((textElement) => {
        // Получаем текст
        let text = textElement.textContent;
        textElement.textContent = '';
        
        // Создаем элементы для каждой буквы
        for (let i = 0; i < text.length; i++) {
          const span = document.createElement('span');
          span.textContent = text[i];
          span.style.animationDelay = `${i * 0.05}s`;
          textElement.appendChild(span);
        }
        
        // Запускаем анимацию, когда элемент в поле зрения
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
   * Эффект параллакса для фоновых изображений
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
          
          // Проверяем, находится ли элемент в области видимости
          if (scrollTop + window.innerHeight > offset && scrollTop < offset + height) {
            const yPos = (scrollTop - offset) * speed;
            element.style.backgroundPosition = `center ${yPos}px`;
          }
        });
      });
    }
  }
  
  /**
   * Фиксированная шапка при скролле
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
          
          // Добавляем отступ для контента, чтобы избежать скачка
          document.body.style.paddingTop = `${headerHeight}px`;
        } else if (scrollTop <= headerHeight && isSticky) {
          header.classList.remove('sticky');
          isSticky = false;
          
          // Убираем отступ
          document.body.style.paddingTop = '0';
        }
      });
    }
  }
  
  /**
   * Анимация индикаторов прогресса
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
   * Анимация счетчика чисел
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
                const duration = 2000; // Длительность анимации в миллисекундах
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
   * Анимация увеличения изображений при наведении
   */
  function initImageZoom() {
    const zoomContainers = document.querySelectorAll('.image-zoom');
    
    if (zoomContainers.length) {
      zoomContainers.forEach(container => {
        const image = container.querySelector('img');
        
        if (image) {
          // При наведении курсора на контейнер
          container.addEventListener('mouseenter', function() {
            image.style.transform = 'scale(1.1)';
          });
          
          // При уходе курсора с контейнера
          container.addEventListener('mouseleave', function() {
            image.style.transform = 'scale(1)';
          });
        }
      });
    }
  }
  
  /**
   * Анимация для карточек с эффектом переворота
   */
  function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    if (flipCards.length) {
      flipCards.forEach(card => {
        card.addEventListener('click', function() {
          this.classList.toggle('flipped');
        });
      });
    }
  }
  
  /**
   * Анимация пульсации для элементов
   */
  function initPulseAnimation() {
    const pulseElements = document.querySelectorAll('.pulse-element');
    
    if (pulseElements.length) {
      pulseElements.forEach(element => {
        // Добавляем класс для анимации
        element.classList.add('pulse');
        
        // Останавливаем анимацию при наведении
        element.addEventListener('mouseenter', function() {
          this.classList.remove('pulse');
        });
        
        // Возобновляем анимацию при уходе курсора
        element.addEventListener('mouseleave', function() {
          this.classList.add('pulse');
        });
      });
    }
  }
  
  /**
   * Анимация печатающегося текста
   */
  function initTypeWriter() {
    const typeElements = document.querySelectorAll('.typewriter');
    
    if (typeElements.length) {
      typeElements.forEach(element => {
        const text = element.getAttribute('data-text');
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        
        if (text) {
          element.textContent = '';
          
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                let charIndex = 0;
                
                const typeInterval = setInterval(() => {
                  if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                  } else {
                    clearInterval(typeInterval);
                    // Добавляем класс, чтобы показать курсор мигающим
                    element.classList.add('typewriter-done');
                  }
                }, speed);
                
                observer.unobserve(entry.target);
              }
            });
          });
          
          observer.observe(element);
        }
      });
    }
  }
  
  /**
   * Анимация для кнопок с волновым эффектом
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
   * Анимация прокрутки с плавным появлением элементов
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
        threshold: 0.1 // 10% элемента должно быть видимо
      });
      
      revealElements.forEach(element => {
        observer.observe(element);
      });
    }
  }
  
  /**
   * Анимация движения элементов за курсором
   */
  function initMouseFollowEffect() {
    const followElements = document.querySelectorAll('.mouse-follow');
    
    if (followElements.length) {
      document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        followElements.forEach(element => {
          const speed = parseFloat(element.getAttribute('data-speed')) || 0.05;
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distanceX = mouseX - centerX;
          const distanceY = mouseY - centerY;
          
          element.style.transform = `translate(${distanceX * speed}px, ${distanceY * speed}px)`;
        });
      });
    }
  }
  
  /**
   * Анимация градиентного текста
   */
  function initGradientText() {
    const gradientTextElements = document.querySelectorAll('.gradient-text');
    
    if (gradientTextElements.length) {
      gradientTextElements.forEach(element => {
        // Добавляем стилизацию для градиентного текста
        element.style.backgroundImage = 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))';
        element.style.backgroundSize = '200% 200%';
        element.style.webkitBackgroundClip = 'text';
        element.style.backgroundClip = 'text';
        element.style.webkitTextFillColor = 'transparent';
        element.style.color = 'transparent';
        
        // Добавляем анимацию
        element.style.animation = 'gradient-shift 3s ease infinite';
      });
    }
  }
  
  // Экспортируем функции для использования в других файлах
  export {
    initTextAnimation,
    initParallaxEffect,
    initStickyHeader,
    initProgressBars,
    initNumberCounter,
    initImageZoom,
    initFlipCards,
    initPulseAnimation,
    initTypeWriter,
    initRippleButtons,
    initScrollReveal,
    initMouseFollowEffect,
    initGradientText
  };