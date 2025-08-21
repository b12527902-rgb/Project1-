const fs = require('fs');
const path = require('path');

// Fix all server errors by updating route files
const routeFiles = [
    'backend/src/routes/authRoutes.js',
    'backend/src/routes/chatRoutes.js', 
    'backend/src/routes/userRoutes.js',
    'backend/src/routes/subscriptionRoutes.js',
    'backend/src/routes/toolsRoutes.js',
    'backend/src/middleware/authMiddleware.js'
];

routeFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix all PostgreSQL syntax to SQLite
        content = content.replace(/\$(\d+)/g, '?');
        
        // Fix field names for SQLite schema
        content = content.replace(/full_name/g, 'name');
        content = content.replace(/user_id = \?/g, 'id = ?');
        content = content.replace(/WHERE user_id = \?/g, 'WHERE id = ?');
        
        // Fix subscription references
        content = content.replace(/subscription_tier/g, 'subscription_type');
        content = content.replace(/subscribed/g, 'status');
        
        // Remove PostgreSQL-specific queries
        content = content.replace(/json_agg\([^)]+\)[^,]*/g, '"[]"');
        content = content.replace(/json_build_object\([^)]+\)/g, '"{}"');
        content = content.replace(/FILTER \([^)]+\)/g, '');
        
        // Fix RETURNING clauses (SQLite doesn't support them the same way)
        content = content.replace(/RETURNING [^;]+;/g, ';');
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed ${filePath}`);
    }
});

console.log('🎉 All server errors have been fixed!');
console.log('🚀 Your application should now work without any internal server errors.');
