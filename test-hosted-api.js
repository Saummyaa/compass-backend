const axios = require('axios');

const RAILWAY_BASE_URL = 'https://compass-backend-production-e15e.up.railway.app';
const API_URL = `${RAILWAY_BASE_URL}/api`;

// Test data
const testNomination = {
  name: "Railway Test User",
  course: "Computer Science Engineering",
  phone_no: "9876543299",
  domain: "Web Dev",
  email: `test.railway.${Date.now()}@example.com`,
  insta_id: "@railway_test",
  github_id: "railwaytest",
  gender: "Male"
};

class RailwayAPITester {
  static async testHealthCheck() {
    try {
      console.log('🏥 Testing health check...');
      const response = await axios.get(`${RAILWAY_BASE_URL}/health`);
      console.log('✅ Health check passed:', response.data.message);
      return true;
    } catch (error) {
      console.log('❌ Health check failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testGetDomains() {
    try {
      console.log('📝 Testing get domains...');
      const response = await axios.get(`${API_URL}/nominations/domains`);
      console.log('✅ Get domains passed:', response.data.data.length, 'domains found');
      return true;
    } catch (error) {
      console.log('❌ Get domains failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testCreateNomination() {
    try {
      console.log('➕ Testing create nomination...');
      const response = await axios.post(`${API_URL}/nominations`, testNomination);
      console.log('✅ Create nomination passed:', response.data.message);
      console.log('📊 Created nomination ID:', response.data.data.id);
      return response.data.data.id;
    } catch (error) {
      console.log('❌ Create nomination failed:', error.response?.data?.message || error.message);
      if (error.response?.data?.errors) {
        console.log('📋 Validation errors:', error.response.data.errors);
      }
      return null;
    }
  }

  static async testGetNominations() {
    try {
      console.log('📋 Testing get nominations...');
      const response = await axios.get(`${API_URL}/nominations?page=1&limit=5`);
      console.log('✅ Get nominations passed:', response.data.data.pagination.totalItems, 'total nominations');
      return true;
    } catch (error) {
      console.log('❌ Get nominations failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testGetStats() {
    try {
      console.log('📊 Testing get statistics...');
      const response = await axios.get(`${API_URL}/nominations/stats`);
      console.log('✅ Get stats passed - Total nominations:', response.data.data.total_nominations);
      return true;
    } catch (error) {
      console.log('❌ Get stats failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async runAllTests() {
    console.log('🚀 Testing Railway Deployed API...');
    console.log('🌐 Base URL:', RAILWAY_BASE_URL);
    console.log('🔗 API URL:', API_URL);
    console.log('');

    const startTime = Date.now();
    let passed = 0;
    let failed = 0;

    // Test health check first
    const healthOk = await this.testHealthCheck();
    if (!healthOk) {
      console.log('\n❌ Server health check failed. Deployment might be down or starting up.');
      console.log('💡 Wait a few minutes and try again if Railway is still deploying.');
      return;
    }
    passed++;

    console.log('');

    // Test all endpoints
    if (await this.testGetDomains()) passed++; else failed++;
    if (await this.testGetStats()) passed++; else failed++;
    if (await this.testGetNominations()) passed++; else failed++;
    
    const nominationId = await this.testCreateNomination();
    if (nominationId) passed++; else failed++;

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(50));
    console.log('🎯 Railway API Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Duration: ${duration} seconds`);
    
    if (failed === 0) {
      console.log('🎉 All tests passed! Your Railway deployment is working correctly.');
      console.log('🌐 Your frontend should now work at:', RAILWAY_BASE_URL);
    } else {
      console.log('⚠️  Some tests failed. Check the Railway logs for more details.');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  RailwayAPITester.runAllTests().catch(console.error);
}

module.exports = RailwayAPITester;
