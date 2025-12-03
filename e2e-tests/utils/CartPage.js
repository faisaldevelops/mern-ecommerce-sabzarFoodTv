/**
 * Page Object Model for cart operations
 */

export class CartPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation
  async goToCart() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async goToHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  // Cart actions
  async addToCart(productIndex = 0) {
    const addButton = this.page.locator('button:has-text("Add to cart"), button:has-text("Add to Cart")').nth(productIndex);
    await addButton.click();
    await this.page.waitForTimeout(500); // Wait for cart update
  }

  async addToCartByName(productName) {
    const productCard = this.page.locator(`[data-testid="product-card"]:has-text("${productName}")`).first();
    const addButton = productCard.locator('button:has-text("Add to cart"), button:has-text("Add to Cart")');
    await addButton.click();
    await this.page.waitForTimeout(500);
  }

  async removeFromCart(itemIndex = 0) {
    await this.goToCart();
    const removeButton = this.page.locator('button:has-text("Remove"), svg[class*="trash"]').nth(itemIndex);
    await removeButton.click();
    await this.page.waitForTimeout(500);
  }

  async updateQuantity(itemIndex, quantity) {
    await this.goToCart();
    
    // Try to find quantity input or +/- buttons
    const quantityInput = this.page.locator('input[type="number"]').nth(itemIndex);
    
    try {
      await quantityInput.fill(quantity.toString());
    } catch {
      // If direct input doesn't work, try clicking +/- buttons
      const currentQty = parseInt(await quantityInput.inputValue());
      const diff = quantity - currentQty;
      
      if (diff > 0) {
        const increaseButton = this.page.locator('button:has-text("+")').nth(itemIndex);
        for (let i = 0; i < diff; i++) {
          await increaseButton.click();
          await this.page.waitForTimeout(200);
        }
      } else if (diff < 0) {
        const decreaseButton = this.page.locator('button:has-text("-")').nth(itemIndex);
        for (let i = 0; i < Math.abs(diff); i++) {
          await decreaseButton.click();
          await this.page.waitForTimeout(200);
        }
      }
    }
    
    await this.page.waitForTimeout(500); // Wait for cart update
  }

  async clearCart() {
    await this.goToCart();
    
    // Click remove button for all items
    const removeButtons = this.page.locator('button:has-text("Remove"), svg[class*="trash"]');
    const count = await removeButtons.count();
    
    for (let i = 0; i < count; i++) {
      await removeButtons.first().click();
      await this.page.waitForTimeout(500);
    }
  }

  async proceedToCheckout() {
    await this.goToCart();
    const checkoutButton = this.page.locator('button:has-text("Checkout"), button:has-text("Proceed to checkout")');
    await checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Cart state
  async getCartItemCount() {
    const badge = this.page.locator('[data-testid="cart-badge"], .cart-badge, .badge');
    try {
      const text = await badge.textContent();
      return parseInt(text) || 0;
    } catch {
      return 0;
    }
  }

  async getCartItems() {
    await this.goToCart();
    const items = this.page.locator('[data-testid="cart-item"], .cart-item');
    const count = await items.count();
    
    const cartItems = [];
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = await item.locator('[data-testid="product-name"], .product-name, h3, h4').textContent();
      const priceText = await item.locator('[data-testid="product-price"], .price').textContent();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      
      let quantity = 1;
      try {
        const qtyInput = item.locator('input[type="number"]');
        quantity = parseInt(await qtyInput.inputValue());
      } catch {
        // Fallback to text content
        const qtyText = await item.locator('[data-testid="quantity"], .quantity').textContent();
        quantity = parseInt(qtyText) || 1;
      }
      
      cartItems.push({ name: name?.trim(), price, quantity });
    }
    
    return cartItems;
  }

  async getTotalPrice() {
    await this.goToCart();
    const totalElement = this.page.locator('[data-testid="total-price"], .total-price, .total').last();
    const text = await totalElement.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async isCartEmpty() {
    await this.goToCart();
    try {
      await this.page.waitForSelector(':has-text("empty"), :has-text("Empty"), :has-text("No items")', {
        timeout: 3000
      });
      return true;
    } catch {
      return false;
    }
  }

  // API operations for faster setup
  async addToCartViaAPI(productId, quantity = 1) {
    const { getApiURL } = await import('./helpers.js');
    const apiURL = getApiURL(this.page);
    const response = await this.page.request.post(`${apiURL}/cart`, {
      data: { productId, quantity },
    });
    return response;
  }

  async clearCartViaAPI() {
    const { getApiURL } = await import('./helpers.js');
    const apiURL = getApiURL(this.page);
    const response = await this.page.request.delete(`${apiURL}/cart`);
    return response;
  }

  async getCartViaAPI() {
    const { getApiURL } = await import('./helpers.js');
    const apiURL = getApiURL(this.page);
    const response = await this.page.request.get(`${apiURL}/cart`);
    return response;
  }

  // Local storage operations
  async getLocalStorageCart() {
    const cartData = await this.page.evaluate(() => {
      return localStorage.getItem('cart-storage');
    });
    return cartData ? JSON.parse(cartData) : null;
  }

  async setLocalStorageCart(cartData) {
    await this.page.evaluate((data) => {
      localStorage.setItem('cart-storage', JSON.stringify(data));
    }, cartData);
  }
}

export default CartPage;
