const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Test data
const testNomination = {
  name: "John Doe",
  course: "Computer Science Engineering",
  phone_no: "9876543210",
  domain: "Web Dev",
  email: "john.doe@example.com",
  insta_id: "johndoe_insta",
  github_id: "johndoe",
  gender: "Male"
};

class APITester {
  static async testHealthCheck() {
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Health check passed:', response.data.message);
      return true;
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return false;
    }
  }

  static async testGetDomains() {
    try {
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
      const response = await axios.post(`${API_URL}/nominations`, testNomination);
      console.log('✅ Create nomination passed:', response.data.message);
      return response.data.data.id;
    } catch (error) {
      console.log('❌ Create nomination failed:', error.response?.data?.message || error.message);
      return null;
    }
  }

  static async testGetNominations() {
    try {
      const response = await axios.get(`${API_URL}/nominations?page=1&limit=5`);
      console.log('✅ Get nominations passed:', response.data.data.pagination.totalItems, 'total nominations');
      return true;
    } catch (error) {
      console.log('❌ Get nominations failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testGetNominationById(id) {
    try {
      const response = await axios.get(`${API_URL}/nominations/${id}`);
      console.log('✅ Get nomination by ID passed:', response.data.data.name);
      return true;
    } catch (error) {
      console.log('❌ Get nomination by ID failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testGetStats() {
    try {
      const response = await axios.get(`${API_URL}/nominations/stats`);
      console.log('✅ Get stats passed:', response.data.data.total_nominations, 'total nominations');
      return true;
    } catch (error) {
      console.log('❌ Get stats failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testGetByDomain() {
    try {
      const response = await axios.get(`${API_URL}/nominations/domain/Web Dev`);
      console.log('✅ Get by domain passed:', response.data.data.nominations.length, 'nominations found');
      return true;
    } catch (error) {
      console.log('❌ Get by domain failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testUpdateNomination(id) {
    try {
      const updateData = { ...testNomination, name: "John Doe Updated" };
      const response = await axios.put(`${API_URL}/nominations/${id}`, updateData);
      console.log('✅ Update nomination passed:', response.data.message);
      return true;
    } catch (error) {
      console.log('❌ Update nomination failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async testDeleteNomination(id) {
    try {
      const response = await axios.delete(`${API_URL}/nominations/${id}`);
      console.log('✅ Delete nomination passed:', response.data.message);
      return true;
    } catch (error) {
      console.log('❌ Delete nomination failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  static async runAllTests() {
    console.log('🧪 Starting API tests...\n');

    // Test health check
    const healthOk = await this.testHealthCheck();
    if (!healthOk) {
      console.log('\n❌ Server is not running. Please start the server first with: npm run dev');
      return;
    }

    console.log('');

    // Test all endpoints
    await this.testGetDomains();
    const nominationId = await this.testCreateNomination();
    await this.testGetNominations();
    await this.testGetStats();
    await this.testGetByDomain();

    if (nominationId) {
      await this.testGetNominationById(nominationId);
      await this.testUpdateNomination(nominationId);
      await this.testDeleteNomination(nominationId);
    }

    console.log('\n🎉 API testing completed!');
  }
}

// Add axios to package.json for testing
const testPackageJson = {
  "axios": "^1.5.0"
};

// Run tests if this file is executed directly
if (require.main === module) {
  APITester.runAllTests().catch(console.error);
}

module.exports = APITester;
