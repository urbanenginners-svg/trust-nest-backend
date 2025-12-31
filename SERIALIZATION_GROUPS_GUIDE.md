/**
 * SerializationGroups Enum Usage Examples
 * 
 * This file demonstrates how to use the new SerializationGroups enum
 * for consistent and type-safe field visibility control.
 */

import { SerializationGroups } from '../src/common/decorators/serialize-response.decorator';

// ===== CONTROLLER USAGE =====
// Before (using string literals):
// @SerializeResponse('admin', 'user')

// After (using enum constants):
// @SerializeResponse(SerializationGroups.ADMIN, SerializationGroups.USER)

// ===== ENTITY USAGE =====
// Before (using string literals):
// @Expose({ groups: ['admin', 'user'] })

// After (using enum constants):
// @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })

// ===== ENUM DEFINITION =====
export enum SerializationGroupsDemo {
  ADMIN = 'admin',    // Full access to all fields including sensitive data
  USER = 'user',      // Standard user access (public + user fields)
  PUBLIC = 'public',  // Public access only (minimal fields)
}

// ===== BENEFITS =====
/**
 * 1. TYPE SAFETY: IntelliSense and compile-time checking
 * 2. MAINTAINABILITY: Single source of truth for group names
 * 3. REFACTORING: Easy to rename or add new groups
 * 4. CONSISTENCY: Prevents typos in string literals
 * 5. DOCUMENTATION: Clear enum values with descriptions
 */

// ===== USAGE PATTERNS =====

// Public fields (everyone can see)
// @Expose({ groups: [SerializationGroups.PUBLIC] })
// OR remove @Expose completely for always visible fields

// User fields (authenticated users can see)  
// @Expose({ groups: [SerializationGroups.PUBLIC, SerializationGroups.USER] })

// Admin fields (admin users only)
// @Expose({ groups: [SerializationGroups.ADMIN] })

// Mixed access (admin and user, but not public)
// @Expose({ groups: [SerializationGroups.ADMIN, SerializationGroups.USER] })