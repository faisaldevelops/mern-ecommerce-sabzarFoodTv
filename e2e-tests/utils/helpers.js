/**
 * Test utilities and helpers for browser automation tests
 */

import { faker } from '@faker-js/faker';

/**
 * Generate a unique email for testing
 */
export function generateEmail() {
  return `test-${Date.now()}-${faker.string.alphanumeric(6)}@test.com`;
}

/**
 * Generate user data for registration
 */
export function generateUserData() {
  return {
    name: faker.person.fullName(),
    email: generateEmail(),
    password: 'Test@123456',
  };
}

/**
 * Generate address data
 */
export function generateAddress() {
  return {
    name: faker.person.fullName(),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
    phoneNumber: faker.string.numeric(10),
  };
}

/**
 * Wait for a specific condition with timeout
 */
export async function waitFor(conditionFn, timeout = 5000, interval = 100) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await conditionFn()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Generate random delay for simulating user behavior
 */
export function randomDelay(min = 100, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Extract text content from an element
 */
export async function getTextContent(page, selector) {
  const element = await page.locator(selector).first();
  return await element.textContent();
}

/**
 * Check if element exists and is visible
 */
export async function isVisible(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get element attribute
 */
export async function getAttribute(page, selector, attribute) {
  const element = await page.locator(selector).first();
  return await element.getAttribute(attribute);
}

/**
 * Execute concurrent operations
 */
export async function executeConcurrent(operations) {
  return await Promise.all(operations.map(op => op()));
}

/**
 * Execute operations in sequence with delays
 */
export async function executeSequential(operations, delay = 100) {
  const results = [];
  for (const op of operations) {
    const result = await op();
    results.push(result);
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return results;
}

/**
 * Clear browser storage (cookies, local storage, session storage)
 */
export async function clearBrowserStorage(page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Get API URL from page context
 */
export function getApiURL(page) {
  const baseURL = page.context()._options.baseURL || 'http://localhost:5173';
  try {
    const url = new URL(baseURL);
    url.port = '5000';
    return url.toString().replace(/\/$/, '') + '/api';
  } catch (error) {
    // Fallback to simple replacement if URL parsing fails
    return baseURL.replace('5173', '5000') + '/api';
  }
}

/**
 * Get local storage data
 */
export async function getLocalStorage(page, key) {
  return await page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * Set local storage data
 */
export async function setLocalStorage(page, key, value) {
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, v),
    { k: key, v: value }
  );
}

/**
 * Parse JSON from local storage
 */
export async function getLocalStorageJSON(page, key) {
  const data = await getLocalStorage(page, key);
  return data ? JSON.parse(data) : null;
}

/**
 * Intercept network requests
 */
export async function interceptRequest(page, urlPattern, handler) {
  await page.route(urlPattern, handler);
}

/**
 * Mock API response
 */
export async function mockAPIResponse(page, urlPattern, response) {
  await page.route(urlPattern, route => {
    route.fulfill(response);
  });
}

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page, name) {
  const timestamp = Date.now();
  await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png` });
}

/**
 * Generate product data for testing
 */
export function generateProductData() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    category: faker.helpers.arrayElement(['electronics', 'clothing', 'food', 'books']),
    stockQuantity: faker.number.int({ min: 0, max: 100 }),
  };
}

/**
 * Helper to ensure test isolation
 */
export class TestContext {
  constructor() {
    this.users = [];
    this.orders = [];
    this.cleanupTasks = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  addOrder(order) {
    this.orders.push(order);
  }

  addCleanupTask(task) {
    this.cleanupTasks.push(task);
  }

  async cleanup() {
    for (const task of this.cleanupTasks.reverse()) {
      try {
        await task();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
    this.users = [];
    this.orders = [];
    this.cleanupTasks = [];
  }
}
