/**
 * JavaScript file for handling news functionality on MediTour Website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize news components
  initNewsFilter();
  initNewsPagination();
  initNewsSearch();
  loadLatestNews();
});

/**
* Load and display latest news on the homepage
*/
function loadLatestNews() {
  const latestNewsContainer = document.getElementById('latest-news-container');
  
  if (latestNewsContainer) {
      // Fetch news data from JSON file
      fetch('data/news.json')
          .then(response => response.json())
          .then(newsData => {
              // Sort news by date (newest first)
              newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
              
              // Take only the first 3 news items
              const latestNews = newsData.slice(0, 3);
              
              // Clear the container
              latestNewsContainer.innerHTML = '';
              
              // Create HTML for each news item
              latestNews.forEach((newsItem, index) => {
                  const newsElement = createNewsElement(newsItem, index);
                  latestNewsContainer.appendChild(newsElement);
              });
          })
          .catch(error => {
              console.error('Error loading news:', error);
              latestNewsContainer.innerHTML = '<div class="alert alert-error">Ошибка загрузки новостей</div>';
          });
  }
}

/**
* Create HTML element for a news item
* @param {Object} newsItem - News item data
* @param {Number} index - Index for delay effect
* @returns {HTMLElement} News item element
*/
function createNewsElement(newsItem, index) {
  const newsElement = document.createElement('div');
  newsElement.className = `news-item fade-in${index > 0 ? ' delay-' + index : ''}`;
  
  newsElement.innerHTML = `
      <div class="news-image-container">
          <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image">
          <div class="news-category">${newsItem.category}</div>
      </div>
      <div class="news-content">
          <div class="news-date">${formatDate(newsItem.date)}</div>
          <h3 class="news-title">${newsItem.title}</h3>
          <p class="news-text">${newsItem.preview}</p>
          <a href="news-detail.html?id=${newsItem.id}" class="news-link">Читать далее <i class="fas fa-arrow-right"></i></a>
      </div>
  `;
  
  return newsElement;
}

/**
* Format date to localized string
* @param {string} dateString - Date string
* @returns {string} Formatted date
*/
function formatDate(dateString) {
  const date = new Date(dateString);
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(getCurrentLanguage(), options);
}

/**
* Get current language from localStorage or default to 'ru'
* @returns {string} Language code
*/
function getCurrentLanguage() {
  return localStorage.getItem('selectedLanguage') || 'ru';
}

/**
* Initialize news filter
*/
function initNewsFilter() {
  const filterButtons = document.querySelectorAll('.news-filter-btn');
  const newsContainer = document.getElementById('news-container');
  
  if (filterButtons.length && newsContainer) {
      filterButtons.forEach(button => {
          button.addEventListener('click', function() {
              // Remove active class from all buttons
              filterButtons.forEach(btn => btn.classList.remove('active'));
              
              // Add active class to clicked button
              this.classList.add('active');
              
              // Get selected category
              const category = this.getAttribute('data-category');
              
              // Filter news
              filterNewsByCategory(category);
          });
      });
  }
}

/**
* Filter news by category
* @param {string} category - Category to filter by
*/
function filterNewsByCategory(category) {
  const newsItems = document.querySelectorAll('.news-item');
  
  newsItems.forEach(item => {
      const itemCategory = item.querySelector('.news-category').textContent;
      
      if (category === 'all' || itemCategory === category) {
          item.style.display = 'block';
      } else {
          item.style.display = 'none';
      }
  });
  
  // Update pagination after filtering
  updatePagination();
}

/**
* Initialize news pagination
*/
function initNewsPagination() {
  const paginationButtons = document.querySelectorAll('.pagination-btn');
  const itemsPerPage = 6; // Number of news items per page
  
  if (paginationButtons.length) {
      paginationButtons.forEach(button => {
          button.addEventListener('click', function() {
              if (!this.classList.contains('pagination-next')) {
                  // Remove active class from all buttons
                  paginationButtons.forEach(btn => btn.classList.remove('active'));
                  
                  // Add active class to clicked button
                  this.classList.add('active');
                  
                  // Get page number
                  const page = parseInt(this.textContent);
                  
                  // Display corresponding page
                  displayNewsPage(page, itemsPerPage);
              } else {
                  // Handle next button
                  const activePage = document.querySelector('.pagination-btn.active');
                  if (activePage) {
                      const nextPage = parseInt(activePage.textContent) + 1;
                      const pageButton = document.querySelector(`.pagination-btn:not(.pagination-next):nth-child(${nextPage})`);
                      
                      if (pageButton) {
                          pageButton.click();
                      }
                  }
              }
          });
      });
      
      // Initialize first page
      displayNewsPage(1, itemsPerPage);
  }
}

/**
* Display news page
* @param {number} page - Page number
* @param {number} itemsPerPage - Number of items per page
*/
function displayNewsPage(page, itemsPerPage) {
  const newsItems = document.querySelectorAll('.news-item:not([style*="display: none"])');
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  newsItems.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
          item.style.display = 'block';
      } else {
          item.style.display = 'none';
      }
  });
}

/**
* Update pagination based on filtered items
*/
function updatePagination() {
  const newsItems = document.querySelectorAll('.news-item:not([style*="display: none"])');
  const itemsPerPage = 6;
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  
  const pagination = document.querySelector('.pagination');
  
  if (pagination) {
      // Clear pagination
      pagination.innerHTML = '';
      
      // Add page buttons
      for (let i = 1; i <= totalPages; i++) {
          const pageButton = document.createElement('button');
          pageButton.className = `pagination-btn${i === 1 ? ' active' : ''}`;
          pageButton.textContent = i;
          
          pageButton.addEventListener('click', function() {
              // Remove active class from all buttons
              const paginationButtons = document.querySelectorAll('.pagination-btn');
              paginationButtons.forEach(btn => btn.classList.remove('active'));
              
              // Add active class to clicked button
              this.classList.add('active');
              
              // Display corresponding page
              displayNewsPage(i, itemsPerPage);
          });
          
          pagination.appendChild(pageButton);
      }
      
      // Add next button if needed
      if (totalPages > 1) {
          const nextButton = document.createElement('button');
          nextButton.className = 'pagination-btn pagination-next';
          nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
          
          nextButton.addEventListener('click', function() {
              const activePage = document.querySelector('.pagination-btn.active');
              if (activePage && parseInt(activePage.textContent) < totalPages) {
                  const nextPage = parseInt(activePage.textContent) + 1;
                  document.querySelector(`.pagination-btn:nth-child(${nextPage})`).click();
              }
          });
          
          pagination.appendChild(nextButton);
      }
      
      // Display first page
      displayNewsPage(1, itemsPerPage);
  }
}

/**
* Initialize news search
*/
function initNewsSearch() {
  const searchForm = document.getElementById('news-search-form');
  const searchInput = document.querySelector('.search-input');
  const resetSearchBtn = document.getElementById('reset-search-btn');
  const searchResultsInfo = document.getElementById('search-results-info');
  
  if (searchForm && searchInput) {
      searchForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const searchQuery = searchInput.value.trim().toLowerCase();
          
          if (searchQuery !== '') {
              searchNews(searchQuery);
              
              if (resetSearchBtn) {
                  resetSearchBtn.classList.remove('hidden');
              }
          }
      });
      
      if (resetSearchBtn) {
          resetSearchBtn.addEventListener('click', function() {
              searchInput.value = '';
              resetSearch();
              this.classList.add('hidden');
              
              if (searchResultsInfo) {
                  searchResultsInfo.classList.add('hidden');
              }
          });
      }
  }
}

/**
* Search news by query
* @param {string} query - Search query
*/
function searchNews(query) {
  const newsItems = document.querySelectorAll('.news-item');
  let matchCount = 0;
  
  newsItems.forEach(item => {
      const title = item.querySelector('.news-title').textContent.toLowerCase();
      const text = item.querySelector('.news-text').textContent.toLowerCase();
      const category = item.querySelector('.news-category').textContent.toLowerCase();
      
      if (title.includes(query) || text.includes(query) || category.includes(query)) {
          item.style.display = 'block';
          matchCount++;
      } else {
          item.style.display = 'none';
      }
  });
  
  // Update search results info
  const searchResultsInfo = document.getElementById('search-results-info');
  const searchCount = document.getElementById('search-count');
  
  if (searchResultsInfo && searchCount) {
      searchCount.textContent = matchCount;
      searchResultsInfo.classList.remove('hidden');
  }
  
  // Update pagination
  updatePagination();
}

/**
* Reset search and show all news
*/
function resetSearch() {
  const newsItems = document.querySelectorAll('.news-item');
  
  newsItems.forEach(item => {
      item.style.display = 'block';
  });
  
  // Reset category filter
  document.querySelector('.news-filter-btn[data-category="all"]').click();
}

// Export functions for use in other files
export {
  loadLatestNews,
  createNewsElement,
  formatDate,
  getCurrentLanguage,
  initNewsFilter,
  initNewsPagination,
  initNewsSearch
};