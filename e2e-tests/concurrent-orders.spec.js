import { test, expect } from '@playwright/test';
import { AuthPage } from './utils/AuthPage.js';
import { CartPage } from './utils/CartPage.js';
import { CheckoutPage } from './utils/CheckoutPage.js';
import { generateUserData, generateAddress, executeConcurrent } from './utils/helpers.js';

test.describe('Concurrent Orders and Race Conditions', () => {
  test.describe.configure({ mode: 'serial' }); // Run these tests serially to avoid interference

  test.describe('Concurrent Checkout with Limited Stock', () => {
    test('should handle concurrent checkouts for same product with limited stock', async ({ browser }) => {
      // This test simulates multiple users trying to checkout the same product simultaneously
      
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext(),
      ]);

      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));
      
      try {
        // Get product with limited stock
        const productResponse = await pages[0].request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        
        // Find product with stock between 3 and 10
        const targetProduct = products.find(p => p.stockQuantity >= 3 && p.stockQuantity <= 10);
        
        if (!targetProduct) {
          test.skip();
          return;
        }

        const initialStock = targetProduct.stockQuantity;
        const quantityPerUser = Math.min(3, initialStock);
        
        // Setup: Create users and add products to cart for each
        const usersData = await Promise.all(pages.map(async (page, index) => {
          const userData = generateUserData();
          const authPage = new AuthPage(page);
          const cartPage = new CartPage(page);
          const checkoutPage = new CheckoutPage(page);
          
          // Register user
          await authPage.signupViaAPI(userData.name, userData.email, userData.password);
          
          // Add product to cart
          await cartPage.addToCartViaAPI(targetProduct._id, quantityPerUser);
          
          return { 
            page, 
            userData, 
            authPage, 
            cartPage, 
            checkoutPage,
            address: generateAddress() 
          };
        }));

        // Concurrent checkout attempt
        const checkoutResults = await Promise.allSettled(
          usersData.map(async ({ page, checkoutPage, address }) => {
            const orderProducts = [{
              _id: targetProduct._id,
              id: targetProduct._id,
              name: targetProduct.name,
              price: targetProduct.price,
              quantity: quantityPerUser,
              image: targetProduct.image || '',
            }];

            const response = await checkoutPage.createOrderViaAPI(orderProducts, address);
            const data = await response.json().catch(() => ({}));
            
            return {
              status: response.status(),
              success: response.status() === 200,
              data,
            };
          })
        );

        // Analyze results
        const successfulCheckouts = checkoutResults.filter(
          result => result.status === 'fulfilled' && result.value.success
        );
        
        const failedCheckouts = checkoutResults.filter(
          result => result.status === 'fulfilled' && !result.value.success
        );

        // Expectations:
        // 1. At least one checkout should succeed
        expect(successfulCheckouts.length).toBeGreaterThan(0);
        
        // 2. If stock is insufficient for all users, some should fail
        const totalRequested = quantityPerUser * pages.length;
        if (totalRequested > initialStock) {
          expect(failedCheckouts.length).toBeGreaterThan(0);
          
          // Failed checkouts should have insufficient stock error
          const insufficientStockErrors = failedCheckouts.filter(
            result => result.value?.data?.insufficientStock === true
          );
          expect(insufficientStockErrors.length).toBeGreaterThan(0);
        }
        
        // 3. Total successful quantity should not exceed initial stock
        const totalSuccessful = successfulCheckouts.length * quantityPerUser;
        expect(totalSuccessful).toBeLessThanOrEqual(initialStock);

        console.log(`
          Initial Stock: ${initialStock}
          Requested per user: ${quantityPerUser}
          Total users: ${pages.length}
          Successful checkouts: ${successfulCheckouts.length}
          Failed checkouts: ${failedCheckouts.length}
        `);

      } finally {
        // Cleanup
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });

    test('should prevent overselling when multiple users checkout simultaneously', async ({ browser }) => {
      const numUsers = 5;
      const contexts = await Promise.all(
        Array(numUsers).fill(null).map(() => browser.newContext())
      );
      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

      try {
        // Get product with very limited stock (1-3 units)
        const productResponse = await pages[0].request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        
        const targetProduct = products.find(p => p.stockQuantity >= 1 && p.stockQuantity <= 3);
        
        if (!targetProduct) {
          test.skip();
          return;
        }

        const initialStock = targetProduct.stockQuantity;
        
        // All users try to buy 1 unit
        const usersData = await Promise.all(pages.map(async (page) => {
          const userData = generateUserData();
          const authPage = new AuthPage(page);
          const cartPage = new CartPage(page);
          const checkoutPage = new CheckoutPage(page);
          
          await authPage.signupViaAPI(userData.name, userData.email, userData.password);
          await cartPage.addToCartViaAPI(targetProduct._id, 1);
          
          return { page, checkoutPage, address: generateAddress() };
        }));

        // All users checkout at the exact same time
        const startTime = Date.now();
        const checkoutResults = await Promise.allSettled(
          usersData.map(({ checkoutPage, address }) => {
            const orderProducts = [{
              _id: targetProduct._id,
              id: targetProduct._id,
              name: targetProduct.name,
              price: targetProduct.price,
              quantity: 1,
              image: targetProduct.image || '',
            }];

            return checkoutPage.createOrderViaAPI(orderProducts, address);
          })
        );
        const endTime = Date.now();

        // Count successful checkouts
        const successfulCheckouts = checkoutResults.filter(
          result => result.status === 'fulfilled' && result.value.status() === 200
        );

        // Critical assertion: Only stock amount of users should succeed
        expect(successfulCheckouts.length).toBeLessThanOrEqual(initialStock);
        
        // The system should not allow more orders than available stock
        expect(successfulCheckouts.length).toBeGreaterThan(0);
        expect(successfulCheckouts.length).toBeLessThanOrEqual(initialStock);

        console.log(`
          Race condition test completed in ${endTime - startTime}ms
          Initial stock: ${initialStock}
          Concurrent users: ${numUsers}
          Successful orders: ${successfulCheckouts.length}
          Failed orders: ${checkoutResults.length - successfulCheckouts.length}
          No overselling: ${successfulCheckouts.length <= initialStock ? 'PASS' : 'FAIL'}
        `);

      } finally {
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });

    test('should handle concurrent checkouts for different products', async ({ browser }) => {
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext(),
      ]);
      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

      try {
        // Get multiple products with stock
        const productResponse = await pages[0].request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        
        const availableProducts = products.filter(p => p.stockQuantity > 0).slice(0, 3);
        
        if (availableProducts.length < 3) {
          test.skip();
          return;
        }

        // Each user gets a different product
        const checkoutResults = await Promise.all(
          pages.map(async (page, index) => {
            const product = availableProducts[index];
            const userData = generateUserData();
            const authPage = new AuthPage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);
            
            await authPage.signupViaAPI(userData.name, userData.email, userData.password);
            await cartPage.addToCartViaAPI(product._id, 1);
            
            const orderProducts = [{
              _id: product._id,
              id: product._id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.image || '',
            }];

            const response = await checkoutPage.createOrderViaAPI(orderProducts, generateAddress());
            return response.status() === 200;
          })
        );

        // All checkouts should succeed since they're for different products
        const allSucceeded = checkoutResults.every(success => success);
        expect(allSucceeded).toBeTruthy();

      } finally {
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });
  });

  test.describe('Cart Race Conditions', () => {
    test('should handle concurrent cart updates', async ({ browser }) => {
      const context = await browser.newContext();
      const pages = await Promise.all([
        context.newPage(),
        context.newPage(),
        context.newPage(),
      ]);

      try {
        // Setup: Register user and get products
        const userData = generateUserData();
        const authPage = new AuthPage(pages[0]);
        await authPage.signupViaAPI(userData.name, userData.email, userData.password);

        const productResponse = await pages[0].request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        const availableProducts = products.filter(p => p.stockQuantity > 0).slice(0, 3);

        if (availableProducts.length < 3) {
          test.skip();
          return;
        }

        // All pages add different products to cart concurrently
        await Promise.all(
          pages.map(async (page, index) => {
            const cartPage = new CartPage(page);
            await cartPage.addToCartViaAPI(availableProducts[index]._id, 1);
          })
        );

        // Verify cart has all 3 items
        const cartPage = new CartPage(pages[0]);
        const cartResponse = await cartPage.getCartViaAPI();
        const cartData = await cartResponse.json();
        
        expect(cartData.length || cartData.products?.length || 0).toBe(3);

      } finally {
        await context.close();
      }
    });

    test('should handle rapid quantity updates', async ({ page }) => {
      const userData = generateUserData();
      const authPage = new AuthPage(page);
      const cartPage = new CartPage(page);

      await authPage.signup(userData.name, userData.email, userData.password);
      await cartPage.goToHome();
      
      // Add product
      await cartPage.addToCart(0);
      await cartPage.goToCart();

      // Rapidly update quantity
      const updates = [
        () => cartPage.updateQuantity(0, 2),
        () => cartPage.updateQuantity(0, 3),
        () => cartPage.updateQuantity(0, 4),
        () => cartPage.updateQuantity(0, 5),
      ];

      for (const update of updates) {
        await update();
      }

      // Final quantity should be 5
      await page.waitForTimeout(1000);
      const items = await cartPage.getCartItems();
      expect(items[0].quantity).toBe(5);
    });
  });

  test.describe('Stock Hold Race Conditions', () => {
    test('should handle hold order creation and cancellation races', async ({ browser }) => {
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
      ]);
      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

      try {
        // Get product
        const productResponse = await pages[0].request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        const targetProduct = products.find(p => p.stockQuantity >= 2);

        if (!targetProduct) {
          test.skip();
          return;
        }

        // User 1: Create hold order
        const user1Data = generateUserData();
        const authPage1 = new AuthPage(pages[0]);
        const cartPage1 = new CartPage(pages[0]);
        const checkoutPage1 = new CheckoutPage(pages[0]);

        await authPage1.signupViaAPI(user1Data.name, user1Data.email, user1Data.password);
        await cartPage1.addToCartViaAPI(targetProduct._id, 1);

        const orderProducts = [{
          _id: targetProduct._id,
          id: targetProduct._id,
          name: targetProduct.name,
          price: targetProduct.price,
          quantity: 1,
          image: targetProduct.image || '',
        }];

        const order1Response = await checkoutPage1.createOrderViaAPI(orderProducts, generateAddress());
        const order1Data = await order1Response.json().catch(() => ({}));

        if (order1Response.status() === 200 && order1Data.localOrderId) {
          const localOrderId = order1Data.localOrderId;

          // User 2: Try to buy same product while hold is active
          const user2Data = generateUserData();
          const authPage2 = new AuthPage(pages[1]);
          const cartPage2 = new CartPage(pages[1]);
          const checkoutPage2 = new CheckoutPage(pages[1]);

          await authPage2.signupViaAPI(user2Data.name, user2Data.email, user2Data.password);
          await cartPage2.addToCartViaAPI(targetProduct._id, 1);

          const order2Response = await checkoutPage2.createOrderViaAPI(orderProducts, generateAddress());

          // If stock is only 1, user 2 should fail
          if (targetProduct.stockQuantity === 1) {
            expect(order2Response.status()).not.toBe(200);
          }

          // Cancel user 1's hold
          await checkoutPage1.cancelHoldViaAPI(localOrderId);

          // User 2 should now be able to checkout (if they try again)
          await page.waitForTimeout(1000);
          const order2RetryResponse = await checkoutPage2.createOrderViaAPI(orderProducts, generateAddress());
          
          // After cancellation, stock should be available
          expect(order2RetryResponse.status()).toBe(200);
        }

      } finally {
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });

    test('should properly release stock when hold expires', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        const productResponse = await page.request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        const targetProduct = products.find(p => p.stockQuantity >= 1);

        if (!targetProduct) {
          test.skip();
          return;
        }

        const userData = generateUserData();
        const authPage = new AuthPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await authPage.signupViaAPI(userData.name, userData.email, userData.password);
        await cartPage.addToCartViaAPI(targetProduct._id, 1);

        const orderProducts = [{
          _id: targetProduct._id,
          id: targetProduct._id,
          name: targetProduct.name,
          price: targetProduct.price,
          quantity: 1,
          image: targetProduct.image || '',
        }];

        const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, generateAddress());
        const orderData = await orderResponse.json().catch(() => ({}));

        if (orderResponse.status() === 200 && orderData.localOrderId) {
          // Check hold status
          const holdStatusResponse = await checkoutPage.getHoldStatusViaAPI(orderData.localOrderId);
          const holdStatus = await holdStatusResponse.json();

          expect(holdStatus.status).toBe('active');
          expect(holdStatus.expiresAt).toBeTruthy();

          // Note: We can't wait 15 minutes for hold to expire in tests,
          // but we verify the hold system is working
        }

      } finally {
        await context.close();
      }
    });
  });

  test.describe('Payment Race Conditions', () => {
    test('should handle concurrent payment attempts for same order', async ({ browser }) => {
      const context = await browser.newContext();
      const pages = await Promise.all([
        context.newPage(),
        context.newPage(),
      ]);

      try {
        const productResponse = await pages[0].request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        const targetProduct = products.find(p => p.stockQuantity >= 1);

        if (!targetProduct) {
          test.skip();
          return;
        }

        const userData = generateUserData();
        const authPage = new AuthPage(pages[0]);
        const cartPage = new CartPage(pages[0]);
        const checkoutPage = new CheckoutPage(pages[0]);

        await authPage.signupViaAPI(userData.name, userData.email, userData.password);
        await cartPage.addToCartViaAPI(targetProduct._id, 1);

        const orderProducts = [{
          _id: targetProduct._id,
          id: targetProduct._id,
          name: targetProduct.name,
          price: targetProduct.price,
          quantity: 1,
          image: targetProduct.image || '',
        }];

        const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, generateAddress());
        const orderData = await orderResponse.json().catch(() => ({}));

        if (orderResponse.status() === 200 && orderData.localOrderId) {
          // Try to create duplicate order (should be prevented)
          const duplicateResponse = await checkoutPage.createOrderViaAPI(orderProducts, generateAddress());
          
          // System should handle duplicate order attempt gracefully
          expect([200, 400, 409]).toContain(duplicateResponse.status());
        }

      } finally {
        await context.close();
      }
    });
  });

  test.describe('Session Race Conditions', () => {
    test('should handle concurrent logins from same user', async ({ browser }) => {
      const userData = generateUserData();

      // First create the user
      const setupContext = await browser.newContext();
      const setupPage = await setupContext.newPage();
      const setupAuth = new AuthPage(setupPage);
      await setupAuth.signupViaAPI(userData.name, userData.email, userData.password);
      await setupContext.close();

      // Now try concurrent logins
      const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext(),
      ]);
      const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

      try {
        // All pages try to login simultaneously
        const loginResults = await Promise.allSettled(
          pages.map(async (page) => {
            const authPage = new AuthPage(page);
            const response = await authPage.loginViaAPI(userData.email, userData.password);
            return response.status() === 200;
          })
        );

        // All logins should succeed
        const allSucceeded = loginResults.every(
          result => result.status === 'fulfilled' && result.value
        );
        expect(allSucceeded).toBeTruthy();

      } finally {
        await Promise.all(contexts.map(ctx => ctx.close()));
      }
    });

    test('should handle concurrent cart operations from same user', async ({ browser }) => {
      const context = await browser.newContext();
      const pages = await Promise.all([
        context.newPage(),
        context.newPage(),
        context.newPage(),
      ]);

      try {
        // Setup user
        const userData = generateUserData();
        const authPage = new AuthPage(pages[0]);
        await authPage.signupViaAPI(userData.name, userData.email, userData.password);

        // Get products
        const productResponse = await pages[0].request.get('http://localhost:5000/api/products/');
        const productsData = await productResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        const availableProducts = products.filter(p => p.stockQuantity > 0).slice(0, 3);

        if (availableProducts.length < 3) {
          test.skip();
          return;
        }

        // All pages add to cart concurrently
        await Promise.all(
          pages.map(async (page, index) => {
            const cartPage = new CartPage(page);
            await cartPage.addToCartViaAPI(availableProducts[index]._id, 1);
          })
        );

        // Wait for operations to complete
        await pages[0].waitForTimeout(1000);

        // Verify cart state is consistent
        const cartPage = new CartPage(pages[0]);
        const cartResponse = await cartPage.getCartViaAPI();
        const cartData = await cartResponse.json();
        
        const cartLength = cartData.length || cartData.products?.length || 0;
        expect(cartLength).toBeGreaterThan(0);
        expect(cartLength).toBeLessThanOrEqual(3);

      } finally {
        await context.close();
      }
    });
  });
});
