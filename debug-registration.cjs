const { query, initializeDatabase } = require('./src/config/sqlite-database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function debugRegistration() {
    try {
        console.log('🔍 Debug Registration Process...\n');
        
        console.log('0. Initializing database...');
        await initializeDatabase();
        console.log('   ✅ Database initialized\n');
        
        // Test data
        const email = 'debug-user-' + Date.now() + '@test.com';
        const password = 'password123';
        const fullName = 'Debug Test User';
        
        console.log('1. Testing user check...');
        const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
        console.log('   Existing user check result:', existingUser);
        
        if (existingUser.rows.length > 0) {
            console.log('   ❌ User already exists');
            return;
        }
        
        console.log('2. Testing password hashing...');
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        console.log('   ✅ Password hashed successfully');
        
        console.log('3. Testing UUID generation...');
        const userId = uuidv4();
        console.log('   Generated UUID:', userId);
        
        console.log('4. Testing user insertion...');
        const userResult = await query(
            'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
            [userId, email, passwordHash, fullName]
        );
        console.log('   User insertion result:', userResult);
        
        console.log('5. Testing subscriber insertion...');
        const subscriberResult = await query(
            'INSERT INTO subscribers (id, subscription_type, status) VALUES (?, ?, ?)',
            [userId, 'premium', 1]
        );
        console.log('   Subscriber insertion result:', subscriberResult);
        
        console.log('\n✅ Registration process completed successfully!');
        console.log('Created user:', { id: userId, email, fullName });
        
    } catch (error) {
        console.error('❌ Error during registration debug:', error);
        console.error('Error details:', error.message);
        console.error('Stack:', error.stack);
    }
}

debugRegistration();
