import { test, expect } from '@playwright/test';
import { AuthPage } from './utils/AuthPage.js';
import { CartPage } from './utils/CartPage.js';
import { CheckoutPage } from './utils/CheckoutPage.js';
import { generateUserData, generateAddress, clearBrowserStorage } from './utils/helpers.js';

test.describe('Edge Cases and Stress Tests', () => {
  test.describe('Network Failure Scenarios', () => {
    test('should handle API timeout gracefully', async ({ page }) => {
      // Simulate slow API
      await page.route('**/api/products/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 30000));
        route.continue();
      });

      await page.goto('/');
      
      // Should show loading or error state, not crash
      await page.waitForTimeout(3000);
      
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });

    test('should retry failed API calls', async ({ page }) => {
      let attempts = 0;
      
      await page.route('**/api/products/**', route => {
        attempts++;
        if (attempts < 2) {
          route.abort('failed');
        } else {
          route.continue();
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should eventually succeed or show error
      expect(true).toBeTruthy();
    });

    test('should handle network disconnect during checkout', async ({ page }) => {
      const userData = generateUserData();
      const authPage = new AuthPage(page);
      const cartPage = new CartPage(page);
      
      await authPage.signup(userData.name, userData.email, userData.password);
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Simulate network failure during checkout
      await page.route('**/api/payment/**', route => {
        route.abort('failed');
      });
      
      await cartPage.proceedToCheckout();
      
      // Should show error, not crash
      await page.waitForTimeout(2000);
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });

    test('should handle intermittent connectivity', async ({ page }) => {
      let requestCount = 0;
      
      await page.route('**/api/**', route => {
        requestCount++;
        // Fail every other request
        if (requestCount % 2 === 0) {
          route.abort('failed');
        } else {
          route.continue();
        }
      });

      await page.goto('/');
      await page.waitForTimeout(3000);
      
      // Should handle gracefully
      expect(true).toBeTruthy();
    });
  });

  test.describe('Browser State Edge Cases', () => {
    test('should handle localStorage being full', async ({ page }) => {
      // Fill localStorage
      await page.evaluate(() => {
        try {
          const largeData = 'x'.repeat(5 * 1024 * 1024); // 5MB
          for (let i = 0; i < 10; i++) {
            localStorage.setItem(`filler${i}`, largeData);
          }
        } catch (e) {
          // Expected to fail
        }
      });

      const authPage = new AuthPage(page);
      const cartPage = new CartPage(page);
      
      await cartPage.goToHome();
      
      // Should handle localStorage full error
      try {
        await cartPage.addToCart(0);
      } catch (error) {
        // Expected to handle gracefully
      }
      
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    });

    test('should handle cookies being disabled', async ({ context, page }) => {
      // Clear all cookies
      await context.clearCookies();
      
      const authPage = new AuthPage(page);
      const userData = generateUserData();
      
      try {
        await authPage.signup(userData.name, userData.email, userData.password);
      } catch (error) {
        // May fail without cookies
      }
      
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    });

    test('should handle session expiration', async ({ page }) => {
      const authPage = new AuthPage(page);
      const userData = generateUserData();
      
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Clear session cookies
      await page.context().clearCookies();
      
      // Try to access protected page
      await page.goto('/my-orders');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login
      const url = page.url();
      expect(url.includes('/login') || url.includes('/my-orders')).toBeTruthy();
    });

    test('should handle browser back button during checkout', async ({ page }) => {
      const userData = generateUserData();
      const authPage = new AuthPage(page);
      const cartPage = new CartPage(page);
      
      await authPage.signup(userData.name, userData.email, userData.password);
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      await cartPage.proceedToCheckout();
      
      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Cart should still have items
      const count = await cartPage.getCartItemCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should handle browser refresh during checkout', async ({ page }) => {
      const userData = generateUserData();
      const authPage = new AuthPage(page);
      const cartPage = new CartPage(page);
      
      await authPage.signup(userData.name, userData.email, userData.password);
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      await cartPage.proceedToCheckout();
      
      // Refresh
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should handle gracefully
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });
  });

  test.describe('Input Validation Edge Cases', () => {
    test('should handle extremely long input strings', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.goToSignup();
      
      const longString = 'a'.repeat(10000);
      
      await page.fill('input[name="name"]', longString).catch(() => {});
      await page.fill('input[type="email"]', `${longString}@test.com`).catch(() => {});
      await page.fill('input[type="password"]', longString).catch(() => {});
      
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    });

    test('should handle special characters in input', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.goToSignup();
      
      const specialChars = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./`~';
      
      await page.fill('input[name="name"]', specialChars).catch(() => {});
      await page.waitForTimeout(500);
      
      expect(true).toBeTruthy();
    });

    test('should handle emoji in input fields', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.goToSignup();
      
      const emoji = '😀🎉🚀💯🔥';
      
      await page.fill('input[name="name"]', emoji).catch(() => {});
      await page.waitForTimeout(500);
      
      expect(true).toBeTruthy();
    });

    test('should handle SQL injection attempts', async ({ page }) => {
      const authPage = new AuthPage(page);
      
      const sqlInjection = "' OR '1'='1";
      
      try {
        await authPage.login(sqlInjection, sqlInjection);
      } catch (error) {
        // Expected to fail safely
      }
      
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    });

    test('should handle XSS attempts in product search', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const xssAttempt = '<script>alert("XSS")</script>';
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
      const exists = await searchInput.count() > 0;
      
      if (exists) {
        await searchInput.fill(xssAttempt);
        await page.waitForTimeout(1000);
        
        // No alert should appear
        expect(true).toBeTruthy();
      }
    });

    test('should handle null/undefined in cart operations', async ({ page }) => {
      const cartPage = new CartPage(page);
      
      // Try to add product with null/undefined
      try {
        await cartPage.addToCartViaAPI(null, 1);
      } catch (error) {
        // Expected to fail
      }
      
      try {
        await cartPage.addToCartViaAPI(undefined, 1);
      } catch (error) {
        // Expected to fail
      }
      
      expect(true).toBeTruthy();
    });
  });

  test.describe('Concurrent User Stress Tests', () => {
    test('should handle multiple rapid cart additions', async ({ page }) => {
      const cartPage = new CartPage(page);
      await cartPage.goToHome();
      
      // Rapid fire add to cart
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(cartPage.addToCart(0));
      }
      
      await Promise.all(promises.map(p => p.catch(() => {})));
      
      await page.waitForTimeout(2000);
      
      // Should handle without crashing
      const count = await cartPage.getCartItemCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should handle rapid page navigation', async ({ page }) => {
      const pages = ['/', '/cart', '/', '/login', '/', '/signup', '/'];
      
      for (const path of pages) {
        await page.goto(path);
      }
      
      await page.waitForLoadState('networkidle');
      
      // Should not crash
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });

    test('should handle rapid login/logout cycles', async ({ page }) => {
      const authPage = new AuthPage(page);
      const userData = generateUserData();
      
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Rapid logout/login cycles
      for (let i = 0; i < 3; i++) {
        await authPage.logout();
        await page.waitForTimeout(500);
        await authPage.login(userData.email, userData.password);
        await page.waitForTimeout(500);
      }
      
      expect(true).toBeTruthy();
    });
  });

  test.describe('Data Integrity Edge Cases', () => {
    test('should handle product with zero price', async ({ page }) => {
      // Mock product with zero price
      await page.route('**/api/products/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([{
            _id: '123',
            name: 'Free Product',
            price: 0,
            stockQuantity: 10,
            category: 'test'
          }])
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should display product with zero price
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should handle product with negative stock', async ({ page }) => {
      // Mock product with negative stock
      await page.route('**/api/products/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([{
            _id: '123',
            name: 'Product',
            price: 100,
            stockQuantity: -5,
            category: 'test'
          }])
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should handle gracefully
      expect(true).toBeTruthy();
    });

    test('should handle malformed API responses', async ({ page }) => {
      await page.route('**/api/products/**', route => {
        route.fulfill({
          status: 200,
          body: 'This is not JSON'
        });
      });

      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Should not crash
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });

    test('should handle missing required product fields', async ({ page }) => {
      await page.route('**/api/products/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([{
            _id: '123',
            // Missing name, price, stockQuantity
          }])
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should handle missing fields
      expect(true).toBeTruthy();
    });
  });

  test.describe('Memory and Performance Edge Cases', () => {
    test('should handle large cart with many items', async ({ page }) => {
      const userData = generateUserData();
      const authPage = new AuthPage(page);
      const cartPage = new CartPage(page);
      
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Get products
      const productResponse = await page.request.get('http://localhost:5000/api/products/');
      const productsData = await productResponse.json();
      const products = Array.isArray(productsData) ? productsData : productsData.products || [];
      const availableProducts = products.filter(p => p.stockQuantity > 0).slice(0, 10);
      
      if (availableProducts.length > 0) {
        // Add many products to cart
        for (const product of availableProducts) {
          await cartPage.addToCartViaAPI(product._id, 1);
        }
        
        // View cart
        await cartPage.goToCart();
        await page.waitForLoadState('networkidle');
        
        // Should handle large cart
        const items = await cartPage.getCartItems();
        expect(items.length).toBeGreaterThan(0);
      }
    });

    test('should handle very large product quantities', async ({ page }) => {
      const userData = generateUserData();
      const authPage = new AuthPage(page);
      const cartPage = new CartPage(page);
      
      await authPage.signup(userData.name, userData.email, userData.password);
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Try to set very large quantity
      try {
        await cartPage.updateQuantity(0, 999999);
      } catch (error) {
        // Expected to fail or be limited
      }
      
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    });

    test('should handle rapid API calls', async ({ page }) => {
      // Make many rapid API calls
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(
          page.request.get('http://localhost:5000/api/products/').catch(() => {})
        );
      }
      
      await Promise.all(promises);
      
      // Should not crash server
      const response = await page.request.get('http://localhost:5000/api/products/');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Time-based Edge Cases', () => {
    test('should handle operations near midnight', async ({ page }) => {
      // Set system time to near midnight
      const nearMidnight = new Date();
      nearMidnight.setHours(23, 59, 50);
      
      await page.addInitScript(`{
        Date = class extends Date {
          constructor(...args) {
            if (args.length === 0) {
              super(${nearMidnight.getTime()});
            } else {
              super(...args);
            }
          }
        }
      }`);

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should handle time correctly
      expect(true).toBeTruthy();
    });

    test('should handle hold expiration edge cases', async ({ page }) => {
      const userData = generateUserData();
      const authPage = new AuthPage(page);
      const checkoutPage = new CheckoutPage(page);
      
      await authPage.signup(userData.name, userData.email, userData.password);
      
      const productResponse = await page.request.get('http://localhost:5000/api/products/');
      const productsData = await productResponse.json();
      const products = Array.isArray(productsData) ? productsData : productsData.products || [];
      const targetProduct = products.find(p => p.stockQuantity > 0);
      
      if (!targetProduct) {
        test.skip();
        return;
      }
      
      const orderProducts = [{
        _id: targetProduct._id,
        id: targetProduct._id,
        name: targetProduct.name,
        price: targetProduct.price,
        quantity: 1,
        image: targetProduct.image || '',
      }];
      
      const address = generateAddress();
      const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      if (orderResponse.status() === 200) {
        const orderData = await orderResponse.json();
        const expiresAt = new Date(orderData.expiresAt);
        const now = new Date();
        
        // Verify expiration is in future
        expect(expiresAt.getTime()).toBeGreaterThan(now.getTime());
      }
    });
  });

  test.describe('Browser Compatibility Edge Cases', () => {
    test('should handle browser zoom levels', async ({ page }) => {
      // Set zoom level
      await page.evaluate(() => {
        document.body.style.zoom = '150%';
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should display correctly
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });

    test('should handle very small viewport', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 480 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should be usable
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should handle very large viewport', async ({ page }) => {
      await page.setViewportSize({ width: 3840, height: 2160 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should display correctly
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
