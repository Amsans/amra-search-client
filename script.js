// Configuration
const API_BASE_URL = 'https://amsan.duckdns.org';
const RESULTS_PER_PAGE = 10;

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchStats = document.getElementById('search-stats');
const searchResults = document.getElementById('search-results');
const pagination = document.getElementById('pagination');
const loading = document.getElementById('loading');
const themeToggle = document.getElementById('theme-toggle');

// State
let currentSearchTerm = '';
let currentOffset = 0;
let totalHits = 0;
let currentResults = [];

// Theme Management
function setTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️'; // Sun emoji for dark mode
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙'; // Moon emoji for light mode
    }
    localStorage.setItem('darkTheme', isDark);
}

function toggleTheme() {
    // Check the current theme and toggle it
    const isDark = document.documentElement.hasAttribute('data-theme');
    setTheme(!isDark);
}

function initTheme() {
    // Set the dark theme as default
    const savedTheme = localStorage.getItem('darkTheme');
    const isDark = savedTheme !== null ? savedTheme === 'true' : true;
    setTheme(isDark);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    searchForm.addEventListener('submit', handleSearch);
    themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    searchInput.addEventListener('invalid', function() {
        if (!this.value.trim()) {
            this.setCustomValidity('Пожалуйста, введите текст для поиска');
        }
    });

    // Reset custom validity when a user starts typing
    searchInput.addEventListener('input', function() {
        this.setCustomValidity('');
    });
});

// Functions
async function handleSearch(event) {
    event.preventDefault();

    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;

    currentSearchTerm = searchTerm;
    currentOffset = 0;

    await fetchResults();
}

async function fetchResults() {
    try {
        showLoading();

        // Encode the search term for URL
        const encodedSearchTerm = encodeURIComponent(currentSearchTerm);

        // Construct the API URL
        const apiUrl = `${API_BASE_URL}/search?term=${encodedSearchTerm}&offset=${currentOffset}`;

        // Fetch data from API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Process and display results
        processResults(data);
    } catch (error) {
        console.error('Error fetching search results:', error);
        searchResults.innerHTML = `
            <div class="error-message">
                <p>❌Во время поиска произошла ошибка. Пожалуйста, попробуйте позже.</p>
                <p>Детали ошибки: ${error.stack}</p>
            </div>
        `;
        searchStats.textContent = '';
        pagination.innerHTML = '';
    } finally {
        hideLoading();
    }
}

function processResults(data) {
    // Extract data from the response
    const { hits } = data;

    // Update state
    // Handle both formats: hits.total as a number or as an object with a value property
    totalHits = typeof hits.total === 'object' ? hits.total.value : hits.total;
    currentResults = hits.hits;

    // Display search stats
    displaySearchStats(totalHits);

    // Display search results
    displaySearchResults(currentResults);

    // Update pagination
    updatePagination();
}

function displaySearchStats(total) {
    searchStats.textContent = `Найдено ${total} результатов.`;
}

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">Результаты не найдены. Попробуйте другие слова или части слов.</div>';
        return;
    }

    searchResults.innerHTML = results.map(result => {
        const { _source, highlight } = result;
        const { book, author, miteuma, enon, url } = _source;

        // Create highlights HTML
        const highlightsHtml = highlight.text
            ? highlight.text.map(text => `<div class="highlight-item">${text}</div>`).join('')
            : '';

        return `
            <div class="result-card">
                <div class="result-header">
                    <h2 class="result-title"><a href="${url}" target="_blank" class="result-link">${miteuma}</a></h2>
                    <div class="result-meta">
                        <span class="result-author">${author}</span>
                        <span class="result-book">Книга ${book}</span>
                        <span class="result-enon">Энон ${enon}</span>
                    </div>
                </div>
                <div class="result-highlights">
                    ${highlightsHtml}
                </div>
            </div>
        `;
    }).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(totalHits / RESULTS_PER_PAGE);
    const currentPage = Math.floor(currentOffset / RESULTS_PER_PAGE) + 1;

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHtml = '';

    // Previous button
    paginationHtml += `
        <button class="pagination-button ${currentPage === 1 ? 'disabled' : ''}" 
                ${currentPage === 1 ? 'disabled' : `onclick="changePage(${currentPage - 1})"`}>
            Назад
        </button>
    `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHtml += `
            <button class="pagination-button" onclick="changePage(1)">1</button>
            ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <button class="pagination-button ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        paginationHtml += `
            ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
            <button class="pagination-button" onclick="changePage(${totalPages})">
                ${totalPages}
            </button>
        `;
    }

    // Next button
    paginationHtml += `
        <button class="pagination-button ${currentPage === totalPages ? 'disabled' : ''}" 
                ${currentPage === totalPages ? 'disabled' : `onclick="changePage(${currentPage + 1})"`}>
            Вперёд
        </button>
    `;

    pagination.innerHTML = paginationHtml;
}

// This function needs to be global for the onclick handlers in pagination
window.changePage = function(page) {
    currentOffset = (page - 1) * RESULTS_PER_PAGE;
    fetchResults().then(() => {});

    // Scroll back to the top of results
    searchResults.scrollIntoView({ behavior: 'smooth' });
};

function showLoading() {
    loading.style.display = 'flex';
    searchButton.disabled = true;
}

function hideLoading() {
    loading.style.display = 'none';
    searchButton.disabled = false;
}
