# Supabase Migration Plan

## Overview

This document outlines the plan to migrate away from Supabase dependencies in the backend of the Chatty application. The migration will be done in phases to ensure minimal disruption to the service.

## Current Status

We have already implemented the following changes:

1. Created a centralized Supabase configuration file (`src/config/supabase.js`)
2. Updated database.js to remove Supabase dependencies
3. Migrated the following routes to use direct PostgreSQL queries instead of Supabase:
   - User routes (profile, password change, account deletion, activity, usage statistics)
   - Subscription routes (status, cancel, history, usage)
   - Tools routes (script generator, payload generator, PDF generator, business planner, usage history)
4. Updated WebSocket handler to use JWT authentication instead of Supabase
5. Updated migration scripts to use direct PostgreSQL queries

## Remaining Tasks

### Phase 1: Authentication System

1. Create a complete JWT-based authentication system:
   - Implement user registration endpoint
   - Implement login endpoint
   - Implement password reset functionality
   - Implement email verification

2. Update database schema:
   - Create users table with necessary fields (if not already exists)
   - Create user_sessions table for managing JWT tokens
   - Create password_reset_tokens table for password resets

### Phase 2: Database Migration

1. Create migration scripts to move data from Supabase tables to our PostgreSQL database:
   - Users data
   - Subscription data
   - Conversation and message data
   - Tool usage data

2. Update database schema to match Supabase schema where necessary

### Phase 3: Frontend Integration

1. Update frontend API client to use our new authentication endpoints:
   - Modify `src/services/api.ts` to use JWT from localStorage instead of Supabase session
   - Remove dynamic import of Supabase client from `getAuthToken()` method

2. Replace Supabase authentication in AuthProvider:
   - Update `src/components/AuthProvider.tsx` to use our JWT-based authentication
   - Replace Supabase auth state listener with custom implementation
   - Update session management to use localStorage for JWT storage

3. ✅ Remove Supabase client and types (completed):
   - ✅ Remove `src/integrations/supabase/client.ts`
   - ✅ Remove `src/integrations/supabase/types.ts`
   - ✅ Update imports across the application

4. Test all frontend functionality with the new backend
5. Ensure all features work correctly without Supabase

### Phase 4: Cleanup

1. ✅ Remove Supabase configuration file (`src/config/supabase.js`) (completed)
2. ✅ Remove Supabase import from database.js (completed)
3. ✅ Remove Supabase SDK from package.json (completed):
   - Backend: `npm uninstall @supabase/supabase-js`
   - ✅ Frontend: Remove `@supabase/supabase-js` from dependencies

4. ✅ Update environment variables in .env files and setup.js (completed):
   - ✅ Remove SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY
   - ✅ Update documentation to reflect PostgreSQL connection parameters

5. ✅ Update scripts/deploy.js to remove Supabase client initialization (completed)
6. ✅ Update README.md to remove Supabase references and update setup instructions (completed)
7. ✅ Update docker-compose.yml to remove Supabase environment variables (completed)
8. ✅ Update frontend environment variables (completed):
   - ✅ Remove `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local`
   - ✅ Update frontend documentation accordingly

## Testing Strategy

1. Create comprehensive test suite for all migrated endpoints
2. Test authentication flow thoroughly
3. Test subscription management
4. Test all tools functionality
5. Test WebSocket connections

## Rollback Plan

In case of issues during migration:

1. Keep Supabase as a fallback option during the transition
2. Implement feature flags to switch between Supabase and direct PostgreSQL
3. Monitor error rates and performance metrics after migration

## Timeline

- Phase 1: 1-2 weeks
- Phase 2: 1 week
- Phase 3: 1 week
- Phase 4: 1-2 days
- Testing: Throughout all phases

## Conclusion

This migration will give us full control over our backend infrastructure, reduce costs, and simplify our architecture. The phased approach ensures we can migrate safely with minimal disruption to users.