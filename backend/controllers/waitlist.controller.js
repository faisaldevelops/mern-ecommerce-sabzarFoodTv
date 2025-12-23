import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import twilio from "twilio";

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;
if (accountSid && authToken) {
	twilioClient = twilio(accountSid, authToken);
}

// TTL for waitlist entries (30 days in seconds)
const WAITLIST_TTL = 30 * 24 * 60 * 60;

/**
 * Add user to product waitlist
 * POST /api/products/:id/waitlist
 */
export const addToWaitlist = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { phoneNumber } = req.body;

		if (!phoneNumber) {
			return res.status(400).json({
				success: false,
				message: "Phone number is required"
			});
		}

		// Validate phone number format (10 digits)
		const phoneRegex = /^\d{10}$/;
		if (!phoneRegex.test(phoneNumber)) {
			return res.status(400).json({
				success: false,
				message: "Invalid phone number format. Must be 10 digits."
			});
		}

		// Check if product exists
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found"
			});
		}

		// Use phone number as unique identifier
		const waitlistKey = `waitlist:${productId}`;

		// Check if user is already on the waitlist
		const existingEntry = await redis.hget(waitlistKey, phoneNumber);
		if (existingEntry) {
			return res.status(200).json({
				success: true,
				message: "You are already on the waitlist for this product",
				alreadySubscribed: true
			});
		}

		// Add user to waitlist with timestamp
		const waitlistData = JSON.stringify({
			phoneNumber,
			subscribedAt: new Date().toISOString(),
			productName: product.name
		});

		await redis.hset(waitlistKey, phoneNumber, waitlistData);
		
		// Set expiration on the waitlist hash (renew TTL)
		await redis.expire(waitlistKey, WAITLIST_TTL);

		return res.status(200).json({
			success: true,
			message: `You will be notified on WhatsApp when ${product.name} is back in stock`,
			alreadySubscribed: false
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to add to waitlist"
		});
	}
};

/**
 * Get waitlist for a product (admin only)
 * GET /api/products/:id/waitlist
 */
export const getWaitlist = async (req, res) => {
	try {
		const { id: productId } = req.params;

		// Check if product exists
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found"
			});
		}

		const waitlistKey = `waitlist:${productId}`;
		
		// Get all waitlist entries for this product
		const waitlistData = await redis.hgetall(waitlistKey);
		
		if (!waitlistData || Object.keys(waitlistData).length === 0) {
			return res.status(200).json({
				success: true,
				productId,
				productName: product.name,
				waitlist: [],
				count: 0
			});
		}

		// Parse and format waitlist entries
		const waitlist = Object.entries(waitlistData).map(([phoneNumber, data]) => {
			const parsed = JSON.parse(data);
			return {
				phoneNumber,
				subscribedAt: parsed.subscribedAt
			};
		});

		// Sort by subscribed date (oldest first)
		waitlist.sort((a, b) => new Date(a.subscribedAt) - new Date(b.subscribedAt));

		return res.status(200).json({
			success: true,
			productId,
			productName: product.name,
			waitlist,
			count: waitlist.length
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch waitlist"
		});
	}
};

/**
 * Notify waitlist users when product is back in stock
 * Uses Twilio SMS for notifications (same as OTP flow)
 */
export const notifyWaitlist = async (productId) => {
	try {
		const waitlistKey = `waitlist:${productId}`;
		
		// Get all waitlist entries
		const waitlistData = await redis.hgetall(waitlistKey);
		
		if (!waitlistData || Object.keys(waitlistData).length === 0) {
			return { success: true, notified: 0 };
		}

		const product = await Product.findById(productId);
		if (!product) {
			return { success: false, error: "Product not found" };
		}

		// Parse waitlist entries
		const waitlist = Object.entries(waitlistData).map(([phoneNumber, data]) => {
			const parsed = JSON.parse(data);
			return {
				phoneNumber
			};
		});

		
		let notifiedCount = 0;
		let failedCount = 0;

		// Send SMS to each user using Twilio
		for (const user of waitlist) {
			if (user.phoneNumber) {
				try {
					if (twilioClient && twilioPhoneNumber) {
						const message = `Great news! ${product.name} is back in stock. Order now!`;
						await twilioClient.messages.create({
							body: message,
							from: twilioPhoneNumber,
							to: `+91${user.phoneNumber}`, // Assuming Indian phone numbers
						});
						notifiedCount++;
					} else {
						// Development mode - just log
						notifiedCount++;
					}
				} catch (error) {
					failedCount++;
				}
			}
		}

		// Clear the waitlist after notifying
		await redis.del(waitlistKey);

		return { success: true, notified: notifiedCount, failed: failedCount };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

/**
 * Remove user from waitlist
 * DELETE /api/products/:id/waitlist
 */
export const removeFromWaitlist = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { phoneNumber } = req.body;

		if (!phoneNumber) {
			return res.status(400).json({
				success: false,
				message: "Phone number is required"
			});
		}

		const waitlistKey = `waitlist:${productId}`;

		// Remove user from waitlist
		const removed = await redis.hdel(waitlistKey, phoneNumber);

		if (removed === 0) {
			return res.status(404).json({
				success: false,
				message: "You are not on the waitlist for this product"
			});
		}

		return res.status(200).json({
			success: true,
			message: "You have been removed from the waitlist"
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to remove from waitlist"
		});
	}
};
