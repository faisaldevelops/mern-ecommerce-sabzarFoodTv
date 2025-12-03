import { test, expect } from '@playwright/test';
import { AuthPage } from './utils/AuthPage.js';
import { generateUserData, clearBrowserStorage } from './utils/helpers.js';

test.describe('Authentication Tests', () => {
  let authPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await clearBrowserStorage(page);
  });

  test.describe('User Registration', () => {
    test('should successfully register a new user', async () => {
      const userData = generateUserData();
      
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Should be logged in after registration
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();
      
      // Should redirect to home page
      expect(authPage.page.url()).toContain('/');
    });

    test('should fail to register with existing email', async () => {
      const userData = generateUserData();
      
      // Register first time
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Logout
      await authPage.logout();
      
      // Try to register again with same email
      await authPage.signup('Different Name', userData.email, userData.password);
      
      // Should show error message
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });

    test('should fail to register with invalid email', async () => {
      const userData = generateUserData();
      
      await authPage.goToSignup();
      await authPage.page.fill('input[name="name"], input[placeholder*="name" i]', userData.name);
      await authPage.page.fill('input[type="email"]', 'invalid-email');
      await authPage.page.fill('input[type="password"]', userData.password);
      await authPage.page.fill('input[name="confirmPassword"], input[placeholder*="confirm" i]', userData.password);
      await authPage.page.click('button[type="submit"]');
      
      // Should show validation error
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });

    test('should fail to register with mismatched passwords', async () => {
      const userData = generateUserData();
      
      await authPage.goToSignup();
      await authPage.page.fill('input[name="name"], input[placeholder*="name" i]', userData.name);
      await authPage.page.fill('input[type="email"]', userData.email);
      await authPage.page.fill('input[type="password"]', userData.password);
      await authPage.page.fill('input[name="confirmPassword"], input[placeholder*="confirm" i]', 'DifferentPassword123');
      await authPage.page.click('button[type="submit"]');
      
      // Should show validation error
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });

    test('should fail to register with weak password', async () => {
      const userData = generateUserData();
      
      await authPage.goToSignup();
      await authPage.page.fill('input[name="name"], input[placeholder*="name" i]', userData.name);
      await authPage.page.fill('input[type="email"]', userData.email);
      await authPage.page.fill('input[type="password"]', '123');
      await authPage.page.fill('input[name="confirmPassword"], input[placeholder*="confirm" i]', '123');
      await authPage.page.click('button[type="submit"]');
      
      // Should show validation error
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });
  });

  test.describe('User Login', () => {
    test('should successfully login with valid credentials', async () => {
      const userData = generateUserData();
      
      // Register user first
      await authPage.signup(userData.name, userData.email, userData.password);
      await authPage.logout();
      
      // Login
      await authPage.login(userData.email, userData.password);
      
      // Should be logged in
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });

    test('should fail to login with wrong password', async () => {
      const userData = generateUserData();
      
      // Register user first
      await authPage.signup(userData.name, userData.email, userData.password);
      await authPage.logout();
      
      // Try to login with wrong password
      await authPage.login(userData.email, 'WrongPassword123');
      
      // Should show error
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      
      // Should not be logged in
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeFalsy();
    });

    test('should fail to login with non-existent email', async () => {
      await authPage.login('nonexistent@test.com', 'Password123');
      
      // Should show error
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      
      // Should not be logged in
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeFalsy();
    });
  });

  test.describe('User Logout', () => {
    test('should successfully logout', async () => {
      const userData = generateUserData();
      
      // Register and login
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Logout
      await authPage.logout();
      
      // Should be logged out
      const isLoggedOut = await authPage.isLoggedOut();
      expect(isLoggedOut).toBeTruthy();
    });

    test('should clear session after logout', async () => {
      const userData = generateUserData();
      
      // Register and login
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Logout
      await authPage.logout();
      
      // Try to access protected page
      await authPage.page.goto('/my-orders');
      await authPage.page.waitForLoadState('networkidle');
      
      // Should redirect to login
      expect(authPage.page.url()).toContain('/login');
    });
  });

  test.describe('Session Persistence', () => {
    test('should maintain session across page refreshes', async () => {
      const userData = generateUserData();
      
      // Register
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Refresh page
      await authPage.page.reload();
      await authPage.page.waitForLoadState('networkidle');
      
      // Should still be logged in
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });

    test('should maintain session across navigation', async () => {
      const userData = generateUserData();
      
      // Register
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Navigate to different pages
      await authPage.page.goto('/cart');
      await authPage.page.waitForLoadState('networkidle');
      
      await authPage.page.goto('/');
      await authPage.page.waitForLoadState('networkidle');
      
      // Should still be logged in
      const isLoggedIn = await authPage.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });
  });

  test.describe('Guest User Flow', () => {
    test('should allow browsing products without login', async () => {
      await authPage.page.goto('/');
      await authPage.page.waitForLoadState('networkidle');
      
      // Should be able to see products
      const products = authPage.page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should allow adding to cart without login', async () => {
      await authPage.page.goto('/');
      await authPage.page.waitForLoadState('networkidle');
      
      // Add to cart
      const addButton = authPage.page.locator('button:has-text("Add to cart")').first();
      await addButton.click();
      
      // Cart should update
      await authPage.page.waitForTimeout(1000);
      const cartBadge = authPage.page.locator('[data-testid="cart-badge"], .cart-badge, .badge');
      const badgeText = await cartBadge.textContent();
      expect(parseInt(badgeText)).toBeGreaterThan(0);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route while logged out', async () => {
      await authPage.page.goto('/my-orders');
      await authPage.page.waitForLoadState('networkidle');
      
      // Should redirect to login
      expect(authPage.page.url()).toContain('/login');
    });

    test('should allow access to protected route when logged in', async () => {
      const userData = generateUserData();
      
      // Register
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Access protected route
      await authPage.page.goto('/my-orders');
      await authPage.page.waitForLoadState('networkidle');
      
      // Should not redirect
      expect(authPage.page.url()).toContain('/my-orders');
    });

    test('should redirect admin route for non-admin users', async () => {
      const userData = generateUserData();
      
      // Register as regular user
      await authPage.signup(userData.name, userData.email, userData.password);
      
      // Try to access admin dashboard
      await authPage.page.goto('/secret-dashboard');
      await authPage.page.waitForLoadState('networkidle');
      
      // Should redirect to login or home
      expect(authPage.page.url()).not.toContain('/secret-dashboard');
    });
  });
});
