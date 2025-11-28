# Test Documentation

## Overview

This test suite provides comprehensive coverage for the improv suggestion generator application, ensuring reliability across all features, languages, and edge cases.

## Test Organization

### 1. **Unit Tests** (`base.test.js`, `i18n.test.js`)

Tests individual functions and modules in isolation.

**base.test.js** covers:
- `shuffle()` function - array shuffling logic
- `getSuggestionType()` - button type detection
- `getClickEventHandler()` - click handling and suggestion cycling
- Font sizing logic (mobile vs desktop, short vs long text)
- Event handler management and cleanup
- Edge cases: empty arrays, single items, rapid clicks

**i18n.test.js** covers:
- Language detection (URL params, localStorage, browser preference)
- Language switching and persistence
- Translation system (`t()` function)
- DOM updates when language changes
- Language switcher UI state
- Font size configuration per language
- Edge cases: missing translations, invalid languages

**Run with:**
```bash
npm run test:unit
```

### 2. **Integration Tests** (`integration.test.js`)

Tests interaction between multiple modules and the DOM.

Covers:
- Complete user flows (button clicks → suggestion display)
- Language switching with suggestion updates
- Separate state management per category
- Font size integration with i18n system
- Event coordination between i18n and base.js
- Error recovery scenarios
- Memory management and handler cleanup
- Real-world user scenarios

**Run with:**
```bash
npm run test:integration
```

### 3. **End-to-End Tests** (`e2e-browser.test.js`)

Simulates complete user journeys in a browser-like environment.

Covers:
- Application bootstrap and initialization
- Complete user workflows (visit → click → switch language → continue)
- Responsive behavior across screen sizes
- Persistence (localStorage, URL parameters)
- Accessibility features
- Multi-language exploration patterns

**Run with:**
```bash
npm run test:e2e
```

### 4. **Data Validation Tests** (`data-validation.test.js`)

Validates the quality and completeness of suggestion data.

Covers:
- Data structure completeness (all languages have all categories)
- Non-empty arrays across all languages
- No duplicate suggestions within categories
- Proper character encoding (French accents, Greek alphabet, Danish characters)
- No malicious content (HTML/script injection)
- Reasonable suggestion lengths
- Data consistency across languages
- Relationship format validation (proper separators)
- Statistical analysis (variety, distribution)

**Run with:**
```bash
npm run test:validation
```

### 5. **Edge Case Tests** (`edge-cases.test.js`)

Tests boundary conditions and unusual scenarios.

Covers:
- Empty and minimal data (empty arrays, single items, huge arrays)
- Malformed data (null, undefined, objects in arrays)
- DOM edge cases (missing elements, removed during interaction)
- Extreme font sizes (0, negative, very large)
- Screen width extremes (0, exactly at breakpoint, very wide)
- Special characters (HTML, emojis, Unicode, newlines)
- Rapid and concurrent operations
- Memory leak prevention
- Unusual button configurations

**Run with:**
```bash
npm run test:edge
```

### 6. **Existing Tests** (`suggestions.test.js`, `console-errors.test.js`)

Original tests for script loading and data structure.

Covers:
- Script file isolation (IIFEs, no global pollution)
- Suggestion data format validation
- Language loading without conflicts
- Console error detection during script execution

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Suites
```bash
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests only
npm run test:validation    # Data validation only
npm run test:edge         # Edge cases only
```

### Verbose Output
```bash
npm run test:verbose
```

### CI/CD
```bash
npm run test:ci
```

## Test Coverage Goals

### Current Coverage Areas

✅ **Core Functionality**
- Suggestion cycling and shuffling
- Button click handling
- Font size calculation
- Screen width responsiveness

✅ **Internationalization**
- All 4 languages (English, French, Greek, Danish)
- Language detection and switching
- Translation system
- Language-specific configurations

✅ **User Interactions**
- Button clicks across all categories
- Language switching via UI
- Multi-category navigation
- Rapid interactions

✅ **Data Integrity**
- No duplicates
- Proper encoding
- Complete datasets
- Format validation

✅ **Edge Cases**
- Empty data
- Malformed input
- Extreme values
- DOM manipulation during execution

✅ **Error Handling**
- Missing DOM elements
- Invalid data
- Corrupted storage
- Unknown button types

## Key Test Metrics

### Coverage Targets
- **Statements:** > 90%
- **Branches:** > 85%
- **Functions:** > 90%
- **Lines:** > 90%

### Data Quality Checks
- ✅ All 4 languages have 3 categories each
- ✅ No empty strings in suggestions
- ✅ No duplicate suggestions
- ✅ Proper character encoding for each language
- ✅ Consistent data volume across languages (within 20%)

## Adding New Tests

### When to Add Tests

1. **New Features:** Always add tests before implementing
2. **Bug Fixes:** Add regression test first
3. **New Languages:** Add validation and integration tests
4. **New Suggestion Categories:** Update all relevant test suites

### Test Structure Template

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Set up test environment
  });

  test('should do expected behavior', () => {
    // Arrange: Set up test data

    // Act: Execute the functionality

    // Assert: Verify results
    expect(result).toBe(expected);
  });
});
```

### Best Practices

1. **Isolation:** Each test should be independent
2. **Clarity:** Test names should describe the scenario
3. **Coverage:** Test happy path, edge cases, and errors
4. **Speed:** Keep tests fast (< 100ms each)
5. **Maintainability:** Use helper functions for common setups

## Continuous Integration

Tests run automatically on:
- Every commit (via git hooks if configured)
- Pull requests
- Before deployment

### CI Configuration

The `test:ci` script is optimized for CI environments:
- Runs with coverage reporting
- Uses limited workers for consistency
- Exits with proper error codes
- Generates coverage reports for viewing

## Debugging Failed Tests

### Common Issues

1. **DOM Not Set Up:** Ensure `document.body.innerHTML` is properly initialized
2. **Mocks Not Reset:** Check `beforeEach` hook resets all mocks
3. **Async Issues:** Ensure all promises are awaited
4. **Global State:** Tests may share state - use proper cleanup

### Debug Commands

```bash
# Run specific test file
npm test tests/base.test.js

# Run specific test by name
npm test -- -t "should shuffle array"

# Run with console output
npm test -- --verbose

# Run in watch mode for debugging
npm run test:watch
```

## Browser Testing (Future Enhancement)

For real browser testing, consider adding:
- **Playwright** or **Cypress** for true E2E tests
- Visual regression testing
- Performance testing
- Cross-browser compatibility tests

Example Playwright setup:
```javascript
// tests/playwright/e2e.spec.js
test('should display suggestion on click', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await page.click('.location');
  const suggestion = await page.textContent('.suggestion');
  expect(suggestion).toBeTruthy();
});
```

## Test Maintenance

### Regular Tasks
- [ ] Review coverage reports monthly
- [ ] Update tests when adding features
- [ ] Remove obsolete tests
- [ ] Optimize slow tests
- [ ] Update this documentation

### When to Update Tests
- Code refactoring
- Bug fixes
- New features
- Changing requirements
- Performance optimizations

## Metrics and Reports

### Viewing Coverage Reports

After running `npm run test:coverage`, open:
```
./coverage/lcov-report/index.html
```

This provides:
- Line-by-line coverage
- Branch coverage
- Function coverage
- Uncovered code highlighting

### Test Execution Time

Monitor test performance:
```bash
npm test -- --verbose
```

Look for slow tests (> 100ms) and optimize as needed.

## Summary

This test suite ensures the improv suggestion generator is:
- ✅ **Reliable:** Works correctly across all scenarios
- ✅ **Robust:** Handles errors and edge cases gracefully
- ✅ **Maintainable:** Clear, organized, and well-documented
- ✅ **International:** Properly supports all 4 languages
- ✅ **Fast:** Tests run quickly for rapid feedback
- ✅ **Comprehensive:** Covers unit, integration, E2E, and validation

**Total Test Count:** 100+ tests across 7 test files
**Coverage Target:** > 90% across all metrics
**Execution Time:** < 5 seconds for full suite
