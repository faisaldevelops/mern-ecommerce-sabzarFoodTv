import { useState } from "react";
import { X, Bell, Phone, Mail, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const WaitlistModal = ({ isOpen, onClose, product }) => {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!phoneNumber) {
			toast.error("Please enter your phone number");
			return;
		}

		// Phone validation (10 digits for Indian numbers)
		const cleanedPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, "");
		if (!/^\d{10}$/.test(cleanedPhone)) {
			toast.error("Please enter a valid 10-digit phone number");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await axios.post(`/products/${product._id}/waitlist`, {
				phoneNumber: cleanedPhone
			});

			if (response.data.success) {
				if (response.data.alreadySubscribed) {
					toast.success(response.data.message);
				} else {
					toast.success(`✅ ${response.data.message}`);
				}
				setPhoneNumber("");
				onClose();
			}
		} catch (error) {
			console.error("Error adding to waitlist:", error);
			toast.error(error.response?.data?.message || "Failed to join waitlist. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
					aria-label="Close"
				>
					<X size={24} />
				</button>

				{/* Header */}
				<div className="mb-6">
					<div className="flex items-center gap-3 mb-2">
						<div className="bg-emerald-100 p-2 rounded-full">
							<Bell className="text-emerald-600" size={24} />
						</div>
						<h2 className="text-2xl font-bold text-gray-900">
							Notify Me
						</h2>
					</div>
					<p className="text-gray-600">
						Get notified via SMS when <span className="font-semibold">{product.name}</span> is back in stock
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit}>
					{/* Notification method info */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Notification Method
						</label>
						<div className="space-y-2">
							{/* SMS - Active */}
							<div className="flex items-center gap-3 p-3 rounded-md border-2 border-emerald-500 bg-emerald-50">
								<Phone className="text-emerald-600" size={20} />
								<div className="flex-1">
									<div className="font-medium text-emerald-700">SMS</div>
									<div className="text-xs text-emerald-600">Active</div>
								</div>
							</div>
							
							{/* Email - Coming Soon */}
							<div className="flex items-center gap-3 p-3 rounded-md border border-gray-200 bg-gray-50 opacity-60">
								<Mail className="text-gray-400" size={20} />
								<div className="flex-1">
									<div className="font-medium text-gray-700">Email</div>
									<div className="text-xs text-gray-500">Coming Soon</div>
								</div>
							</div>
							
							{/* WhatsApp - Coming Soon */}
							<div className="flex items-center gap-3 p-3 rounded-md border border-gray-200 bg-gray-50 opacity-60">
								<MessageCircle className="text-gray-400" size={20} />
								<div className="flex-1">
									<div className="font-medium text-gray-700">WhatsApp</div>
									<div className="text-xs text-gray-500">Coming Soon</div>
								</div>
							</div>
						</div>
					</div>

					{/* Phone input */}
					<div className="mb-4">
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
							Phone Number
						</label>
						<input
							type="tel"
							id="phone"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder="1234567890"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
							required
						/>
						<p className="mt-1 text-xs text-gray-500">Enter 10-digit mobile number (without +91)</p>
					</div>

					{/* Submit button */}
					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className={`flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 ${
								isSubmitting ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
									Joining...
								</>
							) : (
								<>
									<Bell size={18} />
									Notify Me
								</>
							)}
						</button>
					</div>
				</form>

				{/* Privacy note */}
				<p className="mt-4 text-xs text-gray-500 text-center">
					We'll send you a one-time SMS when this product is available.
				</p>
			</div>
		</div>
	);
};

export default WaitlistModal;
