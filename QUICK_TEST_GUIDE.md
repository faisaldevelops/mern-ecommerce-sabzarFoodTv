# Quick Test Guide 🚀

Fast reference for running browser automation tests.

## ⚡ Quick Start

```bash
# 1. Start servers (in separate terminals)
npm run dev                    # Backend
npm run dev --prefix frontend  # Frontend

# 2. Run tests (in another terminal)
npm run test:e2e              # All tests
```

## 🎯 Run Specific Tests

```bash
npm run test:e2e:auth         # Authentication (17 tests)
npm run test:e2e:cart         # Cart operations (30 tests)
npm run test:e2e:checkout     # Checkout flow (25 tests)
npm run test:e2e:concurrent   # Concurrent/race tests (15 tests) ⭐
npm run test:e2e:products     # Product browsing (35 tests)
npm run test:e2e:edge         # Edge cases (40+ tests)
```

## 🔍 Debug Mode

```bash
npm run test:e2e:ui           # Interactive UI mode (best)
npm run test:e2e:headed       # See browser
npm run test:e2e:debug        # Full debug mode
```

## 📊 View Results

```bash
npm run test:e2e:report       # HTML report
```

## 🎪 Interactive Mode (Recommended)

```bash
npm run test:e2e:ui
```
Then:
- Click on any test to run it
- Watch it execute in real-time
- Debug failures interactively
- Re-run individual tests

## 🔥 Most Important Tests

### Concurrent Order Tests
```bash
npm run test:e2e:concurrent
```
Tests race conditions, overselling prevention, stock locking.

### Full Checkout Flow
```bash
npx playwright test -g "should complete full checkout flow"
```

### Edge Cases
```bash
npm run test:e2e:edge
```

## 📝 Run Single Test

```bash
npx playwright test -g "test name here"
```

Example:
```bash
npx playwright test -g "should handle concurrent checkouts"
```

## 🐛 Debug Failed Test

```bash
npx playwright test --debug -g "failed test name"
```

## 📸 View Trace

After failure:
```bash
npx playwright show-trace test-results/path/to/trace.zip
```

## ⚙️ Configuration

Located in `playwright.config.js`:
- Change workers for parallel execution
- Adjust timeouts
- Configure retries
- Set base URLs

## 📚 Documentation

- **Detailed Guide**: See `e2e-tests/README.md`
- **Overall Strategy**: See `TESTING.md`
- **Test Summary**: See `TEST_SUMMARY.md`

## 🎯 Test Coverage

- **Total Tests**: 124+
- **Concurrent Tests**: 15+
- **Edge Cases**: 40+
- **Coverage**: All user flows

## ✅ Prerequisites Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install chromium`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Redis running

## 🚨 Common Issues

**Tests skip?**
```bash
# Ensure database has products with stock
curl http://localhost:5000/api/products
```

**Timeout?**
```bash
# Increase timeout in playwright.config.js
timeout: 120 * 1000  // 2 minutes
```

**Browser not found?**
```bash
npx playwright install chromium
```

## 💡 Pro Tips

1. **Use UI mode** for development: `npm run test:e2e:ui`
2. **Run concurrent tests** to verify no race conditions
3. **Check edge cases** before deployment
4. **View reports** to see detailed results
5. **Use headed mode** to see what's happening

## 🎉 Success Output

When all tests pass:
```
✓ 124 tests passed
✓ No race conditions detected
✓ All edge cases handled
✓ Ready for production
```

---

**Need more info?** Check `e2e-tests/README.md` for comprehensive documentation.
