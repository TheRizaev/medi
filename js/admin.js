/**
 * JavaScript file for administrative panel on MediTour Website
 */

// Import necessary functions from other modules
import { loadLanguage, translate } from './language.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize admin panel
  initAdmin();
});

/**
* Initialize administrative interface
*/
function initAdmin() {
  // Check authorization
  checkAuth();
  
  // Initialize login form
  initLoginForm();
  
  // Initialize logout button
  initLogoutButton();
  
  // Initialize tab navigation
  initTabNavigation();
  
  // Initialize news management
  initNewsManagement();
  
  // Initialize settings
  initSettings();
}

/**
* Check if user is authorized
*/
function checkAuth() {
  const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
  const loginContainer = document.getElementById('login-container');
  const adminContainer = document.getElementById('admin-container');
  
  if (loginContainer && adminContainer) {
    if (isLoggedIn) {
      // User is logged in - show admin panel
      loginContainer.classList.add('hidden');
      adminContainer.classList.remove('hidden');
      
      // Set username
      const username = localStorage.getItem('admin_username') || 'Администратор';
      const userNameElement = document.getElementById('admin-username');
      
      if (userNameElement) {
        userNameElement.textContent = username;
      }
      
      // Load admin data
      loadAdminData();
    } else {
      // User is not logged in - show login form
      loginContainer.classList.remove('hidden');
      adminContainer.classList.add('hidden');
    }
  }
}

/**
* Initialize login form
*/
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = this.querySelector('#username').value;
      const password = this.querySelector('#password').value;
      
      // Validate credentials
      if (username === 'admin' && password === 'admin') {
        // Store login information
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', username);
        
        // Update UI
        checkAuth();
        
        // Show success notification
        showNotification('Вы успешно вошли в систему', 'success');
      } else {
        // Show error notification
        showNotification('Неверное имя пользователя или пароль', 'error');
        
        // Clear password field
        this.querySelector('#password').value = '';
      }
    });
  }
}

/**
* Initialize logout button
*/
function initLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Remove login information
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_username');
      
      // Update UI
      checkAuth();
      
      // Show notification
      showNotification('Вы успешно вышли из системы', 'success');
    });
  }
}

/**
* Initialize tab navigation
*/
function initTabNavigation() {
  const tabLinks = document.querySelectorAll('.admin-tab-link');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  
  if (tabLinks.length && tabContents.length) {
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get tab ID
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabLinks.forEach(item => item.classList.remove('active'));
        tabContents.forEach(item => item.classList.add('hidden'));
        
        // Add active class to current tab and content
        this.classList.add('active');
        document.getElementById(tabId).classList.remove('hidden');
      });
    });
  }
}

/**
* Initialize news management
*/
function initNewsManagement() {
  // Initialize add news button
  initAddNewsButton();
  
  // Initialize news form
  initNewsForm();
  
  // Initialize news filter
  initNewsFilter();
  
  // Initialize delete confirmation
  initDeleteConfirmation();
}

/**
* Initialize add news button
*/
function initAddNewsButton() {
  const addNewsBtn = document.getElementById('add-news-btn');
  const newsFormModal = document.getElementById('news-form-modal');
  
  if (addNewsBtn && newsFormModal) {
    addNewsBtn.addEventListener('click', function() {
      // Reset form
      document.getElementById('news-form').reset();
      document.getElementById('news-id').value = '';
      document.getElementById('preview-image').src = 'img/placeholder.jpg';
      
      // Update form title
      document.getElementById('news-form-title').textContent = 'Добавить новость';
      
      // Set current date
      const currentDate = new Date().toISOString().split('T')[0];
      document.getElementById('news-date').value = currentDate;
      
      // Show modal
      newsFormModal.classList.add('show');
    });
    
    // Initialize modal close
    const closeButtons = newsFormModal.querySelectorAll('.admin-modal-close, #cancel-news-btn');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        newsFormModal.classList.remove('show');
      });
    });
  }
}

/**
* Initialize news form
*/
function initNewsForm() {
  const newsForm = document.getElementById('news-form');
  const newsFormModal = document.getElementById('news-form-modal');
  const imageInput = document.getElementById('news-image');
  const uploadBtn = document.getElementById('upload-image-btn');
  
  if (newsForm && imageInput && uploadBtn) {
    // Image upload button
    uploadBtn.addEventListener('click', function() {
      imageInput.click();
    });
    
    // Image change handler
    imageInput.addEventListener('change', function() {
      const file = this.files[0];
      
      if (file) {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
          showNotification('Пожалуйста, выберите изображение', 'error');
          return;
        }
        
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          showNotification('Размер изображения не должен превышать 2MB', 'error');
          return;
        }
        
        // Display preview
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('preview-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Form submit handler
    newsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const newsId = document.getElementById('news-id').value;
      const title = document.getElementById('news-title').value;
      const category = document.getElementById('news-category').value;
      const date = document.getElementById('news-date').value;
      const preview = document.getElementById('news-preview').value;
      const content = document.getElementById('news-content').value;
      const imageFile = document.getElementById('news-image').files[0];
      
      // Validate fields
      if (!title || !category || !date || !preview || !content) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
      }
      
      // Check if it's a new news item and image is required
      const isNewNews = !newsId;
      if (isNewNews && !imageFile) {
        showNotification('Пожалуйста, выберите изображение', 'error');
        return;
      }
      
      // Get news data
      let newsData = JSON.parse(localStorage.getItem('news') || '[]');
      
      // Prepare new news item
      const newsItem = {
        id: isNewNews ? generateUniqueId(newsData) : newsId,
        title,
        category,
        date,
        preview,
        content,
        image: isNewNews ? `img/news/news-${Date.now()}.jpg` : document.getElementById('preview-image').src
      };
      
      // Update or add news item
      if (isNewNews) {
        // Add new news
        newsData.push(newsItem);
      } else {
        // Update existing news
        const index = newsData.findIndex(item => item.id === newsId);
        if (index !== -1) {
          newsData[index] = newsItem;
        }
      }
      
      // Sort news by date (newest first)
      newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Save data
      localStorage.setItem('news', JSON.stringify(newsData));
      
      // In a real project, we would upload the image to the server here
      // For demonstration, we'll just assume it's saved
      
      // Close modal
      newsFormModal.classList.remove('show');
      
      // Reload news
      loadNews();
      
      // Show success notification
      showNotification(`Новость успешно ${isNewNews ? 'добавлена' : 'обновлена'}`, 'success');
    });
  }
}

/**
* Generate unique ID for news
* @param {Array} newsData - Existing news data
* @returns {string} - Unique ID
*/
function generateUniqueId(newsData) {
  let id = 1;
  
  if (newsData.length > 0) {
    // Find highest existing ID
    const highestId = Math.max(...newsData.map(item => parseInt(item.id)));
    id = highestId + 1;
  }
  
  return id.toString();
}

/**
* Initialize news filter
*/
function initNewsFilter() {
  const categoryFilter = document.getElementById('category-filter');
  const dateFilter = document.getElementById('date-filter');
  const searchInput = document.getElementById('admin-news-search');
  
  if (categoryFilter && dateFilter && searchInput) {
    // Category filter change
    categoryFilter.addEventListener('change', function() {
      filterNews();
    });
    
    // Date filter change
    dateFilter.addEventListener('change', function() {
      filterNews();
    });
    
    // Search input
    searchInput.addEventListener('input', function() {
      filterNews();
    });
  }
}

/**
* Filter news based on selected filters
*/
function filterNews() {
  const categoryFilter = document.getElementById('category-filter').value;
  const dateFilter = document.getElementById('date-filter').value;
  const searchQuery = document.getElementById('admin-news-search').value.toLowerCase();
  
  // Get all news rows
  const newsRows = document.querySelectorAll('#news-table-body tr');
  
  newsRows.forEach(row => {
    const category = row.querySelector('.news-category').textContent;
    const date = new Date(row.getAttribute('data-date'));
    const title = row.querySelector('.news-title').textContent.toLowerCase();
    
    let showRow = true;
    
    // Category filter
    if (categoryFilter !== 'all' && category !== categoryFilter) {
      showRow = false;
    }
    
    // Date filter
    if (dateFilter !== 'all' && showRow) {
      const currentDate = new Date();
      let minDate;
      
      switch (dateFilter) {
        case 'week':
          minDate = new Date();
          minDate.setDate(currentDate.getDate() - 7);
          break;
        case 'month':
          minDate = new Date();
          minDate.setMonth(currentDate.getMonth() - 1);
          break;
        case 'year':
          minDate = new Date();
          minDate.setFullYear(currentDate.getFullYear() - 1);
          break;
      }
      
      if (date < minDate) {
        showRow = false;
      }
    }
    
    // Search filter
    if (searchQuery && showRow) {
      if (!title.includes(searchQuery)) {
        showRow = false;
      }
    }
    
    // Show or hide row
    row.classList.toggle('hidden', !showRow);
  });
  
  // Update pagination
  updatePagination();
}

/**
* Initialize delete confirmation
*/
function initDeleteConfirmation() {
  const deleteModal = document.getElementById('delete-confirmation-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const closeModalBtn = deleteModal.querySelector('.admin-modal-close');
  
  let newsIdToDelete = null;
  
  // Initialize delete buttons
  document.addEventListener('click', function(e) {
    if (e.target.closest('.delete-news-btn')) {
      const btn = e.target.closest('.delete-news-btn');
      newsIdToDelete = btn.getAttribute('data-id');
      
      // Show confirmation modal
      deleteModal.classList.add('show');
    }
  });
  
  // Confirm delete
  confirmDeleteBtn.addEventListener('click', function() {
    if (newsIdToDelete) {
      deleteNews(newsIdToDelete);
      
      // Close modal
      deleteModal.classList.remove('show');
      
      // Reset
      newsIdToDelete = null;
    }
  });
  
  // Cancel delete
  cancelDeleteBtn.addEventListener('click', function() {
    // Close modal
    deleteModal.classList.remove('show');
    
    // Reset
    newsIdToDelete = null;
  });
  
  // Close modal
  closeModalBtn.addEventListener('click', function() {
    // Close modal
    deleteModal.classList.remove('show');
    
    // Reset
    newsIdToDelete = null;
  });
}

/**
* Delete news item
* @param {string} id - News ID to delete
*/
function deleteNews(id) {
  // Get news data
  let newsData = JSON.parse(localStorage.getItem('news') || '[]');
  
  // Find news index
  const index = newsData.findIndex(item => item.id === id);
  
  if (index !== -1) {
    // Remove news
    newsData.splice(index, 1);
    
    // Save data
    localStorage.setItem('news', JSON.stringify(newsData));
    
    // Reload news
    loadNews();
    
    // Show success notification
    showNotification('Новость успешно удалена', 'success');
  }
}

/**
* Initialize settings
*/
function initSettings() {
  // Initialize import/export
  initImportExport();
  
  // Initialize change password
  initChangePassword();
}

/**
* Initialize import/export
*/
function initImportExport() {
  const exportBtn = document.getElementById('export-news-btn');
  const importBtn = document.getElementById('import-btn');
  const importFile = document.getElementById('import-file');
  
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      // Get news data
      const newsData = localStorage.getItem('news') || '[]';
      
      // Create download link
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(newsData);
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataStr);
      downloadLink.setAttribute('download', `meditour_news_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadLink);
      
      // Click download link
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Show success notification
      showNotification('Данные успешно экспортированы', 'success');
    });
  }
  
  if (importBtn && importFile) {
    importBtn.addEventListener('click', function() {
      importFile.click();
    });
    
    importFile.addEventListener('change', function() {
      const file = this.files[0];
      
      if (file) {
        // Check if file is JSON
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
          showNotification('Пожалуйста, выберите файл JSON', 'error');
          return;
        }
        
        // Read file
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const data = JSON.parse(e.target.result);
            
            // Validate data
            if (!Array.isArray(data)) {
              throw new Error('Некорректный формат данных');
            }
            
            // Save data
            localStorage.setItem('news', JSON.stringify(data));
            
            // Reload news
            loadNews();
            
            // Show success notification
            showNotification('Данные успешно импортированы', 'success');
          } catch (error) {
            showNotification('Ошибка импорта данных: ' + error.message, 'error');
          }
        };
        reader.readAsText(file);
      }
    });
  }
}

/**
* Initialize change password
*/
function initChangePassword() {
  const changePasswordForm = document.getElementById('change-password-form');
  
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Check current password
      if (currentPassword !== 'admin') {
        showNotification('Неверный текущий пароль', 'error');
        return;
      }
      
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
      }
      
      // In a real project, we would save the new password to the server here
      // For demonstration, we'll just show a success message
      
      // Reset form
      changePasswordForm.reset();
      
      // Show success notification
      showNotification('Пароль успешно изменен', 'success');
    });
  }
}

/**
* Load admin data
*/
function loadAdminData() {
  // Load dashboard statistics
  loadDashboardStats();
  
  // Load news
  loadNews();
}

/**
* Load dashboard statistics
*/
function loadDashboardStats() {
  // Get news data
  const newsData = JSON.parse(localStorage.getItem('news') || '[]');
  
  // Total news
  const totalNews = newsData.length;
  document.querySelector('.admin-stat-number').textContent = totalNews;
  
  // Recent news (last month)
  const currentDate = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(currentDate.getMonth() - 1);
  
  const recentNews = newsData.filter(item => new Date(item.date) > lastMonth).length;
  document.querySelectorAll('.admin-stat-number')[1].textContent = recentNews;
  
  // Categories
  const categories = {};
  newsData.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1;
  });
  
  const categoriesCount = Object.keys(categories).length;
  document.querySelectorAll('.admin-stat-number')[2].textContent = categoriesCount;
  
  // Latest news
  const latestNewsContainer = document.getElementById('admin-latest-news');
  
  if (latestNewsContainer) {
    latestNewsContainer.innerHTML = '';
    
    // Sort news by date (newest first)
    const sortedNews = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take only the first 5 news
    const latestNews = sortedNews.slice(0, 5);
    
    if (latestNews.length > 0) {
      latestNews.forEach(news => {
        const newsRow = document.createElement('div');
        newsRow.className = 'admin-news-row';
        
        // Format date
        const date = new Date(news.date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        
        newsRow.innerHTML = `
          <div class="admin-news-date">${formattedDate}</div>
          <div class="admin-news-title">${news.title}</div>
          <div class="admin-news-category">${news.category}</div>
          <div class="admin-news-actions">
            <button class="btn btn-outline btn-sm edit-news-btn" data-id="${news.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline btn-sm delete-news-btn" data-id="${news.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        
        latestNewsContainer.appendChild(newsRow);
      });
    } else {
      latestNewsContainer.innerHTML = '<div class="admin-no-data">Нет данных</div>';
    }
  }
}

/**
* Load news
*/
function loadNews() {
  const newsTableBody = document.getElementById('news-table-body');
  
  if (newsTableBody) {
    // Get news data
    const newsData = JSON.parse(localStorage.getItem('news') || '[]');
    
    // Sort news by date (newest first)
    const sortedNews = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear table
    newsTableBody.innerHTML = '';
    
    if (sortedNews.length > 0) {
      sortedNews.forEach(news => {
        const row = document.createElement('tr');
        row.setAttribute('data-date', news.date);
        
        // Format date
        const date = new Date(news.date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        
        row.innerHTML = `
          <td>${news.id}</td>
          <td><img src="${news.image}" alt="${news.title}" class="admin-table-img"></td>
          <td class="news-title">${news.title}</td>
          <td class="news-category">${news.category}</td>
          <td>${formattedDate}</td>
          <td>
            <div class="admin-table-actions">
              <button class="btn btn-outline btn-sm edit-news-btn" data-id="${news.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-outline btn-sm delete-news-btn" data-id="${news.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        
        newsTableBody.appendChild(row);
      });
    } else {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="6" class="text-center">Нет данных</td>';
      newsTableBody.appendChild(emptyRow);
    }
    
    // Initialize edit buttons
    initEditButtons();
    
    // Update pagination
    updatePagination();
    
    // Update dashboard stats
    loadDashboardStats();
  }
}

/**
* Initialize edit buttons
*/
function initEditButtons() {
  const editButtons = document.querySelectorAll('.edit-news-btn');
  const newsFormModal = document.getElementById('news-form-modal');
  
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const newsId = this.getAttribute('data-id');
      
      // Get news data
      const newsData = JSON.parse(localStorage.getItem('news') || '[]');
      const newsItem = newsData.find(item => item.id === newsId);
      
      if (newsItem) {
        // Set form values
        document.getElementById('news-id').value = newsItem.id;
        document.getElementById('news-title').value = newsItem.title;
        document.getElementById('news-category').value = newsItem.category;
        document.getElementById('news-date').value = newsItem.date;
        document.getElementById('news-preview').value = newsItem.preview;
        document.getElementById('news-content').value = newsItem.content;
        document.getElementById('preview-image').src = newsItem.image;
        
        // Update form title
        document.getElementById('news-form-title').textContent = 'Редактировать новость';
        
        // Show modal
        newsFormModal.classList.add('show');
      }
    });
  });
}

/**
* Update pagination
*/
function updatePagination() {
  const newsTableBody = document.getElementById('news-table-body');
  const paginationContainer = document.getElementById('admin-news-pagination');
  
  if (newsTableBody && paginationContainer) {
    const newsRows = newsTableBody.querySelectorAll('tr:not(.hidden)');
    const rowsPerPage = 10;
    const totalPages = Math.ceil(newsRows.length / rowsPerPage);
    
    // Clear pagination
    paginationContainer.innerHTML = '';
    
    // Create pagination buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = `admin-pagination-btn${i === 1 ? ' active' : ''}`;
      pageButton.textContent = i;
      
      pageButton.addEventListener('click', function() {
        // Remove active class from all buttons
        paginationContainer.querySelectorAll('.admin-pagination-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Show current page
        showPage(i, rowsPerPage);
      });
      
      paginationContainer.appendChild(pageButton);
    }
    
    // Show first page
    showPage(1, rowsPerPage);
  }
}

/**
* Show page
* @param {number} page - Page number
* @param {number} rowsPerPage - Rows per page
*/
function showPage(page, rowsPerPage) {
  const newsTableBody = document.getElementById('news-table-body');
  const newsRows = newsTableBody.querySelectorAll('tr:not(.hidden)');
  
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  
  newsRows.forEach((row, index) => {
    if (index >= startIndex && index < endIndex) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// Export functions
export {
  initAdmin,
  loadNews,
  loadDashboardStats
};