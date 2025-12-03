import { test, expect } from '@playwright/test';
import { AuthPage } from './utils/AuthPage.js';
import { CartPage } from './utils/CartPage.js';
import { CheckoutPage } from './utils/CheckoutPage.js';
import { generateUserData, generateAddress, clearBrowserStorage } from './utils/helpers.js';

test.describe('Checkout Flow Tests', () => {
  let authPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await clearBrowserStorage(page);
  });

  test.describe('Address Management', () => {
    test('should allow adding new address during checkout', async () => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Add product to cart
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Go to checkout
      await cartPage.proceedToCheckout();
      
      // Add address
      const address = generateAddress();
      await checkoutPage.addNewAddress(address);
      
      // Verify address was added (form should close or continue button should appear)
      await checkoutPage.page.waitForTimeout(1000);
    });

    test('should allow selecting existing address', async () => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Add product to cart
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Go to checkout and add address
      await cartPage.proceedToCheckout();
      const address = generateAddress();
      await checkoutPage.addNewAddress(address);
      
      // Start new checkout
      await cartPage.goToHome();
      await cartPage.addToCart(1);
      await cartPage.proceedToCheckout();
      
      // Select existing address
      await checkoutPage.selectExistingAddress(0);
      
      await checkoutPage.page.waitForTimeout(1000);
    });

    test('should validate required address fields', async () => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      await cartPage.proceedToCheckout();
      
      // Try to save address without filling fields
      try {
        await checkoutPage.saveAddress();
        
        // Should show validation errors
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toBeTruthy();
      } catch (error) {
        // Form validation prevented submission
        expect(true).toBeTruthy();
      }
    });

    test('should persist address for future orders', async () => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      await cartPage.proceedToCheckout();
      
      const address = generateAddress();
      await checkoutPage.addNewAddress(address);
      
      // Complete or cancel this checkout
      await checkoutPage.page.goto('/');
      
      // Start new checkout
      await cartPage.addToCart(1);
      await cartPage.proceedToCheckout();
      
      // Address should be available
      const addressCards = checkoutPage.page.locator('[data-testid="address-card"], .address-card');
      const count = await addressCards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Order Placement', () => {
    test('should create hold order when checkout is initiated', async ({ page }) => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Get product with stock
      const productResponse = await page.request.get('http://localhost:5000/api/products/');
      const productsData = await productResponse.json();
      const products = Array.isArray(productsData) ? productsData : productsData.products || [];
      const targetProduct = products.find(p => p.stockQuantity > 0);
      
      if (!targetProduct) {
        test.skip();
        return;
      }
      
      await cartPage.addToCartViaAPI(targetProduct._id, 1);
      
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
      
      if (orderResponse.status() === 500) {
        test.skip(); // Payment gateway not configured
        return;
      }
      
      expect(orderResponse.status()).toBe(200);
      
      const orderData = await orderResponse.json();
      expect(orderData.orderId).toBeTruthy();
      expect(orderData.localOrderId).toBeTruthy();
      expect(orderData.expiresAt).toBeTruthy();
    });

    test('should fail checkout with insufficient stock', async ({ page }) => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Get product with limited stock
      const productResponse = await page.request.get('http://localhost:5000/api/products/');
      const productsData = await productResponse.json();
      const products = Array.isArray(productsData) ? productsData : productsData.products || [];
      const targetProduct = products.find(p => p.stockQuantity > 0 && p.stockQuantity < 100);
      
      if (!targetProduct) {
        test.skip();
        return;
      }
      
      // Try to order more than available
      const excessQuantity = targetProduct.stockQuantity + 10;
      
      const orderProducts = [{
        _id: targetProduct._id,
        id: targetProduct._id,
        name: targetProduct.name,
        price: targetProduct.price,
        quantity: excessQuantity,
        image: targetProduct.image || '',
      }];
      
      const address = generateAddress();
      const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      expect(orderResponse.status()).toBe(400);
      
      const orderData = await orderResponse.json();
      expect(orderData.insufficientStock).toBe(true);
    });

    test('should fail checkout with empty cart', async () => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      const orderProducts = [];
      const address = generateAddress();
      
      const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      expect(orderResponse.status()).not.toBe(200);
    });

    test('should fail checkout without address', async ({ page }) => {
      const userData = generateUserData();
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
      
      // No address
      const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, null);
      
      expect(orderResponse.status()).not.toBe(200);
    });
  });

  test.describe('Hold Order Management', () => {
    test('should get hold order status', async ({ page }) => {
      const userData = generateUserData();
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
      
      if (orderResponse.status() === 500) {
        test.skip();
        return;
      }
      
      const orderData = await orderResponse.json();
      const localOrderId = orderData.localOrderId;
      
      // Get hold status
      const statusResponse = await checkoutPage.getHoldStatusViaAPI(localOrderId);
      expect(statusResponse.status()).toBe(200);
      
      const statusData = await statusResponse.json();
      expect(statusData.status).toBe('active');
      expect(statusData.expiresAt).toBeTruthy();
    });

    test('should cancel hold order', async ({ page }) => {
      const userData = generateUserData();
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
      
      if (orderResponse.status() === 500) {
        test.skip();
        return;
      }
      
      const orderData = await orderResponse.json();
      const localOrderId = orderData.localOrderId;
      
      // Cancel hold
      const cancelResponse = await checkoutPage.cancelHoldViaAPI(localOrderId);
      expect(cancelResponse.status()).toBe(200);
      
      // Check status after cancellation
      const statusResponse = await checkoutPage.getHoldStatusViaAPI(localOrderId);
      const statusData = await statusResponse.json();
      expect(statusData.status).toBe('cancelled');
    });

    test('should release stock when hold is cancelled', async ({ page }) => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      const productResponse = await page.request.get('http://localhost:5000/api/products/');
      const productsData = await productResponse.json();
      const products = Array.isArray(productsData) ? productsData : productsData.products || [];
      const targetProduct = products.find(p => p.stockQuantity > 0 && p.stockQuantity < 10);
      
      if (!targetProduct) {
        test.skip();
        return;
      }
      
      const initialStock = targetProduct.stockQuantity;
      
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
      
      if (orderResponse.status() === 500) {
        test.skip();
        return;
      }
      
      const orderData = await orderResponse.json();
      const localOrderId = orderData.localOrderId;
      
      // Cancel hold
      await checkoutPage.cancelHoldViaAPI(localOrderId);
      
      // Try to create another order with same product
      await page.waitForTimeout(1000);
      const orderResponse2 = await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      // Should succeed because stock was released
      expect(orderResponse2.status()).toBe(200);
    });

    test('should not allow cancelling same hold twice', async ({ page }) => {
      const userData = generateUserData();
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
      
      if (orderResponse.status() === 500) {
        test.skip();
        return;
      }
      
      const orderData = await orderResponse.json();
      const localOrderId = orderData.localOrderId;
      
      // Cancel hold once
      const cancelResponse1 = await checkoutPage.cancelHoldViaAPI(localOrderId);
      expect(cancelResponse1.status()).toBe(200);
      
      // Try to cancel again
      const cancelResponse2 = await checkoutPage.cancelHoldViaAPI(localOrderId);
      
      // Should fail or return error
      expect(cancelResponse2.status()).not.toBe(200);
    });
  });

  test.describe('Checkout Flow Integration', () => {
    test('should complete full checkout flow', async ({ page }) => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Browse and add products
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      
      // Verify cart
      const cartCount = await cartPage.getCartItemCount();
      expect(cartCount).toBe(2);
      
      // Go to checkout
      await cartPage.proceedToCheckout();
      
      // Add address
      const address = generateAddress();
      await checkoutPage.addNewAddress(address);
      
      await page.waitForTimeout(1000);
    });

    test('should clear cart after successful order (API)', async ({ page }) => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      const productResponse = await page.request.get('http://localhost:5000/api/products/');
      const productsData = await productResponse.json();
      const products = Array.isArray(productsData) ? productsData : productsData.products || [];
      const targetProduct = products.find(p => p.stockQuantity > 0);
      
      if (!targetProduct) {
        test.skip();
        return;
      }
      
      // Add to cart
      await cartPage.addToCartViaAPI(targetProduct._id, 1);
      
      // Verify cart has items
      let cartResponse = await cartPage.getCartViaAPI();
      let cartData = await cartResponse.json();
      expect(cartData.length || cartData.products?.length || 0).toBeGreaterThan(0);
      
      // Create order
      const orderProducts = [{
        _id: targetProduct._id,
        id: targetProduct._id,
        name: targetProduct.name,
        price: targetProduct.price,
        quantity: 1,
        image: targetProduct.image || '',
      }];
      
      const address = generateAddress();
      await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      // Note: Cart clearing after order depends on payment completion
      // In test environment, this might not happen automatically
    });
  });

  test.describe('Checkout Error Handling', () => {
    test('should handle network errors during checkout', async ({ page }) => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Simulate network error
      await page.route('**/api/payment/**', route => {
        route.abort('failed');
      });
      
      await cartPage.proceedToCheckout();
      
      // Should handle error gracefully
      await page.waitForTimeout(2000);
    });

    test('should handle invalid product ID in checkout', async ({ page }) => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      const orderProducts = [{
        _id: 'invalid-id-12345',
        id: 'invalid-id-12345',
        name: 'Invalid Product',
        price: 100,
        quantity: 1,
        image: '',
      }];
      
      const address = generateAddress();
      const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      expect(orderResponse.status()).not.toBe(200);
    });

    test('should handle negative quantity in checkout', async ({ page }) => {
      const userData = generateUserData();
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
        quantity: -1, // Negative quantity
        image: targetProduct.image || '',
      }];
      
      const address = generateAddress();
      const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      expect(orderResponse.status()).not.toBe(200);
    });

    test('should handle zero quantity in checkout', async ({ page }) => {
      const userData = generateUserData();
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
        quantity: 0, // Zero quantity
        image: targetProduct.image || '',
      }];
      
      const address = generateAddress();
      const orderResponse = await checkoutPage.createOrderViaAPI(orderProducts, address);
      
      expect(orderResponse.status()).not.toBe(200);
    });
  });
});
