const { query, initializeDatabase } = require('./src/config/sqlite-database');

async function checkSchema() {
    try {
        await initializeDatabase();
        
        console.log('🔍 Checking subscribers table schema...\n');
        
        // Check table schema using PRAGMA
        const result = await query("SELECT sql FROM sqlite_master WHERE type='table' AND name='subscribers'");
        console.log('Subscribers table schema:');
        console.log(result.rows[0].sql);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

checkSchema();
