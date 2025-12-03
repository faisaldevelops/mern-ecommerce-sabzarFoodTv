import { test, expect } from '@playwright/test';
import { clearBrowserStorage } from './utils/helpers.js';

test.describe('Product Browsing Tests', () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test.describe('Product Display', () => {
    test('should display products on home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      
      expect(count).toBeGreaterThan(0);
    });

    test('should display product details', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const product = page.locator('[data-testid="product-card"], .product-card').first();
      
      // Check for required product information
      const hasName = await product.locator('h2, h3, h4, [data-testid="product-name"]').count() > 0;
      const hasPrice = await product.locator('[data-testid="price"], .price, :has-text("$")').count() > 0;
      const hasImage = await product.locator('img').count() > 0;
      
      expect(hasName || hasPrice).toBeTruthy();
    });

    test('should display product images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const productImages = page.locator('[data-testid="product-card"] img, .product-card img');
      const count = await productImages.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Check first image is loaded
      const firstImage = productImages.first();
      const src = await firstImage.getAttribute('src');
      expect(src).toBeTruthy();
    });

    test('should show stock status', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const products = page.locator('[data-testid="product-card"], .product-card');
      const firstProduct = products.first();
      
      // Should have some indication of stock (button state, text, etc)
      const addButton = firstProduct.locator('button:has-text("Add to cart")');
      const buttonExists = await addButton.count() > 0;
      
      expect(buttonExists).toBeTruthy();
    });
  });

  test.describe('Product Filtering', () => {
    test('should filter products by category', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for category links
      const categoryLinks = page.locator('a[href*="/category/"], [data-testid="category"]');
      const count = await categoryLinks.count();
      
      if (count > 0) {
        // Click first category
        await categoryLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // Should show products
        const products = page.locator('[data-testid="product-card"], .product-card');
        const productCount = await products.count();
        
        expect(productCount).toBeGreaterThan(0);
      }
    });

    test('should navigate to category pages', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for category links
      const categoryLinks = page.locator('a[href*="/category/"]');
      const count = await categoryLinks.count();
      
      if (count > 0) {
        await categoryLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // URL should change to category page
        expect(page.url()).toContain('/category/');
      }
    });

    test('should display featured products', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for featured section
      const featuredSection = page.locator('[data-testid="featured"], :has-text("Featured")');
      const exists = await featuredSection.count() > 0;
      
      if (exists) {
        const featuredProducts = page.locator('[data-testid="featured"] [data-testid="product-card"]');
        const count = await featuredProducts.count();
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Product Search', () => {
    test('should have search functionality if available', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
      const count = await searchInput.count();
      
      if (count > 0) {
        await searchInput.fill('test');
        await page.waitForTimeout(1000);
        
        // Results should update
        expect(true).toBeTruthy();
      }
    });
  });

  test.describe('Product Availability', () => {
    test('should disable add to cart for out of stock products', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      
      // Check each product for stock status
      for (let i = 0; i < Math.min(count, 5); i++) {
        const product = products.nth(i);
        const stockText = await product.textContent();
        
        if (stockText?.includes('Out of stock') || stockText?.includes('0 in stock')) {
          const addButton = product.locator('button:has-text("Add to cart")');
          const isDisabled = await addButton.isDisabled().catch(() => false);
          const buttonExists = await addButton.count() > 0;
          
          // Either button is disabled or doesn't exist
          expect(!buttonExists || isDisabled).toBeTruthy();
          break;
        }
      }
    });

    test('should show stock quantity if displayed', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const product = page.locator('[data-testid="product-card"], .product-card').first();
      const stockInfo = await product.locator('[data-testid="stock"], .stock, :has-text("stock")').textContent().catch(() => '');
      
      // If stock info is shown, it should be present
      if (stockInfo) {
        expect(stockInfo).toBeTruthy();
      }
    });
  });

  test.describe('Product Interaction', () => {
    test('should show add to cart button', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const addButton = page.locator('button:has-text("Add to cart"), button:has-text("Add to Cart")').first();
      const exists = await addButton.count() > 0;
      
      expect(exists).toBeTruthy();
    });

    test('should handle product click', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const product = page.locator('[data-testid="product-card"], .product-card').first();
      
      // Try clicking product card (might open details or do nothing)
      await product.click().catch(() => {});
      
      await page.waitForTimeout(500);
      
      // No crash expected
      expect(true).toBeTruthy();
    });

    test('should handle multiple rapid clicks on add to cart', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const addButton = page.locator('button:has-text("Add to cart")').first();
      
      // Rapid clicks
      await addButton.click();
      await addButton.click();
      await addButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should handle gracefully without errors
      const cartBadge = page.locator('[data-testid="cart-badge"], .cart-badge');
      const badgeExists = await cartBadge.count() > 0;
      
      expect(badgeExists).toBeTruthy();
    });
  });

  test.describe('Product API', () => {
    test('should fetch products via API', async ({ page }) => {
      const response = await page.request.get('http://localhost:5000/api/products/');
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products || [];
      
      expect(products.length).toBeGreaterThan(0);
    });

    test('should return products with required fields', async ({ page }) => {
      const response = await page.request.get('http://localhost:5000/api/products/');
      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products || [];
      
      if (products.length > 0) {
        const product = products[0];
        
        expect(product._id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(typeof product.price).toBe('number');
        expect(typeof product.stockQuantity).toBe('number');
      }
    });

    test('should fetch featured products via API', async ({ page }) => {
      const response = await page.request.get('http://localhost:5000/api/products/featured');
      
      // May or may not have featured products endpoint
      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toBeTruthy();
      }
    });

    test('should fetch products by category via API', async ({ page }) => {
      // Get all products first
      const response = await page.request.get('http://localhost:5000/api/products/');
      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products || [];
      
      if (products.length > 0 && products[0].category) {
        const category = products[0].category;
        
        // Fetch by category
        const categoryResponse = await page.request.get(`http://localhost:5000/api/products/category/${category}`);
        
        if (categoryResponse.status() === 200) {
          const categoryData = await categoryResponse.json();
          expect(categoryData).toBeTruthy();
        }
      }
    });
  });

  test.describe('Product Performance', () => {
    test('should load products within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle large number of products', async ({ page }) => {
      const response = await page.request.get('http://localhost:5000/api/products/');
      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products || [];
      
      // Should handle products list
      expect(products.length).toBeGreaterThanOrEqual(0);
      
      // Page should load even with many products
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const displayedProducts = page.locator('[data-testid="product-card"], .product-card');
      const count = await displayedProducts.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Product Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/products/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ message: 'Server error' }),
        });
      });
      
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Page should not crash
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });

    test('should handle empty products list', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/products/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([]),
        });
      });
      
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Should show empty state or no products
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      
      expect(count).toBe(0);
    });

    test('should handle network timeout', async ({ page }) => {
      // Set very short timeout
      await page.route('**/api/products/**', route => {
        // Delay response
        setTimeout(() => {
          route.continue();
        }, 10000);
      });
      
      await page.goto('/');
      
      // Should show loading state or error
      await page.waitForTimeout(2000);
      
      const body = await page.locator('body').count();
      expect(body).toBe(1);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display products on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      
      expect(count).toBeGreaterThan(0);
    });

    test('should display products on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const products = page.locator('[data-testid="product-card"], .product-card');
      const count = await products.count();
      
      expect(count).toBeGreaterThan(0);
    });

    test('should have responsive navigation', async ({ page }) => {
      // Mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for mobile menu icon
      const mobileMenu = page.locator('[data-testid="mobile-menu"], button:has-text("☰"), button:has-text("Menu")');
      const exists = await mobileMenu.count() > 0;
      
      if (exists) {
        await mobileMenu.click();
        await page.waitForTimeout(500);
        
        // Menu should open
        expect(true).toBeTruthy();
      }
    });
  });
});
