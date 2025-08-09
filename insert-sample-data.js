const axios = require('axios');

// Use environment variable or default to localhost
const API_BASE_URL = (process.env.API_URL || 'http://localhost:3000') + '/api';

// Sample nomination data
const sampleNominations = [
    {
        name: "Alice Johnson",
        course: "Computer Science Engineering",
        phone_no: "9876543210",
        domain: "Web Dev",
        email: "alice.johnson@example.com",
        insta_id: "@alice_codes",
        github_id: "alicejohnson",
        gender: "Female"
    },
    {
        name: "Bob Smith",
        course: "Information Technology",
        phone_no: "9876543211",
        domain: "App Dev",
        email: "bob.smith@example.com",
        insta_id: "@bob_apps",
        github_id: "bobsmith",
        gender: "Male"
    },
    {
        name: "Carol Davis",
        course: "Cyber Security",
        phone_no: "9876543212",
        domain: "Cybersecurity Team",
        email: "carol.davis@example.com",
        insta_id: "@carol_sec",
        github_id: "caroldavis",
        gender: "Female"
    },
    {
        name: "David Wilson",
        course: "Computer Applications",
        phone_no: "9876543213",
        domain: "UI/UX",
        email: "david.wilson@example.com",
        insta_id: "@david_design",
        github_id: "davidwilson",
        gender: "Male"
    },
    {
        name: "Eva Martinez",
        course: "Business Administration",
        phone_no: "9876543214",
        domain: "Sponsorship & Marketing",
        email: "eva.martinez@example.com",
        insta_id: "@eva_marketing",
        github_id: "evamartinez",
        gender: "Female"
    },
    {
        name: "Frank Brown",
        course: "Mass Communication",
        phone_no: "9876543215",
        domain: "Social Media Team",
        email: "frank.brown@example.com",
        insta_id: "@frank_social",
        github_id: "frankbrown",
        gender: "Male"
    },
    {
        name: "Grace Lee",
        course: "Computer Science",
        phone_no: "9876543216",
        domain: "App Dev",
        email: "grace.lee@example.com",
        insta_id: "@grace_mobile",
        github_id: "gracelee",
        gender: "Female"
    },
    {
        name: "Henry Taylor",
        course: "Software Engineering",
        phone_no: "9876543217",
        domain: "Web Dev",
        email: "henry.taylor@example.com",
        insta_id: "@henry_web",
        github_id: "henrytaylor",
        gender: "Male"
    },
    {
        name: "Ivy Chen",
        course: "Graphic Design",
        phone_no: "9876543218",
        domain: "UI/UX",
        email: "ivy.chen@example.com",
        insta_id: "@ivy_design",
        github_id: "ivychen",
        gender: "Others"
    },
    {
        name: "Jack Anderson",
        course: "Information Security",
        phone_no: "9876543219",
        domain: "Cybersecurity Team",
        email: "jack.anderson@example.com",
        insta_id: "@jack_security",
        github_id: "jackanderson",
        gender: "Male"
    }
];

async function insertSampleData() {
    console.log('🚀 Inserting sample nomination data...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const nomination of sampleNominations) {
        try {
            const response = await axios.post(`${API_BASE_URL}/nominations`, nomination);
            console.log(`✅ Added: ${nomination.name} - ${nomination.domain}`);
            successCount++;
        } catch (error) {
            console.log(`❌ Failed to add ${nomination.name}: ${error.response?.data?.message || error.message}`);
            errorCount++;
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Successfully added: ${successCount} nominations`);
    console.log(`❌ Failed to add: ${errorCount} nominations`);
    
    if (successCount > 0) {
        console.log('\n🎉 Sample data inserted successfully!');
        console.log('You can now view the nominations at: http://localhost:3000');
    }
}

// Check if server is running first
async function checkServer() {
    try {
        await axios.get('http://localhost:3000/health');
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('❌ Server is not running. Please start the server first:');
        console.log('   npm run dev');
        process.exit(1);
    }
    
    await insertSampleData();
}

main().catch(console.error);
