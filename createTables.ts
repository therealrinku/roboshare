const db = require("./db");

const createFilesTable = `
  CREATE TABLE IF NOT EXISTS files (
    sn INTEGER PRIMARY KEY,
    file_id VARCHAR,
    file_location VARCHAR,
    file_name VARCHAR,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE
);
`;

async function createTables() {
  try {
    await db.query(createFilesTable);
    console.log('All the tables created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
  }
}

createTables();
