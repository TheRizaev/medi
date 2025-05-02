/**
 * JavaScript файл для административной панели сайта медицинского туризма в Узбекистане
 * MediTour - Узбекистан
 */

// Импортируем необходимые функции из новостного модуля
import { initAdminPanel, initImportData, initExportData } from './news.js';
import { showNotification, validateForm } from './main.js';

// Дождемся полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация административной панели
  initAdmin();
});

/**
 * Инициализация административного интерфейса
 */
function initAdmin() {
  // Проверка авторизации
  checkAuth();
  
  // Обработчик формы авторизации
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        loginUser(this);
      }
    });
  }
  
  // Обработчик выхода из системы
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logoutUser();
    });
  }
  
  // Инициализация панели управления новостями
  initAdminPanel();
  
  // Инициализация импорта/экспорта данных
  initImportData();
  initExportData();
  
  // Инициализация навигации по табам
  initTabNavigation();
}

/**
 * Проверка авторизации пользователя
 */
function checkAuth() {
  const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
  const loginContainer = document.getElementById('login-container');
  const adminContainer = document.getElementById('admin-container');
  
  if (loginContainer && adminContainer) {
    if (isLoggedIn) {
      // Пользователь авторизован - показываем админ-панель
      loginContainer.classList.add('hidden');
      adminContainer.classList.remove('hidden');
      
      // Устанавливаем имя пользователя
      const username = localStorage.getItem('admin_username') || 'Администратор';
      const userNameElement = document.getElementById('admin-username');
      
      if (userNameElement) {
        userNameElement.textContent = username;
      }
    } else {
      // Пользователь не авторизован - показываем форму входа
      loginContainer.classList.remove('hidden');
      adminContainer.classList.add('hidden');
    }
  }
}

/**
 * Авторизация пользователя
 * @param {HTMLFormElement} form - Форма авторизации
 */
function loginUser(form) {
  const username = form.querySelector('#username').value;
  const password = form.querySelector('#password').value;
  
  // В реальном проекте здесь был бы запрос к API для проверки учетных данных
  // Для демонстрации используем захардкоженные данные
  
  // Демо-аккаунт admin:admin123
  if (username === 'admin' && password === 'admin123') {
    // Сохраняем информацию о входе
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('admin_username', username);
    
    // Обновляем интерфейс
    checkAuth();
    
    showNotification('Вы успешно вошли в систему', 'success');
  } else {
    showNotification('Неверное имя пользователя или пароль', 'error');
  }
}

/**
 * Выход из системы
 */
function logoutUser() {
  // Удаляем информацию о входе
  localStorage.removeItem('admin_logged_in');
  localStorage.removeItem('admin_username');
  
  // Обновляем интерфейс
  checkAuth();
  
  showNotification('Вы успешно вышли из системы', 'success');
}

/**
 * Инициализация навигации по табам в админ-панели
 */
function initTabNavigation() {
  const tabLinks = document.querySelectorAll('.admin-tab-link');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  
  if (tabLinks.length && tabContents.length) {
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Получаем ID таба
        const tabId = this.getAttribute('data-tab');
        
        // Удаляем активный класс у всех вкладок и контентов
        tabLinks.forEach(item => item.classList.remove('active'));
        tabContents.forEach(item => item.classList.add('hidden'));
        
        // Добавляем активный класс текущей вкладке и соответствующему контенту
        this.classList.add('active');
        document.getElementById(tabId).classList.remove('hidden');
      });
    });
  }
}

/**
 * Получение статистики для отображения на дашборде
 */
function loadAdminStatistics() {
  const statsContainer = document.getElementById('admin-stats');
  
  if (statsContainer) {
    // Загружаем новости
    loadNews()
      .then(news => {
        // Получаем общее количество новостей
        const totalNews = news.length;
        
        // Получаем количество новостей по категориям
        const categoriesStats = {};
        news.forEach(item => {
          if (categoriesStats[item.category]) {
            categoriesStats[item.category]++;
          } else {
            categoriesStats[item.category] = 1;
          }
        });
        
        // Получаем количество новостей за последний месяц
        const currentDate = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(currentDate.getMonth() - 1);
        
        const recentNews = news.filter(item => new Date(item.date) > lastMonth).length;
        
        // Отображаем статистику
        statsContainer.innerHTML = `
          <div class="admin-stats-grid">
            <div class="admin-stat-card">
              <div class="admin-stat-icon">
                <i class="fas fa-newspaper"></i>
              </div>
              <div class="admin-stat-content">
                <div class="admin-stat-number">${totalNews}</div>
                <div class="admin-stat-label">Всего новостей</div>
              </div>
            </div>
            
            <div class="admin-stat-card">
              <div class="admin-stat-icon">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <div class="admin-stat-content">
                <div class="admin-stat-number">${recentNews}</div>
                <div class="admin-stat-label">За последний месяц</div>
              </div>
            </div>
            
            <div class="admin-stat-card">
              <div class="admin-stat-icon">
                <i class="fas fa-tags"></i>
              </div>
              <div class="admin-stat-content">
                <div class="admin-stat-number">${Object.keys(categoriesStats).length}</div>
                <div class="admin-stat-label">Категорий</div>
              </div>
            </div>
          </div>
          
          <div class="admin-chart-container">
            <h3>Распределение новостей по категориям</h3>
            <canvas id="categories-chart"></canvas>
          </div>
        `;
        
        // Рисуем диаграмму распределения по категориям
        drawCategoriesChart(categoriesStats);
      })
      .catch(error => {
        console.error('Ошибка загрузки статистики:', error);
        statsContainer.innerHTML = `
          <div class="alert alert-danger">
            <p>Произошла ошибка при загрузке статистики. Пожалуйста, попробуйте позже.</p>
          </div>
        `;
      });
  }
}

/**
 * Рисование диаграммы распределения новостей по категориям
 * @param {Object} categoriesStats - Статистика категорий
 */
function drawCategoriesChart(categoriesStats) {
  const canvas = document.getElementById('categories-chart');
  
  if (canvas && typeof Chart !== 'undefined') {
    // Преобразуем данные для диаграммы
    const labels = Object.keys(categoriesStats);
    const data = Object.values(categoriesStats);
    
    // Генерируем цвета для категорий
    const colors = labels.map((_, index) => {
      const hue = (index * 360 / labels.length) % 360;
      return `hsl(${hue}, 70%, 60%)`;
    });
    
    // Создаем диаграмму
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: 'white',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                family: 'Montserrat',
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

/**
 * Загрузка новостей
 * @returns {Promise<Array>} Массив новостей
 */
function loadNews() {
  return new Promise((resolve, reject) => {
    // Сначала пробуем получить новости из localStorage
    const storedNews = localStorage.getItem('news');
    
    if (storedNews) {
      try {
        const newsData = JSON.parse(storedNews);
        resolve(newsData);
      } catch (error) {
        reject(error);
      }
    } else {
      // Если в localStorage ничего нет, возвращаем пустой массив
      resolve([]);
    }
  });
}

// Экспортируем функции для использования в других файлах
export {
  initAdmin,
  loadAdminStatistics
};