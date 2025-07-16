# Variable-Only Transformation and Validation

This document describes the enhanced transformer and validation system that ensures transformers only operate on variable values and all variable references are properly validated.

## Overview

The refactored system provides clear separation between:
- **Direct user input**: Only validated, never transformed
- **Variable references**: Both validated and transformed

## Key Changes

### 1. Variable-Only Transformation

Transformers now only apply in these cases:
- When `isVariableValue` flag is set to `true` in `TransformContext`
- When a field has a `source` option specified (indicating it derives from another variable)

```typescript
// ✅ Will transform (variable value)
const context: TransformContext = {
  sourceValue: "https://example.com",
  isVariableValue: true,
  // ... other properties
};

// ❌ Will NOT transform (direct user input)
const context: TransformContext = {
  sourceValue: "https://example.com", 
  isVariableValue: false, // or undefined
  // ... other properties
};
```

### 2. Variable Validation

New `validateVariable()` method in `ValidationService` that:
- Validates variable values using existing validator plugins
- Applies transformers to validated values if specified
- Returns detailed validation results including whether transformation occurred

```typescript
const result = await validationService.validateVariable(
  'API_URL',
  'https://example.com',
  sourceField,
  context
);

// Result includes:
// - valid: boolean
// - value: string (validated/transformed)
// - errors: string[]
// - warnings: string[]  
// - wasTransformed: boolean
```

### 3. Enhanced Variable Resolution

#### Source Value Resolution
`resolveSourceValue()` now:
- Validates variable values before returning them
- Applies transformers to validated values
- Handles error cases gracefully

#### Placeholder Resolution  
`resolvePlaceholders()` now:
- Validates each variable reference (`@{VAR_NAME}`)
- Applies transformers to validated variables
- Preserves original values if validation fails (with warnings)

## Usage Examples

### Basic Variable Reference
```env
# Template
API_URL={{url|protocol=https}}
HOSTNAME={{string|source=@{API_URL}|transformer=extract_hostname}}

# When API_URL = "https://example.com:8080"
# HOSTNAME will be validated and transformed to "example.com"
```

### Default Values with Variables
```env
# Template  
API_URL={{url}}
BACKUP_URL={{string|default=@{API_URL}/backup}}

# When API_URL = "https://api.example.com"
# BACKUP_URL defaults to "https://api.example.com/backup" (validated)
```

### Derived Values
```env
# Template
API_URL={{url}}
API_PORT={{number|source=@{API_URL}|transformer=extract_port}}
API_HOST={{string|source=@{API_URL}|transformer=extract_hostname}}

# When API_URL = "https://api.example.com:8443/path"
# API_PORT = "8443" (validated as number)
# API_HOST = "api.example.com" (validated as string)
```

## Benefits

1. **Security**: User input cannot be transformed maliciously
2. **Consistency**: Variable values are always validated before use
3. **Debugging**: Clear distinction between user input and derived values
4. **Reliability**: Transformation errors are isolated to variable processing

## Backward Compatibility

The system maintains backward compatibility:
- Existing templates continue to work
- Direct field transformers still work when `source` is specified
- All existing validator and transformer plugins work unchanged

## Implementation Details

### Service Integration
```typescript
// Services are cross-connected for variable processing
validationService.setServiceContainer(serviceContainer);
transformerService.setValidationService(validationService);
```

### Context Flags
```typescript
interface TransformContext {
  sourceValue: string;
  allValues: Map<string, string>;
  field: TemplateField;
  templateFields: TemplateField[];
  isVariableValue?: boolean; // New flag for variable-only transformation
}
```

### Validation Results
```typescript
interface VariableValidationResult {
  valid: boolean;
  value: string;
  errors: string[];
  warnings: string[];
  wasTransformed: boolean; // Indicates if transformation occurred
}
```

This architecture ensures that transformers only operate on controlled, validated variable values while maintaining the flexibility and power of the existing system.