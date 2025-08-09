const axios = require('axios');

const HOSTED_URL = 'https://compass-backend-production-e15e.up.railway.app';

async function testHostedAPI() {
    console.log('🧪 Testing hosted API at:', HOSTED_URL);
    console.log('');

    try {
        // Test health endpoint
        console.log('Testing health endpoint...');
        const healthResponse = await axios.get(`${HOSTED_URL}/health`);
        console.log('✅ Health check:', healthResponse.data.message);
        console.log('');

        // Test domains endpoint
        console.log('Testing domains endpoint...');
        const domainsResponse = await axios.get(`${HOSTED_URL}/api/nominations/domains`);
        console.log('✅ Domains:', domainsResponse.data.data.length, 'domains available');
        console.log('');

        // Test stats endpoint
        console.log('Testing stats endpoint...');
        const statsResponse = await axios.get(`${HOSTED_URL}/api/nominations/stats`);
        console.log('✅ Stats:', JSON.stringify(statsResponse.data.data, null, 2));
        console.log('');

        // Test create nomination (optional - comment out if you don't want to create test data)
        console.log('Testing create nomination...');
        const testNomination = {
            name: "Test User from Hosted API",
            course: "Computer Science",
            phone_no: "9999999999",
            domain: "Web Dev",
            email: `test.hosted.${Date.now()}@example.com`,
            insta_id: "@testuser",
            github_id: "testuser",
            gender: "Male"
        };

        const createResponse = await axios.post(`${HOSTED_URL}/api/nominations`, testNomination);
        console.log('✅ Create nomination:', createResponse.data.message);
        console.log('   Created ID:', createResponse.data.data.id);
        
        console.log('');
        console.log('🎉 All hosted API tests passed!');
        console.log('Your frontend should now work correctly.');

    } catch (error) {
        console.error('❌ API test failed:');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Message:', error.response.data?.message || error.response.statusText);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('   Error:', error.message);
        }
        
        console.log('');
        console.log('🔧 Troubleshooting suggestions:');
        console.log('1. Check if Railway deployment is successful');
        console.log('2. Verify environment variables are set correctly in Railway');
        console.log('3. Check Railway logs for any errors');
        console.log('4. Ensure database connection is working');
    }
}

testHostedAPI();
