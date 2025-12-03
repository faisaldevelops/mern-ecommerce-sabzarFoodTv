/**
 * Page Object Model for authentication-related pages
 */

export class AuthPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation
  async goToLogin() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async goToSignup() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  // Login actions
  async login(email, password) {
    await this.goToLogin();
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState('networkidle');
  }

  async loginViaAPI(email, password) {
    const apiURL = this.page.context()._options.baseURL.replace('5173', '5000');
    const response = await this.page.request.post(`${apiURL}/api/auth/login`, {
      data: { email, password },
    });
    return response;
  }

  // Signup actions
  async signup(name, email, password) {
    await this.goToSignup();
    await this.page.fill('input[name="name"], input[placeholder*="name" i]', name);
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.fill('input[name="confirmPassword"], input[placeholder*="confirm" i]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState('networkidle');
  }

  async signupViaAPI(name, email, password) {
    const apiURL = this.page.context()._options.baseURL.replace('5173', '5000');
    const response = await this.page.request.post(`${apiURL}/api/auth/signup`, {
      data: { name, email, password },
    });
    return response;
  }

  // Logout
  async logout() {
    await this.page.click('button:has-text("Logout"), a:has-text("Logout")');
    await this.page.waitForLoadState('networkidle');
  }

  async logoutViaAPI() {
    const apiURL = this.page.context()._options.baseURL.replace('5173', '5000');
    const response = await this.page.request.post(`${apiURL}/api/auth/logout`);
    return response;
  }

  // Assertions
  async isLoggedIn() {
    try {
      await this.page.waitForSelector('[data-testid="user-menu"], button:has-text("Logout")', { 
        timeout: 5000 
      });
      return true;
    } catch {
      return false;
    }
  }

  async isLoggedOut() {
    try {
      await this.page.waitForSelector('a:has-text("Login"), button:has-text("Login")', { 
        timeout: 5000 
      });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage() {
    try {
      const error = await this.page.locator('[role="alert"], .error, .error-message').first();
      return await error.textContent();
    } catch {
      return null;
    }
  }

  async getSuccessMessage() {
    try {
      const success = await this.page.locator('[role="status"], .success, .success-message').first();
      return await success.textContent();
    } catch {
      return null;
    }
  }
}

export default AuthPage;
