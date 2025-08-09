// API Configuration
// Use the current domain for API calls (works for both local and hosted)
const API_BASE_URL = window.location.origin + '/api';

// DOM Elements
const nominationForm = document.getElementById('nominationForm');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const toast = document.getElementById('toast');
const statsGrid = document.getElementById('statsGrid');
const nominationsList = document.getElementById('nominationsList');
const pagination = document.getElementById('pagination');
const domainFilter = document.getElementById('domainFilter');
const refreshBtn = document.getElementById('refreshBtn');

// State
let currentPage = 1;
let currentFilter = '';
let isLoading = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadDomains();
    loadStats();
    loadNominations();
    
    // Add form submit handler
    nominationForm.addEventListener('submit', handleFormSubmit);
    
    // Add filter handler
    domainFilter.addEventListener('change', handleFilterChange);
    
    // Add refresh handler
    refreshBtn.addEventListener('click', () => {
        loadNominations(currentPage, currentFilter);
        loadStats();
    });
});

// Navigation
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load data for specific sections
        if (sectionId === 'stats') {
            loadStats();
        } else if (sectionId === 'nominations') {
            loadNominations();
        }
    }
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Form Handling
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const formData = new FormData(nominationForm);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    setFormLoading(true);
    
    try {
        const response = await apiRequest('/nominations', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        showToast('success', response.message);
        resetForm();
        
        // Refresh data
        loadStats();
        if (document.getElementById('nominations').classList.contains('active')) {
            loadNominations();
        }
        
    } catch (error) {
        showToast('error', error.message);
    } finally {
        setFormLoading(false);
    }
}

function validateForm(data) {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
    });
    
    // Validate required fields
    const requiredFields = ['name', 'course', 'phone_no', 'email', 'domain', 'gender'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (data.phone_no && !isValidPhone(data.phone_no)) {
        showFieldError('phone', 'Please enter a valid phone number (10-15 digits)');
        isValid = false;
    }
    
    // Validate name length
    if (data.name && (data.name.length < 2 || data.name.length > 255)) {
        showFieldError('name', 'Name must be between 2 and 255 characters');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = message;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function setFormLoading(loading) {
    isLoading = loading;
    const submitBtn = document.querySelector('.submit-btn');
    
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function resetForm() {
    nominationForm.reset();
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
    });
}

// Load Domains
async function loadDomains() {
    try {
        const response = await apiRequest('/nominations/domains');
        const domains = response.data;
        
        // Populate domain filter
        domainFilter.innerHTML = '<option value="">All Domains</option>';
        domains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            domainFilter.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading domains:', error);
    }
}

// Load Statistics
async function loadStats() {
    try {
        statsGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
        
        const response = await apiRequest('/nominations/stats');
        const stats = response.data;
        
        const statsHTML = `
            <div class="stat-card">
                <h3>${stats.total_nominations}</h3>
                <p>Total Nominations</p>
            </div>
            <div class="stat-card">
                <h3>${stats.sponsorship_marketing}</h3>
                <p>Sponsorship & Marketing</p>
            </div>
            <div class="stat-card">
                <h3>${stats.social_media}</h3>
                <p>Social Media Team</p>
            </div>
            <div class="stat-card">
                <h3>${stats.ui_ux}</h3>
                <p>UI/UX</p>
            </div>
            <div class="stat-card">
                <h3>${stats.app_dev}</h3>
                <p>App Development</p>
            </div>
            <div class="stat-card">
                <h3>${stats.web_dev}</h3>
                <p>Web Development</p>
            </div>
            <div class="stat-card">
                <h3>${stats.cybersecurity}</h3>
                <p>Cybersecurity Team</p>
            </div>
            <div class="stat-card">
                <h3>${stats.male_count}</h3>
                <p>Male</p>
            </div>
            <div class="stat-card">
                <h3>${stats.female_count}</h3>
                <p>Female</p>
            </div>
            <div class="stat-card">
                <h3>${stats.others_count}</h3>
                <p>Others</p>
            </div>
        `;
        
        statsGrid.innerHTML = statsHTML;
        
    } catch (error) {
        console.error('Error loading stats:', error);
        statsGrid.innerHTML = '<p>Error loading statistics</p>';
    }
}

// Load Nominations
async function loadNominations(page = 1, domainFilter = '') {
    try {
        nominationsList.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
        
        let endpoint = `/nominations?page=${page}&limit=10`;
        if (domainFilter) {
            endpoint = `/nominations/domain/${encodeURIComponent(domainFilter)}?page=${page}&limit=10`;
        }
        
        const response = await apiRequest(endpoint);
        const { nominations, pagination: paginationData } = response.data;
        
        if (nominations.length === 0) {
            nominationsList.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.1rem; padding: 2rem;">No nominations found</p>';
            pagination.innerHTML = '';
            return;
        }
        
        // Render nominations
        const nominationsHTML = nominations.map(nomination => `
            <div class="nomination-card">
                <div class="nomination-header">
                    <div class="nomination-name">${escapeHtml(nomination.name)}</div>
                    <div class="nomination-domain">${escapeHtml(nomination.domain)}</div>
                </div>
                <div class="nomination-details">
                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${escapeHtml(nomination.course)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <span>${escapeHtml(nomination.email)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${escapeHtml(nomination.phone_no)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-venus-mars"></i>
                        <span>${escapeHtml(nomination.gender)}</span>
                    </div>
                    ${nomination.insta_id ? `
                        <div class="detail-item">
                            <i class="fab fa-instagram"></i>
                            <span>${escapeHtml(nomination.insta_id)}</span>
                        </div>
                    ` : ''}
                    ${nomination.github_id ? `
                        <div class="detail-item">
                            <i class="fab fa-github"></i>
                            <span>${escapeHtml(nomination.github_id)}</span>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(nomination.created_at)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        nominationsList.innerHTML = nominationsHTML;
        
        // Render pagination
        renderPagination(paginationData);
        
    } catch (error) {
        console.error('Error loading nominations:', error);
        nominationsList.innerHTML = '<p style="text-align: center; color: #e74c3c;">Error loading nominations</p>';
    }
}

// Pagination
function renderPagination(paginationData) {
    const { currentPage, totalPages, hasNextPage, hasPrevPage } = paginationData;
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${!hasPrevPage ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${!hasNextPage ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadNominations(page, currentFilter);
}

// Filter handling
function handleFilterChange(e) {
    currentFilter = e.target.value;
    currentPage = 1;
    loadNominations(1, currentFilter);
}

// Toast Notifications
function showToast(type, message) {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon and class based on type
    toast.className = `toast ${type}`;
    
    if (type === 'success') {
        toastIcon.className = 'toast-icon fas fa-check-circle';
    } else if (type === 'error') {
        toastIcon.className = 'toast-icon fas fa-exclamation-circle';
    }
    
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Handle form input improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add input event listeners for real-time validation feedback
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                const formGroup = input.closest('.form-group');
                formGroup.classList.remove('error');
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) errorMsg.textContent = '';
            }
        });
    });
    
    // Format phone number input
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        // Remove all non-numeric characters except +
        let value = e.target.value.replace(/[^\d+]/g, '');
        e.target.value = value;
    });
    
    // Auto-format Instagram handle
    const instaInput = document.getElementById('instagram');
    instaInput.addEventListener('input', (e) => {
        let value = e.target.value;
        if (value && !value.startsWith('@')) {
            value = '@' + value.replace('@', '');
        }
        e.target.value = value;
    });
});
