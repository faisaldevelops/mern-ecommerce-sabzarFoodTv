/**
 * Page Object Model for checkout and order operations
 */

export class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation
  async goToCheckout() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
    const checkoutButton = this.page.locator('button:has-text("Checkout"), button:has-text("Proceed to checkout")');
    await checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Address operations
  async fillAddress(address) {
    // Wait for address modal or form
    await this.page.waitForSelector('input[name="name"], input[placeholder*="name" i]', { timeout: 10000 });
    
    await this.page.fill('input[name="name"], input[placeholder*="name" i]', address.name);
    await this.page.fill('input[name="street"], input[placeholder*="street" i], input[placeholder*="address" i]', address.street);
    await this.page.fill('input[name="city"], input[placeholder*="city" i]', address.city);
    await this.page.fill('input[name="state"], input[placeholder*="state" i]', address.state);
    await this.page.fill('input[name="zipCode"], input[placeholder*="zip" i], input[placeholder*="postal" i]', address.zipCode);
    await this.page.fill('input[name="country"], input[placeholder*="country" i]', address.country);
    await this.page.fill('input[name="phoneNumber"], input[type="tel"], input[placeholder*="phone" i]', address.phoneNumber);
  }

  async selectExistingAddress(index = 0) {
    const addressCards = this.page.locator('[data-testid="address-card"], .address-card');
    await addressCards.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async saveAddress() {
    const saveButton = this.page.locator('button:has-text("Save"), button:has-text("Continue")');
    await saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addNewAddress(address) {
    // Click add address button if exists
    const addButton = this.page.locator('button:has-text("Add"), button:has-text("New Address")');
    const addButtonExists = await addButton.count() > 0;
    
    if (addButtonExists) {
      await addButton.first().click();
      await this.page.waitForTimeout(500);
    }
    
    await this.fillAddress(address);
    await this.saveAddress();
  }

  // Payment operations
  async selectPaymentMethod(method = 'stripe') {
    const methodButton = this.page.locator(`button:has-text("${method}"), input[value="${method}"]`);
    await methodButton.click();
    await this.page.waitForTimeout(500);
  }

  async fillPaymentDetails(cardDetails) {
    // This would typically involve interacting with Stripe/Razorpay iframe
    // For now, we'll just wait for the payment form
    await this.page.waitForSelector('[data-testid="payment-form"], .payment-form', { timeout: 10000 });
    
    if (cardDetails) {
      // Fill card details if provided
      await this.page.fill('input[name="cardNumber"]', cardDetails.number);
      await this.page.fill('input[name="expiry"]', cardDetails.expiry);
      await this.page.fill('input[name="cvc"]', cardDetails.cvc);
    }
  }

  async placeOrder() {
    const placeOrderButton = this.page.locator('button:has-text("Place Order"), button:has-text("Pay"), button:has-text("Confirm")');
    await placeOrderButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async completeCheckout(address, paymentMethod = 'stripe') {
    await this.goToCheckout();
    
    // Handle address
    try {
      await this.addNewAddress(address);
    } catch (error) {
      console.log('Address error:', error);
    }
    
    // Handle payment
    try {
      await this.selectPaymentMethod(paymentMethod);
      await this.placeOrder();
    } catch (error) {
      console.log('Payment error:', error);
    }
  }

  // Order confirmation
  async isOnSuccessPage() {
    await this.page.waitForTimeout(2000);
    const url = this.page.url();
    return url.includes('success') || url.includes('confirmation');
  }

  async isOnCancelPage() {
    await this.page.waitForTimeout(2000);
    const url = this.page.url();
    return url.includes('cancel') || url.includes('cancelled');
  }

  async getOrderId() {
    try {
      const orderIdElement = this.page.locator('[data-testid="order-id"], .order-id');
      const text = await orderIdElement.textContent();
      return text?.match(/[A-Za-z0-9]+/)?.[0];
    } catch {
      return null;
    }
  }

  async getOrderConfirmationMessage() {
    try {
      const message = this.page.locator('[data-testid="confirmation-message"], .confirmation, h1, h2').first();
      return await message.textContent();
    } catch {
      return null;
    }
  }

  // API operations
  async createOrderViaAPI(products, address, paymentMethod = 'razorpay') {
    const { getApiURL } = await import('./helpers.js');
    const apiURL = getApiURL(this.page);
    
    // Create Razorpay order
    const response = await this.page.request.post(`${apiURL}/payment/create-razorpay-order`, {
      data: {
        products,
        address,
      },
    });
    
    return response;
  }

  async getHoldStatusViaAPI(localOrderId) {
    const { getApiURL } = await import('./helpers.js');
    const apiURL = getApiURL(this.page);
    const response = await this.page.request.get(`${apiURL}/payment/hold-status/${localOrderId}`);
    return response;
  }

  async cancelHoldViaAPI(localOrderId) {
    const { getApiURL } = await import('./helpers.js');
    const apiURL = getApiURL(this.page);
    const response = await this.page.request.post(`${apiURL}/payment/cancel-hold`, {
      data: { localOrderId },
    });
    return response;
  }

  // Error handling
  async getErrorMessage() {
    try {
      const error = this.page.locator('[role="alert"], .error, .error-message, [class*="error"]').first();
      return await error.textContent();
    } catch {
      return null;
    }
  }

  async hasInsufficientStockError() {
    const errorMessage = await this.getErrorMessage();
    return errorMessage?.toLowerCase().includes('stock') || 
           errorMessage?.toLowerCase().includes('available') ||
           errorMessage?.toLowerCase().includes('inventory');
  }
}

export default CheckoutPage;
