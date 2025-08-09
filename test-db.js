const db = require('./config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    
    // Try to create the database tables
    console.log('\nCreating database tables...');
    const { createTables } = require('./migrations/migrate');
    await createTables();
    
    console.log('\n🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running: sudo systemctl start postgresql');
    console.log('2. Check if database exists: psql -l');
    console.log('3. Create database if needed: createdb compass_nominations');
    console.log('4. Update .env file with correct database credentials');
    
    process.exit(1);
  }
}

testConnection();
