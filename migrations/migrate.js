const db = require('../config/database');

const createTables = async () => {
  try {
    // Create nominations table
    const createNominationsTable = `
      CREATE TABLE IF NOT EXISTS nominations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        course VARCHAR(255) NOT NULL,
        phone_no VARCHAR(20) NOT NULL,
        domain VARCHAR(100) NOT NULL CHECK (
          domain IN (
            'Sponsorship & Marketing',
            'Social Media Team',
            'UI/UX',
            'App Dev',
            'Web Dev',
            'Cybersecurity Team'
          )
        ),
        email VARCHAR(255) NOT NULL UNIQUE,
        insta_id VARCHAR(255),
        github_id VARCHAR(255),
        gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes for better performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_nominations_email ON nominations(email);
      CREATE INDEX IF NOT EXISTS idx_nominations_domain ON nominations(domain);
      CREATE INDEX IF NOT EXISTS idx_nominations_created_at ON nominations(created_at);
    `;

    // Create trigger for updated_at
    const createUpdateTrigger = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_nominations_updated_at ON nominations;
      CREATE TRIGGER update_nominations_updated_at
          BEFORE UPDATE ON nominations
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `;

    await db.query(createNominationsTable);
    await db.query(createIndexes);
    await db.query(createUpdateTrigger);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const dropTables = async () => {
  try {
    await db.query('DROP TABLE IF EXISTS nominations CASCADE;');
    console.log('Tables dropped successfully!');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
};

module.exports = {
  createTables,
  dropTables
};
