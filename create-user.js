const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a working user account
const createUser = async () => {
  const dbPath = path.join(__dirname, 'backend', 'data', 'chatty_web_architect.db');
  const db = new sqlite3.Database(dbPath);
  
  const email = 'user@test.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.run(`INSERT OR REPLACE INTO users (id, email, name, password_hash, created_at) 
          VALUES (?, ?, ?, ?, ?)`, 
    ['user-123', email, 'Test User', hashedPassword, new Date().toISOString()], 
    function(err) {
      if (err) {
        console.error('❌ Error:', err);
      } else {
        console.log('✅ User created successfully!');
        console.log('📧 Email: user@test.com');
        console.log('🔑 Password: password123');
      }
      db.close();
    });
};

createUser();
