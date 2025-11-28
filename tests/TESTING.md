# Testing Guide - TDD Approach

This document explains how to test the i18n system using Test-Driven Development principles.

## Test Files

- `suggestions.test.js` - Unit tests for suggestion loading
- `console-errors.test.js` - Tests for script loading and error detection

## Running Tests

### Jest Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Expected Test Results

### ✅ All Tests Should Pass

```
📦 Suggestion Data Loading
  ✓ window.suggestionsByLanguage should be initialized
  ✓ Each language should export suggestions in correct format
  ✓ All four languages should be available
  ✓ Suggestions should not be empty

📦 Script File Isolation
  ✓ Script files should not declare global main function
  ✓ Script files should use IIFE to avoid conflicts

📦 Script Loading
  ✓ window.suggestionsByLanguage should exist before scripts load
  ✓ Script files should populate suggestionsByLanguage

📦 Language Initialization
  ✓ Should load suggestions for current language
  ✓ Should handle missing language gracefully
```

## What Was Fixed (TDD Approach)

### Step 1: Write Tests (RED)
- Created test suite defining expected behavior
- Tests initially failed (expected)

### Step 2: Fix Code (GREEN)
1. **Fixed script loading order**
   - Initialize `window.suggestionsByLanguage = {}` FIRST
   - Then load script files
   - Scripts populate the object

2. **Fixed script file structure**
   - Wrapped in IIFE: `(function() { ... })()`
   - No global `main` function
   - Conditional export based on `window.suggestionsByLanguage` existence

3. **Added error handling**
   - Check if suggestions exist before using
   - Log available languages on error
   - Fall back to English if current language unavailable

4. **Removed setTimeout**
   - Scripts load synchronously, no need for delay

### Step 3: Verify Tests (REFACTOR)
- Run tests to confirm all pass
- Code is now working correctly

## Common Issues Fixed

### Issue 1: "Identifier 'main' has already been declared"
**Cause:** Script files weren't wrapped in IIFE
**Fix:** Wrapped all scripts in `(function() { ... })()`

### Issue 2: "Suggestions not loaded for language: en"
**Cause:** Scripts loaded before `window.suggestionsByLanguage` initialized
**Fix:** Initialize storage object BEFORE loading scripts

### Issue 3: "Cannot read property 'location' of undefined"
**Cause:** No fallback when language not loaded
**Fix:** Added error handling and English fallback

## Debugging

### Check Script Loading

Open browser console and type:

```javascript
// Should show all loaded languages
console.log(Object.keys(window.suggestionsByLanguage));

// Should show English suggestions
console.log(window.suggestionsByLanguage.en);

// Check current language
console.log(i18n.currentLanguage);
```

### Expected Output

```javascript
Object.keys(window.suggestionsByLanguage)
// => ["en", "fr", "gr", "dn"]

window.suggestionsByLanguage.en
// => { location: [...], relationship: [...], word: [...] }

i18n.currentLanguage
// => "en" (or your browser's language)
```

## Test Coverage

What's tested:
- ✅ Suggestion data structure
- ✅ All languages load correctly
- ✅ Script file isolation (no global conflicts)
- ✅ Script loading order
- ✅ Error handling

What's NOT tested (future improvements):
- ❌ UI interactions (button clicks)
- ❌ Language persistence (localStorage)
- ❌ URL parameter parsing
- ❌ Browser language detection

## Adding New Tests

To add a test:

```javascript
test('Your test description', () => {
  // Arrange
  const testData = { ... };

  // Act
  const result = yourFunction(testData);

  // Assert
  expect(result).toBe(expectedValue);
});
```

## CI/CD Integration

To run tests in CI:

```bash
# Run all Jest tests
npm test
```

## Success Criteria

The system is working when:
- ✅ All tests pass
- ✅ No console errors
- ✅ Can switch languages instantly
- ✅ Suggestions appear in correct language
- ✅ Language persists on reload

## Next Steps

After tests pass:
1. Test on multiple browsers
2. Test on mobile devices
3. Test with slow network (throttling)
4. Deploy and monitor for errors
