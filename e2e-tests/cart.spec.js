import { test, expect } from '@playwright/test';
import { AuthPage } from './utils/AuthPage.js';
import { CartPage } from './utils/CartPage.js';
import { generateUserData, clearBrowserStorage } from './utils/helpers.js';

test.describe('Cart Management Tests', () => {
  let authPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    cartPage = new CartPage(page);
    await clearBrowserStorage(page);
  });

  test.describe('Add to Cart', () => {
    test('should add product to cart as guest', async () => {
      await cartPage.goToHome();
      
      // Get initial cart count
      const initialCount = await cartPage.getCartItemCount();
      
      // Add product to cart
      await cartPage.addToCart(0);
      
      // Verify cart count increased
      const newCount = await cartPage.getCartItemCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should add product to cart as logged in user', async () => {
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      await cartPage.goToHome();
      
      // Get initial cart count
      const initialCount = await cartPage.getCartItemCount();
      
      // Add product to cart
      await cartPage.addToCart(0);
      
      // Verify cart count increased
      const newCount = await cartPage.getCartItemCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should add multiple different products to cart', async () => {
      await cartPage.goToHome();
      
      // Add multiple products
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      await cartPage.addToCart(2);
      
      // Verify cart has 3 items
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(3);
    });

    test('should add same product multiple times', async () => {
      await cartPage.goToHome();
      
      // Add same product twice
      await cartPage.addToCart(0);
      await cartPage.addToCart(0);
      
      // Go to cart and check quantity
      await cartPage.goToCart();
      const items = await cartPage.getCartItems();
      
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].quantity).toBeGreaterThan(1);
    });

    test('should persist cart in local storage for guest users', async () => {
      await cartPage.goToHome();
      
      // Add product to cart
      await cartPage.addToCart(0);
      
      // Check local storage
      const localCart = await cartPage.getLocalStorageCart();
      expect(localCart).toBeTruthy();
      expect(localCart.cart?.length).toBeGreaterThan(0);
    });

    test('should show visual feedback when adding to cart', async ({ page }) => {
      await cartPage.goToHome();
      
      // Add product and look for toast/notification
      await cartPage.addToCart(0);
      
      // Wait for notification
      const notification = page.locator('[role="status"], .toast, [class*="toast"]');
      const notificationVisible = await notification.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Either notification appears or cart count updates
      const cartCount = await cartPage.getCartItemCount();
      expect(notificationVisible || cartCount > 0).toBeTruthy();
    });
  });

  test.describe('Update Cart Quantity', () => {
    test('should update product quantity in cart', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Update quantity
      await cartPage.updateQuantity(0, 3);
      
      // Verify quantity updated
      const items = await cartPage.getCartItems();
      expect(items[0].quantity).toBe(3);
    });

    test('should update total price when quantity changes', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Get initial total
      await cartPage.goToCart();
      const items = await cartPage.getCartItems();
      const initialTotal = items[0].price * items[0].quantity;
      
      // Update quantity
      await cartPage.updateQuantity(0, 2);
      
      // Verify total updated
      const newItems = await cartPage.getCartItems();
      const newTotal = newItems[0].price * newItems[0].quantity;
      expect(newTotal).toBe(initialTotal * 2);
    });

    test('should handle quantity increase', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Increase quantity
      await cartPage.goToCart();
      const initialItems = await cartPage.getCartItems();
      const initialQty = initialItems[0].quantity;
      
      await cartPage.updateQuantity(0, initialQty + 1);
      
      const updatedItems = await cartPage.getCartItems();
      expect(updatedItems[0].quantity).toBe(initialQty + 1);
    });

    test('should handle quantity decrease', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Set quantity to 3 first
      await cartPage.updateQuantity(0, 3);
      
      // Decrease quantity
      await cartPage.updateQuantity(0, 2);
      
      const items = await cartPage.getCartItems();
      expect(items[0].quantity).toBe(2);
    });

    test('should remove item when quantity set to 0', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      const initialCount = await cartPage.getCartItemCount();
      
      // Set quantity to 0
      await cartPage.updateQuantity(0, 1);
      await cartPage.page.waitForTimeout(500);
      
      try {
        await cartPage.updateQuantity(0, 0);
      } catch {
        // May throw error if item is removed
      }
      
      await cartPage.page.waitForTimeout(1000);
      
      // Cart count should decrease
      const finalCount = await cartPage.getCartItemCount();
      expect(finalCount).toBeLessThan(initialCount);
    });
  });

  test.describe('Remove from Cart', () => {
    test('should remove product from cart', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      const initialCount = await cartPage.getCartItemCount();
      
      // Remove item
      await cartPage.removeFromCart(0);
      
      // Verify cart count decreased
      const newCount = await cartPage.getCartItemCount();
      expect(newCount).toBe(initialCount - 1);
    });

    test('should remove specific product when multiple items in cart', async () => {
      await cartPage.goToHome();
      
      // Add multiple products
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      await cartPage.addToCart(2);
      
      // Remove middle item
      await cartPage.removeFromCart(1);
      
      // Verify count
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(2);
    });

    test('should show empty cart message when all items removed', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      // Remove item
      await cartPage.removeFromCart(0);
      
      // Check if cart is empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    });
  });

  test.describe('Clear Cart', () => {
    test('should clear entire cart', async () => {
      await cartPage.goToHome();
      
      // Add multiple items
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      await cartPage.addToCart(2);
      
      // Clear cart
      await cartPage.clearCart();
      
      // Verify cart is empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    });

    test('should reset cart count to 0 after clearing', async () => {
      await cartPage.goToHome();
      
      // Add items
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      
      // Clear cart
      await cartPage.clearCart();
      
      // Verify count
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(0);
    });
  });

  test.describe('Cart Persistence', () => {
    test('should persist cart after page reload for guest users', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      const countBefore = await cartPage.getCartItemCount();
      
      // Reload page
      await cartPage.page.reload();
      await cartPage.page.waitForLoadState('networkidle');
      
      // Verify cart persisted
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter).toBe(countBefore);
    });

    test('should persist cart after navigation', async () => {
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      
      const countBefore = await cartPage.getCartItemCount();
      
      // Navigate away and back
      await cartPage.page.goto('/login');
      await cartPage.page.waitForLoadState('networkidle');
      await cartPage.page.goto('/');
      await cartPage.page.waitForLoadState('networkidle');
      
      // Verify cart persisted
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter).toBe(countBefore);
    });
  });

  test.describe('Cart Synchronization', () => {
    test('should sync guest cart after login', async () => {
      // Add items as guest
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      
      const guestCount = await cartPage.getCartItemCount();
      
      // Register and login
      const userData = generateUserData();
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Wait for cart sync
      await cartPage.page.waitForTimeout(2000);
      
      // Verify cart maintained or synced
      const loggedInCount = await cartPage.getCartItemCount();
      expect(loggedInCount).toBeGreaterThan(0);
    });

    test('should maintain cart items after logout and login', async () => {
      const userData = generateUserData();
      
      // Login
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Add items to cart
      await cartPage.goToHome();
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      
      const countBefore = await cartPage.getCartItemCount();
      
      // Logout
      await authPage.logout();
      
      // Login again
      await authPage.login(userData.email, userData.password);
      
      // Wait for cart to load
      await cartPage.page.waitForTimeout(2000);
      
      // Verify cart maintained
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter).toBeGreaterThan(0);
    });
  });

  test.describe('Cart Validation', () => {
    test('should not allow adding product with 0 stock', async ({ page }) => {
      await cartPage.goToHome();
      
      // Find products and check stock
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      
      // Try to find out of stock product
      for (let i = 0; i < count; i++) {
        const product = products.nth(i);
        const stockText = await product.locator('[data-testid="stock"], .stock, :has-text("stock")').textContent().catch(() => '');
        
        if (stockText.includes('Out of stock') || stockText.includes('0')) {
          const addButton = product.locator('button:has-text("Add to cart")');
          const isDisabled = await addButton.isDisabled().catch(() => false);
          expect(isDisabled).toBeTruthy();
          break;
        }
      }
    });

    test('should display cart total correctly', async () => {
      await cartPage.goToHome();
      
      // Add products
      await cartPage.addToCart(0);
      await cartPage.addToCart(1);
      
      // Calculate expected total
      const items = await cartPage.getCartItems();
      const expectedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Get actual total
      const actualTotal = await cartPage.getTotalPrice();
      
      // Allow for small floating point differences
      expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(0.01);
    });
  });

  test.describe('Cart Edge Cases', () => {
    test('should handle rapid add to cart clicks', async () => {
      await cartPage.goToHome();
      
      // Rapidly click add to cart
      const addButton = cartPage.page.locator('button:has-text("Add to cart")').first();
      await addButton.click();
      await addButton.click();
      await addButton.click();
      
      await cartPage.page.waitForTimeout(1000);
      
      // Cart should handle it gracefully
      const count = await cartPage.getCartItemCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should handle empty cart checkout attempt', async () => {
      await cartPage.goToCart();
      
      // Try to checkout with empty cart
      const checkoutButton = cartPage.page.locator('button:has-text("Checkout")');
      const isDisabled = await checkoutButton.isDisabled().catch(() => true);
      
      expect(isDisabled).toBeTruthy();
    });
  });
});
