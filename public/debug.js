// Debug script to test API configuration
console.log('🔍 API Configuration Debug');
console.log('Current URL:', window.location.href);
console.log('Hostname:', window.location.hostname);
console.log('Protocol:', window.location.protocol);
console.log('Host:', window.location.host);

// Show what API_BASE_URL would be
const API_BASE_URL = (() => {
    if (window.location.hostname.includes('railway.app')) {
        return `${window.location.protocol}//${window.location.host}/api`;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    return `${window.location.protocol}//${window.location.host}/api`;
})();

console.log('API_BASE_URL:', API_BASE_URL);

// Test API connection
async function testAPI() {
    try {
        console.log('Testing API connection...');
        const response = await fetch(`${API_BASE_URL}/nominations/domains`);
        const data = await response.json();
        console.log('✅ API Response:', data);
    } catch (error) {
        console.error('❌ API Error:', error);
    }
}

// Run test when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testAPI);
} else {
    testAPI();
}
